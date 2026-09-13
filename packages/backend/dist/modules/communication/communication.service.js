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
const chat_gateway_1 = require("./gateways/chat.gateway");
const users_service_1 = require("../users/users.service");
const redis_service_1 = require("../../common/redis/redis.service");
let CommunicationService = class CommunicationService {
    constructor(chatModel, messageModel, chatGateway, usersService, redisService) {
        this.chatModel = chatModel;
        this.messageModel = messageModel;
        this.chatGateway = chatGateway;
        this.usersService = usersService;
        this.redisService = redisService;
    }
    async createChat(userId, createChatDto) {
        const { participants, name, isGroupChat, avatar } = createChatDto;
        const allParticipants = [...new Set([userId, ...(participants || [])])];
        for (const participantId of allParticipants) {
            await this.usersService.findById(participantId);
        }
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
        for (const participantId of allParticipants) {
            this.chatGateway.sendChatCreated(participantId, chat);
        }
        return {
            success: true,
            message: 'Chat created successfully',
            data: chat,
        };
    }
    async getChats(userId, page = 1, limit = 10) {
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
        const chatsWithUnread = await Promise.all(chats.map(async (chat) => {
            const unreadCount = await this.getChatUnreadCount(userId, chat.id);
            return {
                ...chat.toObject(),
                unreadCount,
            };
        }));
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
    async getChat(userId, chatId) {
        const chat = await this.chatModel
            .findById(chatId)
            .populate('participants', 'firstName lastName email profilePhoto')
            .populate('lastMessage')
            .populate('createdBy', 'firstName lastName email');
        if (!chat) {
            throw new common_1.NotFoundException('Chat not found');
        }
        const isParticipant = chat.participants.some((p) => String(p?._id || p?.id || p) === userId);
        if (!isParticipant) {
            throw new common_1.ForbiddenException('You are not a participant in this chat');
        }
        return {
            success: true,
            data: chat,
        };
    }
    async updateChat(userId, chatId, updateChatDto) {
        const chat = await this.chatModel.findById(chatId);
        if (!chat) {
            throw new common_1.NotFoundException('Chat not found');
        }
        const isParticipant = chat.participants.some((p) => String(p?._id || p?.id || p) === userId);
        if (!isParticipant) {
            throw new common_1.ForbiddenException('You are not a participant in this chat');
        }
        if (chat.isGroupChat && chat.createdBy.toString() !== userId) {
            throw new common_1.ForbiddenException('Only group admin can update chat');
        }
        Object.assign(chat, updateChatDto);
        await chat.save();
        return {
            success: true,
            message: 'Chat updated successfully',
            data: chat,
        };
    }
    async deleteChat(userId, chatId) {
        const chat = await this.chatModel.findById(chatId);
        if (!chat) {
            throw new common_1.NotFoundException('Chat not found');
        }
        const isParticipant = chat.participants.some((p) => String(p?._id || p?.id || p) === userId);
        if (!isParticipant) {
            throw new common_1.ForbiddenException('You are not a participant in this chat');
        }
        chat.isActive = false;
        await chat.save();
        await this.messageModel.deleteMany({ chatId });
        return {
            success: true,
            message: 'Chat deleted successfully',
        };
    }
    async sendMessage(userId, chatId, sendMessageDto) {
        const chat = await this.chatModel.findById(chatId);
        if (!chat) {
            throw new common_1.NotFoundException('Chat not found');
        }
        const isParticipant = chat.participants.some((p) => String(p?._id || p?.id || p) === userId);
        if (!isParticipant) {
            throw new common_1.ForbiddenException('You are not a participant in this chat');
        }
        if (!chat.isActive) {
            throw new common_1.BadRequestException('Chat is inactive');
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
        chat.lastMessage = message.id;
        await chat.save();
        for (const participantId of chat.participants) {
            const pid = String(participantId?._id || participantId?.id || participantId);
            if (pid !== userId) {
                this.chatGateway.sendMessageToUser(pid, message, chat);
            }
        }
        for (const participantId of chat.participants) {
            const pid = String(participantId?._id || participantId?.id || participantId);
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
    async getMessages(userId, chatId, page = 1, limit = 50) {
        const chat = await this.chatModel.findById(chatId);
        if (!chat) {
            throw new common_1.NotFoundException('Chat not found');
        }
        const isParticipant = chat.participants.some((p) => String(p?._id || p?.id || p) === userId);
        if (!isParticipant) {
            throw new common_1.ForbiddenException('You are not a participant in this chat');
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
    async markMessageAsRead(userId, messageId) {
        const message = await this.messageModel.findById(messageId);
        if (!message) {
            throw new common_1.NotFoundException('Message not found');
        }
        const alreadyRead = message.readBy.some((p) => String(p?._id || p?.id || p) === userId);
        if (!alreadyRead) {
            message.readBy.push(userId);
            await message.save();
            await this.redisService.decrement(`unread:${userId}:${message.chatId}`);
            await this.redisService.decrement(`unread:${userId}:total`);
        }
        return {
            success: true,
            message: 'Message marked as read',
        };
    }
    async updateMessage(userId, messageId, content) {
        const message = await this.messageModel.findById(messageId);
        if (!message) {
            throw new common_1.NotFoundException('Message not found');
        }
        if (message.senderId.toString() !== userId) {
            throw new common_1.ForbiddenException('Only sender can update message');
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
    async deleteMessage(userId, messageId) {
        const message = await this.messageModel.findById(messageId);
        if (!message) {
            throw new common_1.NotFoundException('Message not found');
        }
        if (message.senderId.toString() !== userId) {
            throw new common_1.ForbiddenException('Only sender can delete message');
        }
        message.isDeleted = true;
        message.content = 'This message was deleted';
        await message.save();
        return {
            success: true,
            message: 'Message deleted successfully',
        };
    }
    async addParticipant(userId, chatId, newUserId) {
        const chat = await this.chatModel.findById(chatId);
        if (!chat) {
            throw new common_1.NotFoundException('Chat not found');
        }
        if (!chat.isGroupChat) {
            throw new common_1.BadRequestException('Cannot add participants to private chat');
        }
        if (chat.createdBy.toString() !== userId) {
            throw new common_1.ForbiddenException('Only group admin can add participants');
        }
        const isMember = chat.participants.some((p) => String(p?._id || p?.id || p) === newUserId);
        if (isMember) {
            throw new common_1.BadRequestException('User already in chat');
        }
        await this.usersService.findById(newUserId);
        chat.participants.push(newUserId);
        await chat.save();
        for (const participantId of chat.participants) {
            const pid = String(participantId?._id || participantId?.id || participantId);
            this.chatGateway.sendChatUpdated(pid, chat);
        }
        return {
            success: true,
            message: 'Participant added successfully',
            data: chat,
        };
    }
    async removeParticipant(userId, chatId, targetUserId) {
        const chat = await this.chatModel.findById(chatId);
        if (!chat) {
            throw new common_1.NotFoundException('Chat not found');
        }
        if (!chat.isGroupChat) {
            throw new common_1.BadRequestException('Cannot remove participants from private chat');
        }
        if (chat.createdBy.toString() !== userId) {
            throw new common_1.ForbiddenException('Only group admin can remove participants');
        }
        chat.participants = chat.participants.filter((p) => String(p?._id || p?.id || p) !== targetUserId);
        await chat.save();
        for (const participantId of chat.participants) {
            const pid = String(participantId?._id || participantId?.id || participantId);
            this.chatGateway.sendChatUpdated(pid, chat);
        }
        return {
            success: true,
            message: 'Participant removed successfully',
        };
    }
    async getUnreadCount(userId) {
        const total = await this.redisService.get(`unread:${userId}:total`);
        return {
            success: true,
            data: { count: parseInt(total) || 0 },
        };
    }
    async getChatUnreadCount(userId, chatId) {
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
                totalUsers: totalUsers?.data?.total || totalUsers?.total || 0,
                averageMessagesPerChat: chats > 0 ? Math.round(messages / chats) : 0,
            },
        };
    }
    async markChatMessagesAsRead(userId, chatId) {
        const messages = await this.messageModel.find({
            chatId,
            readBy: { $ne: userId },
        });
        for (const message of messages) {
            message.readBy.push(userId);
            await message.save();
        }
        await this.redisService.set(`unread:${userId}:${chatId}`, '0');
    }
};
exports.CommunicationService = CommunicationService;
exports.CommunicationService = CommunicationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(chat_schema_1.Chat.name)),
    __param(1, (0, mongoose_1.InjectModel)(message_schema_1.Message.name)),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => chat_gateway_1.ChatGateway))),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        chat_gateway_1.ChatGateway,
        users_service_1.UsersService,
        redis_service_1.RedisService])
], CommunicationService);
