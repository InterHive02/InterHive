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
import { CreateChatDto } from './dto/create-chat.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { ChatGateway } from './gateways/chat.gateway';
import { UsersService } from '../users/users.service';
import { RedisService } from '../../common/redis/redis.service';

@Injectable()
export class CommunicationService {
  constructor(
    @InjectModel(Chat.name) private chatModel: Model<ChatDocument>,
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    @Inject(forwardRef(() => ChatGateway))
    private chatGateway: ChatGateway,
    private usersService: UsersService,
    private redisService: RedisService,
  ) {}

  async createChat(userId: string, createChatDto: CreateChatDto) {
    const { participants, name, isGroupChat, avatar } = createChatDto;

    // Ensure current user is in participants
    const allParticipants = [...new Set([userId, ...(participants || [])])];

    // Check if all participants exist
    for (const participantId of allParticipants) {
      await this.usersService.findById(participantId);
    }

    // Check if private chat already exists
    if (!isGroupChat && allParticipants.length === 2) {
      const existingChat = await this.chatModel.findOne({
        isGroupChat: false,
        participants: { $all: allParticipants, $size: 2 },
      });

      if (existingChat) {
        return {
          success: true,
          message: 'Chat already exists',
          data: existingChat,
        };
      }
    }

    const chat = new this.chatModel({
      participants: allParticipants,
      name: isGroupChat ? name : null,
      isGroupChat: isGroupChat || false,
      avatar: avatar || null,
      createdBy: userId,
      lastMessage: null,
    });

    await chat.save();

    // Send real-time notification
    for (const participantId of allParticipants) {
      this.chatGateway.sendChatCreated(participantId, chat);
    }

    return {
      success: true,
      message: 'Chat created successfully',
      data: chat,
    };
  }

  async getChats(userId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const query = { participants: userId, isActive: true };

    const [chats, total] = await Promise.all([
      this.chatModel
        .find(query)
        .populate('participants', 'firstName lastName email profilePhoto')
        .populate('lastMessage')
        .populate('createdBy', 'firstName lastName email')
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit),
      this.chatModel.countDocuments(query),
    ]);

    // Get unread counts
    const chatsWithUnread = await Promise.all(
      chats.map(async (chat) => {
        const unreadCount = await this.getChatUnreadCount(userId, chat.id);
        return {
          ...chat.toObject(),
          unreadCount,
        };
      }),
    );

    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      data: chatsWithUnread,
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  async getChat(userId: string, chatId: string) {
    const chat = await this.chatModel
      .findById(chatId)
      .populate('participants', 'firstName lastName email profilePhoto')
      .populate('lastMessage')
      .populate('createdBy', 'firstName lastName email');

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    const isParticipant = (chat.participants as any[]).some(
      (p: any) => String(p?._id || p?.id || p) === userId
    );

    if (!isParticipant) {
      throw new ForbiddenException('You are not a participant in this chat');
    }

    return {
      success: true,
      data: chat,
    };
  }

  async updateChat(userId: string, chatId: string, updateChatDto: any) {
    const chat = await this.chatModel.findById(chatId);
    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    const isParticipant = (chat.participants as any[]).some(
      (p: any) => String(p?._id || p?.id || p) === userId
    );

    if (!isParticipant) {
      throw new ForbiddenException('You are not a participant in this chat');
    }

    // Only group chat admins can update
    if (chat.isGroupChat && chat.createdBy.toString() !== userId) {
      throw new ForbiddenException('Only group admin can update chat');
    }

    Object.assign(chat, updateChatDto);
    await chat.save();

    return {
      success: true,
      message: 'Chat updated successfully',
      data: chat,
    };
  }

  async deleteChat(userId: string, chatId: string) {
    const chat = await this.chatModel.findById(chatId);
    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    const isParticipant = (chat.participants as any[]).some(
      (p: any) => String(p?._id || p?.id || p) === userId
    );

    if (!isParticipant) {
      throw new ForbiddenException('You are not a participant in this chat');
    }

    // Soft delete - just mark inactive
    chat.isActive = false;
    await chat.save();

    // Delete all messages
    await this.messageModel.deleteMany({ chatId });

    return {
      success: true,
      message: 'Chat deleted successfully',
    };
  }

  async sendMessage(userId: string, chatId: string, sendMessageDto: SendMessageDto) {
    const chat = await this.chatModel.findById(chatId);
    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    const isParticipant = (chat.participants as any[]).some(
      (p: any) => String(p?._id || p?.id || p) === userId
    );

    if (!isParticipant) {
      throw new ForbiddenException('You are not a participant in this chat');
    }

    if (!chat.isActive) {
      throw new BadRequestException('Chat is inactive');
    }

    const message = new this.messageModel({
      chatId,
      senderId: userId,
      content: sendMessageDto.content,
      type: sendMessageDto.type || 'text',
      attachments: sendMessageDto.attachments || [],
      readBy: [],
    });

    await message.save();

    // Update chat last message
    chat.lastMessage = message.id;
    await chat.save();

    // Send real-time message
    for (const participantId of chat.participants) {
      const pid = String((participantId as any)?._id || (participantId as any)?.id || participantId);
      if (pid !== userId) {
        this.chatGateway.sendMessageToUser(pid, message, chat);
      }
    }

    // Update unread counts in Redis
    for (const participantId of chat.participants) {
      const pid = String((participantId as any)?._id || (participantId as any)?.id || participantId);
      if (pid !== userId) {
        await this.redisService.increment(`unread:${pid}:${chatId}`);
        await this.redisService.increment(`unread:${pid}:total`);
      }
    }

    return {
      success: true,
      message: 'Message sent successfully',
      data: message,
    };
  }

