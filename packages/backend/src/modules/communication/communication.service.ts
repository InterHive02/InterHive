import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Chat, ChatDocument } from './schemas/chat.schema';
import { Message, MessageDocument } from './schemas/message.schema';
import { Announcement, AnnouncementDocument } from './schemas/announcement.schema';
import { CreateChatDto } from './dto/create-chat.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { ChatGateway } from './gateways/chat.gateway';
import { UsersService } from '../users/users.service';
import { RedisService } from '../../common/redis/redis.service';
import { User, UserDocument } from '../users/schemas/user.schema';
import { UserRole } from '@interhive/shared';

// ─── Role-based chat permission matrix ─────────────────────────────────────
// Key = requesting user's role → Value = array of roles they may chat with
const ALLOWED_CHAT_ROLES: Record<string, string[]> = {
  [UserRole.ADMIN]: [UserRole.COMPANY, UserRole.HR, UserRole.MANAGER],
  [UserRole.COMPANY]: [UserRole.ADMIN, UserRole.MANAGER],
  [UserRole.MANAGER]: [UserRole.ADMIN, UserRole.HR, UserRole.INTERN],
  [UserRole.HR]: [UserRole.MANAGER],
  [UserRole.INTERN]: [UserRole.MANAGER],
};

@Injectable()
export class CommunicationService {
  constructor(
    @InjectModel(Chat.name) private chatModel: Model<ChatDocument>,
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    @InjectModel(Announcement.name) private announcementModel: Model<AnnouncementDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @Inject(forwardRef(() => ChatGateway))
    private chatGateway: ChatGateway,
    private usersService: UsersService,
    private redisService: RedisService,
  ) {}

  // ─── Internal helpers ─────────────────────────────────────────────────────

  private toObjectId(id: string): Types.ObjectId | null {
    return Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : null;
  }

  private participantId(p: any): string {
    return String(p?._id || p?.id || p);
  }

  /**
   * Ensure 1-on-1 chats exist for a user based on their role.
   * Creates missing chats silently.
   */
  async ensureRoleBasedChatsForUser(userId: string): Promise<void> {
    const userObjId = this.toObjectId(userId);
    if (!userObjId) return;

    const userDoc = await this.userModel.findById(userObjId).select('role').lean();
    if (!userDoc) return;

    const allowedRoles = ALLOWED_CHAT_ROLES[userDoc.role as string] || [];
    if (allowedRoles.length === 0) return;

    // Find all users whose roles we're allowed to chat with
    const targets = await this.userModel
      .find({ role: { $in: allowedRoles }, isActive: true })
      .select('_id role firstName lastName')
      .lean();

    for (const target of targets) {
      const targetId = target._id.toString();
      if (targetId === userId) continue;

      // Check if 1-on-1 chat already exists
      const existing = await this.chatModel.findOne({
        isGroupChat: false,
        participants: { $all: [userObjId, this.toObjectId(targetId)], $size: 2 },
        isActive: true,
      });

      if (!existing) {
        const chat = new this.chatModel({
          isGroupChat: false,
          participants: [userObjId, this.toObjectId(targetId)],
          createdBy: userObjId,
          isActive: true,
        });
        await chat.save();

        // Notify both users via WebSocket
        try {
          this.chatGateway.sendChatCreated(userId, chat);
          this.chatGateway.sendChatCreated(targetId, chat);
        } catch (_) {}
      }
    }
  }

  // ─── Public API ───────────────────────────────────────────────────────────

