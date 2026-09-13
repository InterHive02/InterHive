"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommunicationService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const chat_schema_1 = require("./schemas/chat.schema");
const message_schema_1 = require("./schemas/message.schema");
const announcement_schema_1 = require("./schemas/announcement.schema");
const chat_gateway_1 = require("./gateways/chat.gateway");
const users_service_1 = require("../users/users.service");
const redis_service_1 = require("../../common/redis/redis.service");
const user_schema_1 = require("../users/schemas/user.schema");
const shared_1 = require("@interhive/shared");
const ALLOWED_CHAT_ROLES = {
    [shared_1.UserRole.ADMIN]: [shared_1.UserRole.COMPANY, shared_1.UserRole.HR, shared_1.UserRole.MANAGER],
    [shared_1.UserRole.COMPANY]: [shared_1.UserRole.ADMIN, shared_1.UserRole.MANAGER],
    [shared_1.UserRole.MANAGER]: [shared_1.UserRole.ADMIN, shared_1.UserRole.HR, shared_1.UserRole.INTERN],
    [shared_1.UserRole.HR]: [shared_1.UserRole.MANAGER],
    [shared_1.UserRole.INTERN]: [shared_1.UserRole.MANAGER],
};
let CommunicationService = class CommunicationService {
    constructor(chatModel, messageModel, announcementModel, userModel, chatGateway, usersService, redisService) {
        this.chatModel = chatModel;
        this.messageModel = messageModel;
        this.announcementModel = announcementModel;
        this.userModel = userModel;
        this.chatGateway = chatGateway;
        this.usersService = usersService;
        this.redisService = redisService;
    }
    toObjectId(id) {
        return mongoose_2.Types.ObjectId.isValid(id) ? new mongoose_2.Types.ObjectId(id) : null;
    }
    participantId(p) {
        return String(p?._id || p?.id || p);
    }
    async ensureRoleBasedChatsForUser(userId) {
        const userObjId = this.toObjectId(userId);
        if (!userObjId)
            return;
        const userDoc = await this.userModel.findById(userObjId).select('role').lean();
        if (!userDoc)
            return;
        const allowedRoles = ALLOWED_CHAT_ROLES[userDoc.role] || [];
        if (allowedRoles.length === 0)
            return;
        const targets = await this.userModel
            .find({ role: { $in: allowedRoles }, isActive: true })
            .select('_id role firstName lastName')
            .lean();
        for (const target of targets) {
            const targetId = target._id.toString();
            if (targetId === userId)
                continue;
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
                try {
                    this.chatGateway.sendChatCreated(userId, chat);
                    this.chatGateway.sendChatCreated(targetId, chat);
                }
                catch (_) { }
            }
        }
    }
    async createChat(userId, createChatDto) {
        const { participants, name, isGroupChat, avatar } = createChatDto;
        const currentUser = await this.userModel.findById(userId).select('role').lean();
        if (!currentUser)
            throw new common_1.NotFoundException('User not found');
        const allParticipants = [...new Set([userId, ...(participants || [])])];
        for (const pid of allParticipants) {
            await this.usersService.findById(pid);
        }
        if (!isGroupChat && allParticipants.length === 2) {
            const otherId = allParticipants.find(p => p !== userId);
            const otherUser = await this.userModel.findById(otherId).select('role').lean();
            if (!otherUser)
                throw new common_1.NotFoundException('Participant not found');
            const allowedRoles = ALLOWED_CHAT_ROLES[currentUser.role] || [];
            if (!allowedRoles.includes(otherUser.role)) {
                throw new common_1.ForbiddenException(`Your role (${currentUser.role}) is not allowed to chat with role (${otherUser.role})`);
            }
            const existingChat = await this.chatModel.findOne({
                isGroupChat: false,
                participants: { $all: allParticipants.map(p => this.toObjectId(p)), $size: 2 },
            });
            if (existingChat) {
                return { success: true, message: 'Chat already exists', data: existingChat };
            }
        }
        const chat = new this.chatModel({
            participants: allParticipants.map(p => this.toObjectId(p)),
            name: isGroupChat ? name : null,
            isGroupChat: isGroupChat || false,
            avatar: avatar || null,
            createdBy: this.toObjectId(userId),
            lastMessage: null,
        });
        await chat.save();
        for (const pid of allParticipants) {
            try {
                this.chatGateway.sendChatCreated(pid, chat);
            }
            catch (_) { }
        }
        return { success: true, message: 'Chat created successfully', data: chat };
    }
    async getChats(userId, page = 1, limit = 50) {
        const skip = (page - 1) * limit;
        await this.ensureRoleBasedChatsForUser(userId);
        const userObjId = this.toObjectId(userId);
        const query = {
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
        const chatsWithUnread = await Promise.all(chats.map(async (chat) => {
            const unreadResult = await this.getChatUnreadCount(userId, chat._id.toString());
            const unreadCount = unreadResult?.data?.count ?? unreadResult?.count ?? 0;
            const obj = chat.toObject();
            return { ...obj, id: chat._id.toString(), unreadCount };
        }));
        const totalPages = Math.ceil(total / limit) || 1;
        return {
            success: true,
            data: chatsWithUnread,
            meta: { page, limit, total, totalPages, hasNext: page < totalPages, hasPrev: page > 1 },
        };
    }
    async getChat(userId, chatId) {
        if (!mongoose_2.Types.ObjectId.isValid(chatId)) {
            throw new common_1.NotFoundException('Chat not found');
        }
        const chat = await this.chatModel.findById(chatId);
        if (!chat)
            throw new common_1.NotFoundException('Chat not found');
        const isParticipant = chat.participants.some(p => this.participantId(p) === userId);
        if (!isParticipant)
            throw new common_1.ForbiddenException('You are not a participant of this chat');
        await chat.populate([
            { path: 'participants', select: 'firstName lastName email profilePhoto role' },
            { path: 'lastMessage' },
            { path: 'createdBy', select: 'firstName lastName email' },
        ]);
        return { success: true, data: { ...chat.toObject(), id: chat._id.toString() } };
    }
    async updateChat(userId, chatId, updateChatDto) {
        if (!mongoose_2.Types.ObjectId.isValid(chatId))
            throw new common_1.NotFoundException('Chat not found');
        const chat = await this.chatModel.findById(chatId);
        if (!chat)
            throw new common_1.NotFoundException('Chat not found');
        if (chat.isGroupChat && chat.createdBy && chat.createdBy.toString() !== userId) {
            throw new common_1.ForbiddenException('Only group admin can update chat');
        }
        Object.assign(chat, updateChatDto);
        await chat.save();
        return { success: true, message: 'Chat updated successfully', data: chat };
    }
    async deleteChat(userId, chatId) {
        if (!mongoose_2.Types.ObjectId.isValid(chatId))
            throw new common_1.NotFoundException('Chat not found');
        const chat = await this.chatModel.findById(chatId);
        if (!chat)
            throw new common_1.NotFoundException('Chat not found');
        chat.isActive = false;
        await chat.save();
        await this.messageModel.deleteMany({ chatId: chat._id.toString() });
        return { success: true, message: 'Chat deleted successfully' };
    }
    async sendMessage(userId, chatId, sendMessageDto) {
        if (!mongoose_2.Types.ObjectId.isValid(chatId))
            throw new common_1.NotFoundException('Chat not found');
        const chat = await this.chatModel.findById(chatId);
        if (!chat)
            throw new common_1.NotFoundException('Chat not found');
        const isParticipant = chat.participants.some(p => this.participantId(p) === userId);
        if (!isParticipant)
            throw new common_1.ForbiddenException('You are not a participant of this chat');
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
                try {
                    this.chatGateway.sendMessageToUser(pid, message, chat);
                }
                catch (_) { }
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
                createdAt: message.createdAt || new Date(),
                isRead: false,
            },
        };
    }
    async getMessages(userId, chatId, page = 1, limit = 50) {
        if (!mongoose_2.Types.ObjectId.isValid(chatId))
            throw new common_1.NotFoundException('Chat not found');
        const chat = await this.chatModel.findById(chatId);
        if (!chat)
            throw new common_1.NotFoundException('Chat not found');
        const isParticipant = chat.participants.some(p => this.participantId(p) === userId);
        if (!isParticipant)
            throw new common_1.ForbiddenException('You are not a participant of this chat');
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
            data: messages.map((m) => ({
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
    async markMessageAsRead(userId, messageId) {
        const message = await this.messageModel.findById(messageId);
        if (!message)
            throw new common_1.NotFoundException('Message not found');
        const alreadyRead = message.readBy.some(p => this.participantId(p) === userId);
        if (!alreadyRead) {
            message.readBy.push(userId);
            await message.save();
            await this.redisService.decrement(`unread:${userId}:${message.chatId}`);
            await this.redisService.decrement(`unread:${userId}:total`);
        }
        return { success: true, message: 'Message marked as read' };
    }
    async updateMessage(userId, messageId, content) {
        const message = await this.messageModel.findById(messageId);
        if (!message)
            throw new common_1.NotFoundException('Message not found');
        if (message.senderId.toString() !== userId) {
            throw new common_1.ForbiddenException('Only sender can update message');
        }
        message.content = content;
        message.isEdited = true;
        await message.save();
        return { success: true, message: 'Message updated successfully', data: message };
    }
    async deleteMessage(userId, messageId) {
        const message = await this.messageModel.findById(messageId);
        if (!message)
            throw new common_1.NotFoundException('Message not found');
        if (message.senderId.toString() !== userId) {
            throw new common_1.ForbiddenException('Only sender can delete message');
        }
        message.isDeleted = true;
        message.content = 'This message was deleted';
        await message.save();
        return { success: true, message: 'Message deleted successfully' };
    }
    async addParticipant(userId, chatId, newUserId) {
        const chat = await this.chatModel.findById(chatId);
        if (!chat)
            throw new common_1.NotFoundException('Chat not found');
        if (!chat.isGroupChat) {
            throw new common_1.BadRequestException('Cannot add participants to private chat');
        }
        if (chat.createdBy.toString() !== userId) {
            throw new common_1.ForbiddenException('Only group admin can add participants');
        }
        const isMember = chat.participants.some(p => this.participantId(p) === newUserId);
        if (isMember)
            throw new common_1.BadRequestException('User already in chat');
        await this.usersService.findById(newUserId);
        chat.participants.push(newUserId);
        await chat.save();
        for (const participantId of chat.participants) {
            const pid = this.participantId(participantId);
            try {
                this.chatGateway.sendChatUpdated(pid, chat);
            }
            catch (_) { }
        }
        return { success: true, message: 'Participant added successfully', data: chat };
    }
    async removeParticipant(userId, chatId, targetUserId) {
        const chat = await this.chatModel.findById(chatId);
        if (!chat)
            throw new common_1.NotFoundException('Chat not found');
        if (!chat.isGroupChat) {
            throw new common_1.BadRequestException('Cannot remove participants from private chat');
        }
        if (chat.createdBy.toString() !== userId) {
            throw new common_1.ForbiddenException('Only group admin can remove participants');
        }
        chat.participants = chat.participants.filter(p => this.participantId(p) !== targetUserId);
        await chat.save();
        for (const participantId of chat.participants) {
            const pid = this.participantId(participantId);
            try {
                this.chatGateway.sendChatUpdated(pid, chat);
            }
            catch (_) { }
        }
        return { success: true, message: 'Participant removed successfully' };
    }
    async getUnreadCount(userId) {
        const total = await this.redisService.get(`unread:${userId}:total`);
        return { success: true, data: { count: parseInt(total) || 0 } };
    }
    async getChatUnreadCount(userId, chatId) {
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
                totalUsers: totalUsers?.data?.total || totalUsers?.total || 0,
                averageMessagesPerChat: chats > 0 ? Math.round(messages / chats) : 0,
            },
        };
    }
    async provisionInternChats(internUserId) {
        const internObjId = this.toObjectId(internUserId);
        if (!internObjId)
            return;
        const managers = await this.userModel
            .find({ role: shared_1.UserRole.MANAGER, isActive: true })
            .select('_id')
            .lean();
        for (const manager of managers) {
            const managerId = manager._id.toString();
            const existing = await this.chatModel.findOne({
                isGroupChat: false,
                participants: { $all: [internObjId, this.toObjectId(managerId)], $size: 2 },
            });
            if (!existing) {
                const chat = new this.chatModel({
                    isGroupChat: false,
                    participants: [internObjId, this.toObjectId(managerId)],
                    createdBy: internObjId,
                    isActive: true,
                });
                await chat.save();
                try {
                    this.chatGateway.sendChatCreated(managerId, chat);
                }
                catch (_) { }
                try {
                    this.chatGateway.sendChatCreated(internUserId, chat);
                }
                catch (_) { }
            }
        }
    }
    async markChatMessagesAsRead(userId, chatId) {
        await this.messageModel.updateMany({ chatId, readBy: { $ne: userId } }, { $addToSet: { readBy: userId } });
        await this.redisService.set(`unread:${userId}:${chatId}`, '0');
    }
    async getAnnouncements(userId) {
        let announcements = await this.announcementModel.find().sort({ isPinned: -1, createdAt: -1 });
        if (!announcements || announcements.length === 0) {
            const defaults = [
                {
                    title: 'Sprint 3 Assessment & Code Review Scheduled',
                    content: 'All interns participating in the Full-Stack and AI Engineering tracks are reminded to submit their PRs before Friday 18:00 UTC for automated evaluation and mentor sign-off.',
                    type: 'update',
                    priority: 'high',
                    isPinned: true,
                    createdBy: { firstName: 'Operations', lastName: 'Team' },
                    readBy: [],
                    attachments: [],
                },
                {
                    title: 'Partner Company Tech Talks & Open Office Hours',
                    content: 'Join our weekly live session with engineering leads from partner tech firms this Thursday. Link will be available on the dashboard.',
                    type: 'event',
                    priority: 'medium',
                    isPinned: false,
                    createdBy: { firstName: 'Hannah', lastName: 'HR' },
                    readBy: [],
                    attachments: [],
                },
                {
                    title: 'Quarterly Industry Placement Drive Initiated',
                    content: 'Top-tier partner enterprises are initiating project match-making interviews. Ensure your technical skills matrix and sprint project links are updated.',
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
            data: announcements.map((a) => ({
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
    async markAnnouncementAsRead(userId, announcementId) {
        if (!mongoose_2.Types.ObjectId.isValid(announcementId))
            return { success: true };
        await this.announcementModel.findByIdAndUpdate(announcementId, {
            $addToSet: { readBy: userId },
        });
        return { success: true, message: 'Announcement marked as read' };
    }
    async pinAnnouncement(announcementId, isPinned) {
        if (!mongoose_2.Types.ObjectId.isValid(announcementId))
            throw new common_1.NotFoundException('Announcement not found');
        const updated = await this.announcementModel.findByIdAndUpdate(announcementId, { isPinned }, { new: true });
        return { success: true, data: updated };
    }
};
exports.CommunicationService = CommunicationService;
exports.CommunicationService = CommunicationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(chat_schema_1.Chat.name)),
    __param(1, (0, mongoose_1.InjectModel)(message_schema_1.Message.name)),
    __param(2, (0, mongoose_1.InjectModel)(announcement_schema_1.Announcement.name)),
    __param(3, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(4, (0, common_1.Inject)((0, common_1.forwardRef)(() => chat_gateway_1.ChatGateway))),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        chat_gateway_1.ChatGateway,
        users_service_1.UsersService,
        redis_service_1.RedisService])
], CommunicationService);