  async getMessages(userId: string, chatId: string, page: number = 1, limit: number = 50) {
    const chat = await this.chatModel.findById(chatId);
    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    const isParticipant = (chat.participants as any[]).some(
      (p: any) => String(p?._id || p?.id || p) === userId
    );

    if (!isParticipant) {
      throw new ForbiddenException('You are not a participant in this chat');
    }

    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      this.messageModel
        .find({ chatId })
        .populate('senderId', 'firstName lastName email profilePhoto')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      this.messageModel.countDocuments({ chatId }),
    ]);

    // Mark messages as read asynchronously
    this.markChatMessagesAsRead(userId, chatId);

    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      data: messages.reverse(),
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  async markMessageAsRead(userId: string, messageId: string) {
    const message = await this.messageModel.findById(messageId);
    if (!message) {
      throw new NotFoundException('Message not found');
    }

    const alreadyRead = (message.readBy as any[]).some(
      (p: any) => String(p?._id || p?.id || p) === userId
    );

    if (!alreadyRead) {
      message.readBy.push(userId as any);
      await message.save();

      // Decrease unread count
      await this.redisService.decrement(`unread:${userId}:${message.chatId}`);
      await this.redisService.decrement(`unread:${userId}:total`);
    }

    return {
      success: true,
      message: 'Message marked as read',
    };
  }

  async updateMessage(userId: string, messageId: string, content: string) {
    const message = await this.messageModel.findById(messageId);
    if (!message) {
      throw new NotFoundException('Message not found');
    }

    if (message.senderId.toString() !== userId) {
      throw new ForbiddenException('Only sender can update message');
    }

    message.content = content;
    message.isEdited = true;
    await message.save();

    return {
      success: true,
      message: 'Message updated successfully',
      data: message,
    };
  }

  async deleteMessage(userId: string, messageId: string) {
    const message = await this.messageModel.findById(messageId);
    if (!message) {
      throw new NotFoundException('Message not found');
    }

    if (message.senderId.toString() !== userId) {
      throw new ForbiddenException('Only sender can delete message');
    }

    message.isDeleted = true;
    message.content = 'This message was deleted';
    await message.save();

    return {
      success: true,
      message: 'Message deleted successfully',
    };
  }

  async addParticipant(userId: string, chatId: string, newUserId: string) {
    const chat = await this.chatModel.findById(chatId);
    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    if (!chat.isGroupChat) {
      throw new BadRequestException('Cannot add participants to private chat');
    }

    if (chat.createdBy.toString() !== userId) {
      throw new ForbiddenException('Only group admin can add participants');
    }

    const isMember = (chat.participants as any[]).some(
      (p: any) => String(p?._id || p?.id || p) === newUserId
    );

    if (isMember) {
      throw new BadRequestException('User already in chat');
    }

    await this.usersService.findById(newUserId);

    chat.participants.push(newUserId as any);
    await chat.save();

    // Notify all participants
    for (const participantId of chat.participants) {
      const pid = String((participantId as any)?._id || (participantId as any)?.id || participantId);
      this.chatGateway.sendChatUpdated(pid, chat);
    }

    return {
      success: true,
      message: 'Participant added successfully',
      data: chat,
    };
  }

  async removeParticipant(userId: string, chatId: string, targetUserId: string) {
    const chat = await this.chatModel.findById(chatId);
    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    if (!chat.isGroupChat) {
      throw new BadRequestException('Cannot remove participants from private chat');
    }

    if (chat.createdBy.toString() !== userId) {
      throw new ForbiddenException('Only group admin can remove participants');
    }

    chat.participants = (chat.participants as any[]).filter(
      (p: any) => String(p?._id || p?.id || p) !== targetUserId
    );
    await chat.save();

    // Notify all participants
    for (const participantId of chat.participants) {
      const pid = String((participantId as any)?._id || (participantId as any)?.id || participantId);
      this.chatGateway.sendChatUpdated(pid, chat);
    }

    return {
      success: true,
      message: 'Participant removed successfully',
    };
  }

  async getUnreadCount(userId: string) {
    const total = await this.redisService.get(`unread:${userId}:total`);
    return {
      success: true,
      data: { count: parseInt(total) || 0 },
    };
  }

  async getChatUnreadCount(userId: string, chatId: string) {
    const count = await this.redisService.get(`unread:${userId}:${chatId}`);
    return {
      success: true,
      data: { count: parseInt(count) || 0 },
    };
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

  private async markChatMessagesAsRead(userId: string, chatId: string) {
    const messages = await this.messageModel.find({
      chatId,
      readBy: { $ne: userId },
    });

    for (const message of messages) {
      message.readBy.push(userId as any);
      await message.save();
    }

    // Reset unread count in Redis
    await this.redisService.set(`unread:${userId}:${chatId}`, '0');
  }
}
