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
var ChatGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const redis_service_1 = require("../../../common/redis/redis.service");
const users_service_1 = require("../../users/users.service");
const communication_service_1 = require("../communication.service");
let ChatGateway = ChatGateway_1 = class ChatGateway {
    constructor(jwtService, configService, redisService, usersService, communicationService) {
        this.jwtService = jwtService;
        this.configService = configService;
        this.redisService = redisService;
        this.usersService = usersService;
        this.communicationService = communicationService;
        this.logger = new common_1.Logger(ChatGateway_1.name);
        this.userSockets = new Map();
    }
    afterInit(server) {
        this.logger.log('Chat Gateway initialized');
    }
    async handleConnection(client) {
        try {
            const token = client.handshake.auth.token;
            if (!token) {
                client.disconnect();
                return;
            }
            const decoded = this.jwtService.verify(token, {
                secret: this.configService.get('jwt.secret'),
            });
            const user = await this.usersService.findById(decoded.id);
            if (!user) {
                client.disconnect();
                return;
            }
            const userId = user.data.id;
            if (!this.userSockets.has(userId)) {
                this.userSockets.set(userId, []);
            }
            this.userSockets.get(userId).push(client.id);
            await this.redisService.set(`socket:${client.id}`, userId);
            await this.redisService.sadd(`user:sockets:${userId}`, client.id);
            client.join(`user:${userId}`);
            const unreadCount = await this.redisService.get(`unread:${userId}:total`);
            client.emit('unread_count', { count: parseInt(unreadCount) || 0 });
            this.logger.log(`Client connected: ${client.id} for user ${userId}`);
        }
        catch (error) {
            this.logger.error(`Connection error: ${error.message}`);
            client.disconnect();
        }
    }
    async handleDisconnect(client) {
        try {
            const userId = await this.redisService.get(`socket:${client.id}`);
            if (userId) {
                const userSockets = this.userSockets.get(userId) || [];
                const index = userSockets.indexOf(client.id);
                if (index > -1) {
                    userSockets.splice(index, 1);
                }
                if (userSockets.length === 0) {
                    this.userSockets.delete(userId);
                }
                await this.redisService.srem(`user:sockets:${userId}`, client.id);
                await this.redisService.del(`socket:${client.id}`);
            }
            this.logger.log(`Client disconnected: ${client.id}`);
        }
        catch (error) {
            this.logger.error(`Disconnect error: ${error.message}`);
        }
    }
    async handleTyping(client, data) {
        const userId = await this.redisService.get(`socket:${client.id}`);
        if (!userId)
            return;
        const chat = await this.communicationService.getChat(userId, data.chatId);
        if (!chat)
            return;
        for (const participant of chat.data.participants) {
            const pid = String(participant?._id || participant?.id || participant);
            if (pid !== userId) {
                this.server.to(`user:${pid}`).emit('typing', {
                    chatId: data.chatId,
                    userId,
                    isTyping: data.isTyping,
                });
            }
        }
    }
    async handleMarkRead(client, data) {
        const userId = await this.redisService.get(`socket:${client.id}`);
        if (!userId)
            return;
        await this.communicationService.markMessageAsRead(userId, data.messageId);
        const chat = await this.communicationService.getChat(userId, data.chatId);
        for (const participant of chat.data.participants) {
            this.server.to(`user:${participant.id}`).emit('message_read', {
                chatId: data.chatId,
                messageId: data.messageId,
                userId,
            });
        }
        const unreadCount = await this.redisService.get(`unread:${userId}:${data.chatId}`);
        client.emit('chat_unread_count', {
            chatId: data.chatId,
            count: parseInt(unreadCount) || 0,
        });
    }
    async handleMarkChatRead(client, data) {
        const userId = await this.redisService.get(`socket:${client.id}`);
        if (!userId)
            return;
        await this.redisService.set(`unread:${userId}:${data.chatId}`, '0');
        const total = await this.redisService.decrement(`unread:${userId}:total`);
        client.emit('unread_count', { count: Math.max(0, total) });
    }
    sendMessageToUser(userId, message, chat) {
        this.server.to(`user:${userId}`).emit('new_message', {
            message,
            chat,
        });
    }
    sendChatCreated(userId, chat) {
        this.server.to(`user:${userId}`).emit('chat_created', chat);
    }
    sendChatUpdated(userId, chat) {
        this.server.to(`user:${userId}`).emit('chat_updated', chat);
    }
    async isUserOnline(userId) {
        const count = await this.redisService.scard(`user:sockets:${userId}`);
        return count > 0;
    }
    async getOnlineUsers() {
        const keys = await this.redisService.keys('user:sockets:*');
        return keys.map(key => key.replace('user:sockets:', ''));
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('typing'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleTyping", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('mark_read'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleMarkRead", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('mark_chat_read'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleMarkChatRead", null);
exports.ChatGateway = ChatGateway = ChatGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
            credentials: true,
        },
        namespace: 'chat',
    }),
    __param(4, (0, common_1.Inject)((0, common_1.forwardRef)(() => communication_service_1.CommunicationService))),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        config_1.ConfigService,
        redis_service_1.RedisService,
        users_service_1.UsersService,
        communication_service_1.CommunicationService])
], ChatGateway);