  async createChat(userId: string, createChatDto: CreateChatDto) {
    const { participants, name, isGroupChat, avatar } = createChatDto;

    // Resolve current user's role
    const currentUser = await this.userModel.findById(userId).select('role').lean();
    if (!currentUser) throw new NotFoundException('User not found');

    const allParticipants = [...new Set([userId, ...(participants || [])])];

    // Check all participants exist
    for (const pid of allParticipants) {
      await this.usersService.findById(pid);
    }

    // Enforce role permissions for 1-on-1 chats
    if (!isGroupChat && allParticipants.length === 2) {
      const otherId = allParticipants.find(p => p !== userId)!;
      const otherUser = await this.userModel.findById(otherId).select('role').lean();
      if (!otherUser) throw new NotFoundException('Participant not found');

      const allowedRoles = ALLOWED_CHAT_ROLES[currentUser.role as string] || [];
      if (!allowedRoles.includes(otherUser.role as string)) {
        throw new ForbiddenException(
          `Your role (${currentUser.role}) is not allowed to chat with role (${otherUser.role})`,
        );
      }

      // Return existing chat if present
      const existingChat = await this.chatModel.findOne({
        isGroupChat: false,
        participants: { $all: allParticipants.map(p => this.toObjectId(p)!), $size: 2 },
      });
      if (existingChat) {
        return { success: true, message: 'Chat already exists', data: existingChat };
      }
    }

    const chat = new this.chatModel({
      participants: allParticipants.map(p => this.toObjectId(p)!),
      name: isGroupChat ? name : null,
      isGroupChat: isGroupChat || false,
      avatar: avatar || null,
      createdBy: this.toObjectId(userId)!,
      lastMessage: null,
    });

    await chat.save();

    for (const pid of allParticipants) {
      try { this.chatGateway.sendChatCreated(pid, chat); } catch (_) {}
    }

    return { success: true, message: 'Chat created successfully', data: chat };
  }

  async getChats(userId: string, page: number = 1, limit: number = 50) {
    const skip = (page - 1) * limit;

    // Provision missing role-based chats before returning the list
    await this.ensureRoleBasedChatsForUser(userId);

    const userObjId = this.toObjectId(userId);

    const query: any = {
      $or: [
        { participants: userObjId },
        ...(userObjId ? [{ participants: userId }] : []),
      ],
      isActive: true,
    };

    const total = await this.chatModel.countDocuments(query);

    const chats = await this.chatModel
      .find(query)
      .populate('participants', 'firstName lastName email profilePhoto role')
      .populate('lastMessage')
      .populate('createdBy', 'firstName lastName email')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);

    const chatsWithUnread = await Promise.all(
      chats.map(async (chat) => {
        const unreadResult = await this.getChatUnreadCount(userId, chat._id.toString());
        const unreadCount = (unreadResult as any)?.data?.count ?? (unreadResult as any)?.count ?? 0;
        const obj = chat.toObject();
        return { ...obj, id: chat._id.toString(), unreadCount };
      }),
    );

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      success: true,
      data: chatsWithUnread,
      meta: { page, limit, total, totalPages, hasNext: page < totalPages, hasPrev: page > 1 },
    };
  }

  async getChat(userId: string, chatId: string) {
    if (!Types.ObjectId.isValid(chatId)) {
      throw new NotFoundException('Chat not found');
    }
    const chat = await this.chatModel.findById(chatId);
    if (!chat) throw new NotFoundException('Chat not found');

    // Verify user is a participant
    const isParticipant = (chat.participants as any[]).some(
      p => this.participantId(p) === userId,
    );
    if (!isParticipant) throw new ForbiddenException('You are not a participant of this chat');

    await chat.populate([
      { path: 'participants', select: 'firstName lastName email profilePhoto role' },
      { path: 'lastMessage' },
      { path: 'createdBy', select: 'firstName lastName email' },
    ]);

    return { success: true, data: { ...chat.toObject(), id: chat._id.toString() } };
  }

  async updateChat(userId: string, chatId: string, updateChatDto: any) {
    if (!Types.ObjectId.isValid(chatId)) throw new NotFoundException('Chat not found');
    const chat = await this.chatModel.findById(chatId);
    if (!chat) throw new NotFoundException('Chat not found');

    if (chat.isGroupChat && chat.createdBy && chat.createdBy.toString() !== userId) {
      throw new ForbiddenException('Only group admin can update chat');
    }

    Object.assign(chat, updateChatDto);
    await chat.save();

    return { success: true, message: 'Chat updated successfully', data: chat };
  }

  async deleteChat(userId: string, chatId: string) {
    if (!Types.ObjectId.isValid(chatId)) throw new NotFoundException('Chat not found');
    const chat = await this.chatModel.findById(chatId);
    if (!chat) throw new NotFoundException('Chat not found');

    chat.isActive = false;
    await chat.save();
    await this.messageModel.deleteMany({ chatId: chat._id.toString() });

    return { success: true, message: 'Chat deleted successfully' };
  }

  async sendMessage(userId: string, chatId: string, sendMessageDto: SendMessageDto) {
    if (!Types.ObjectId.isValid(chatId)) throw new NotFoundException('Chat not found');

    const chat = await this.chatModel.findById(chatId);
    if (!chat) throw new NotFoundException('Chat not found');

    // Ensure sender is a participant
    const isParticipant = (chat.participants as any[]).some(
      p => this.participantId(p) === userId,
    );
    if (!isParticipant) throw new ForbiddenException('You are not a participant of this chat');

    if (!chat.isActive) {
      chat.isActive = true;
      await chat.save();
    }

    const realChatId = chat._id.toString();

    const message = new this.messageModel({
      chatId: realChatId,
      senderId: userId,
      content: sendMessageDto.content,
      type: sendMessageDto.type || 'text',
      attachments: sendMessageDto.attachments || [],
      readBy: [userId],
    });

    await message.save();

    chat.lastMessage = message._id;
    await chat.save();

    for (const participantId of chat.participants) {
      const pid = this.participantId(participantId);
      if (pid !== userId) {
        try { this.chatGateway.sendMessageToUser(pid, message, chat); } catch (_) {}
        await this.redisService.increment(`unread:${pid}:${realChatId}`);
        await this.redisService.increment(`unread:${pid}:total`);
      }
    }

    return {
      success: true,
      message: 'Message sent successfully',
      data: {
        id: message._id.toString(),
        _id: message._id.toString(),
        chatId: realChatId,
        senderId: userId,
        content: message.content,
        type: message.type,
        attachments: message.attachments,
        createdAt: (message as any).createdAt || new Date(),
        isRead: false,
      },
    };
  }

  async getMessages(userId: string, chatId: string, page: number = 1, limit: number = 50) {
    if (!Types.ObjectId.isValid(chatId)) throw new NotFoundException('Chat not found');

    const chat = await this.chatModel.findById(chatId);
    if (!chat) throw new NotFoundException('Chat not found');

    const isParticipant = (chat.participants as any[]).some(
      p => this.participantId(p) === userId,
    );
    if (!isParticipant) throw new ForbiddenException('You are not a participant of this chat');

    const skip = (page - 1) * limit;
    const realChatId = chat._id.toString();

    const [messages, total] = await Promise.all([
      this.messageModel
        .find({ chatId: realChatId })
        .populate('senderId', 'firstName lastName email profilePhoto')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      this.messageModel.countDocuments({ chatId: realChatId }),
    ]);

    this.markChatMessagesAsRead(userId, realChatId);

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      success: true,
      data: messages.map((m: any) => ({
        id: m._id.toString(),
        _id: m._id.toString(),
        chatId: realChatId,
        senderId: m.senderId?._id?.toString() || m.senderId?.toString() || m.senderId,
        content: m.content,
        type: m.type,
        attachments: m.attachments,
        createdAt: m.createdAt,
        isRead: Array.isArray(m.readBy) ? m.readBy.includes(userId) : false,
      })).reverse(),
      meta: { page, limit, total, totalPages, hasNext: page < totalPages, hasPrev: page > 1 },
    };
  }

  async markMessageAsRead(userId: string, messageId: string) {
    const message = await this.messageModel.findById(messageId);
    if (!message) throw new NotFoundException('Message not found');

    const alreadyRead = (message.readBy as any[]).some(
      p => this.participantId(p) === userId,
    );

    if (!alreadyRead) {
      message.readBy.push(userId as any);
      await message.save();
      await this.redisService.decrement(`unread:${userId}:${message.chatId}`);
      await this.redisService.decrement(`unread:${userId}:total`);
    }

    return { success: true, message: 'Message marked as read' };
  }

  async updateMessage(userId: string, messageId: string, content: string) {
    const message = await this.messageModel.findById(messageId);
    if (!message) throw new NotFoundException('Message not found');

    if (message.senderId.toString() !== userId) {
      throw new ForbiddenException('Only sender can update message');
    }

    message.content = content;
    message.isEdited = true;
    await message.save();

    return { success: true, message: 'Message updated successfully', data: message };
  }

  async deleteMessage(userId: string, messageId: string) {
    const message = await this.messageModel.findById(messageId);
    if (!message) throw new NotFoundException('Message not found');

    if (message.senderId.toString() !== userId) {
      throw new ForbiddenException('Only sender can delete message');
    }

    message.isDeleted = true;
    message.content = 'This message was deleted';
    await message.save();

    return { success: true, message: 'Message deleted successfully' };
  }

  async addParticipant(userId: string, chatId: string, newUserId: string) {
    const chat = await this.chatModel.findById(chatId);
    if (!chat) throw new NotFoundException('Chat not found');

    if (!chat.isGroupChat) {
      throw new BadRequestException('Cannot add participants to private chat');
    }

    if (chat.createdBy.toString() !== userId) {
      throw new ForbiddenException('Only group admin can add participants');
    }

    const isMember = (chat.participants as any[]).some(
      p => this.participantId(p) === newUserId,
    );
    if (isMember) throw new BadRequestException('User already in chat');

    await this.usersService.findById(newUserId);

    chat.participants.push(newUserId as any);
    await chat.save();

    for (const participantId of chat.participants) {
      const pid = this.participantId(participantId);
      try { this.chatGateway.sendChatUpdated(pid, chat); } catch (_) {}
    }

    return { success: true, message: 'Participant added successfully', data: chat };
  }

  async removeParticipant(userId: string, chatId: string, targetUserId: string) {
    const chat = await this.chatModel.findById(chatId);
    if (!chat) throw new NotFoundException('Chat not found');

    if (!chat.isGroupChat) {
      throw new BadRequestException('Cannot remove participants from private chat');
    }

    if (chat.createdBy.toString() !== userId) {
      throw new ForbiddenException('Only group admin can remove participants');
    }

    chat.participants = (chat.participants as any[]).filter(
      p => this.participantId(p) !== targetUserId,
    );
    await chat.save();

    for (const participantId of chat.participants) {
      const pid = this.participantId(participantId);
      try { this.chatGateway.sendChatUpdated(pid, chat); } catch (_) {}
    }

    return { success: true, message: 'Participant removed successfully' };
  }

  async getUnreadCount(userId: string) {
    const total = await this.redisService.get(`unread:${userId}:total`);
    return { success: true, data: { count: parseInt(total) || 0 } };
  }

  async getChatUnreadCount(userId: string, chatId: string) {
    const count = await this.redisService.get(`unread:${userId}:${chatId}`);
    return { success: true, data: { count: parseInt(count) || 0 } };
  }

  async getStats() {
    const [chats, messages, totalUsers] = await Promise.all([
      this.chatModel.countDocuments(),
      this.messageModel.countDocuments(),
      this.usersService.getStats(),
    ]);

    return {
      success: true,
      data: {
        totalChats: chats,
        totalMessages: messages,
        totalUsers: (totalUsers as any)?.data?.total || (totalUsers as any)?.total || 0,
        averageMessagesPerChat: chats > 0 ? Math.round(messages / chats) : 0,
      },
    };
  }

  /**
   * Called when a new intern user is created (by HR/Admin).
   * Auto-provisions a 1-on-1 chat with every Manager.
   */
  async provisionInternChats(internUserId: string): Promise<void> {
    const internObjId = this.toObjectId(internUserId);
    if (!internObjId) return;

    const managers = await this.userModel
      .find({ role: UserRole.MANAGER, isActive: true })
      .select('_id')
      .lean();

    for (const manager of managers) {
      const managerId = manager._id.toString();
      const existing = await this.chatModel.findOne({
        isGroupChat: false,
        participants: { $all: [internObjId, this.toObjectId(managerId)!], $size: 2 },
      });

      if (!existing) {
        const chat = new this.chatModel({
          isGroupChat: false,
          participants: [internObjId, this.toObjectId(managerId)!],
          createdBy: internObjId,
          isActive: true,
        });
        await chat.save();
        try { this.chatGateway.sendChatCreated(managerId, chat); } catch (_) {}
        try { this.chatGateway.sendChatCreated(internUserId, chat); } catch (_) {}
      }
    }
  }

  private async markChatMessagesAsRead(userId: string, chatId: string) {
    await this.messageModel.updateMany(
      { chatId, readBy: { $ne: userId } },
      { $addToSet: { readBy: userId } },
    );
    await this.redisService.set(`unread:${userId}:${chatId}`, '0');
  }

  // ─── Announcements ────────────────────────────────────────────────────────

  async getAnnouncements(userId?: string) {
    let announcements = await this.announcementModel.find().sort({ isPinned: -1, createdAt: -1 });

    if (!announcements || announcements.length === 0) {
      const defaults = [
        {
          title: 'Sprint 3 Assessment & Code Review Scheduled',
          content:
            'All interns participating in the Full-Stack and AI Engineering tracks are reminded to submit their PRs before Friday 18:00 UTC for automated evaluation and mentor sign-off.',
          type: 'update',
          priority: 'high',
          isPinned: true,
          createdBy: { firstName: 'Operations', lastName: 'Team' },
          readBy: [],
          attachments: [],
        },
        {
          title: 'Partner Company Tech Talks & Open Office Hours',
          content:
            'Join our weekly live session with engineering leads from partner tech firms this Thursday. Link will be available on the dashboard.',
          type: 'event',
          priority: 'medium',
          isPinned: false,
          createdBy: { firstName: 'Hannah', lastName: 'HR' },
          readBy: [],
          attachments: [],
        },
        {
          title: 'Quarterly Industry Placement Drive Initiated',
          content:
            'Top-tier partner enterprises are initiating project match-making interviews. Ensure your technical skills matrix and sprint project links are updated.',
          type: 'general',
          priority: 'medium',
          isPinned: false,
          createdBy: { firstName: 'Alex', lastName: 'Admin' },
          readBy: [],
          attachments: [],
        },
      ];

      await this.announcementModel.insertMany(defaults);
      announcements = await this.announcementModel.find().sort({ isPinned: -1, createdAt: -1 });
    }

    return {
      success: true,
      data: announcements.map((a: any) => ({
        id: a._id.toString(),
        _id: a._id.toString(),
        title: a.title,
        content: a.content,
        type: a.type,
        priority: a.priority,
        isPinned: a.isPinned,
        createdBy: a.createdBy,
        createdAt: a.createdAt,
        expiresAt: a.expiresAt,
        readBy: a.readBy || [],
        attachments: a.attachments || [],
      })),
    };
  }

  async markAnnouncementAsRead(userId: string, announcementId: string) {
    if (!Types.ObjectId.isValid(announcementId)) return { success: true };
    await this.announcementModel.findByIdAndUpdate(announcementId, {
      $addToSet: { readBy: userId },
    });
    return { success: true, message: 'Announcement marked as read' };
  }

  async pinAnnouncement(announcementId: string, isPinned: boolean) {
    if (!Types.ObjectId.isValid(announcementId)) throw new NotFoundException('Announcement not found');
    const updated = await this.announcementModel.findByIdAndUpdate(
      announcementId,
      { isPinned },
      { new: true },
    );
    return { success: true, data: updated };
  }
}
