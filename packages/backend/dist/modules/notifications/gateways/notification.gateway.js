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
var NotificationGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const redis_service_1 = require("../../../common/redis/redis.service");
const users_service_1 = require("../../users/users.service");
let NotificationGateway = NotificationGateway_1 = class NotificationGateway {
    constructor(jwtService, configService, redisService, usersService) {
        this.jwtService = jwtService;
        this.configService = configService;
        this.redisService = redisService;
        this.usersService = usersService;
        this.logger = new common_1.Logger(NotificationGateway_1.name);
        this.userSockets = new Map();
    }
    afterInit(server) {
        this.logger.log('Notification Gateway initialized');
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
            const unreadCount = await this.redisService.get(`unread:${userId}`);
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
    async handleMarkRead(client, data) {
        try {
            const userId = await this.redisService.get(`socket:${client.id}`);
            if (!userId)
                return;
            const unreadCount = await this.redisService.decrement(`unread:${userId}`);
            client.emit('unread_count', { count: Math.max(0, unreadCount) });
        }
        catch (error) {
            this.logger.error(`Mark read error: ${error.message}`);
        }
    }
    async handleMarkAllRead(client) {
        try {
            const userId = await this.redisService.get(`socket:${client.id}`);
            if (!userId)
                return;
            await this.redisService.set(`unread:${userId}`, '0');
            client.emit('unread_count', { count: 0 });
        }
        catch (error) {
            this.logger.error(`Mark all read error: ${error.message}`);
        }
    }
    async sendNotificationToUser(userId, notification) {
        try {
            const unreadCount = await this.redisService.increment(`unread:${userId}`);
            this.server.to(`user:${userId}`).emit('new_notification', {
                notification,
                unreadCount,
            });
            const socketIds = this.userSockets.get(userId) || [];
            for (const socketId of socketIds) {
                this.server.to(socketId).emit('new_notification', {
                    notification,
                    unreadCount,
                });
            }
            this.logger.log(`Notification sent to user ${userId}`);
        }
        catch (error) {
            this.logger.error(`Send notification error: ${error.message}`);
        }
    }
    async sendToAll(notification) {
        try {
            this.server.emit('new_notification', notification);
            this.logger.log('Broadcast notification sent');
        }
        catch (error) {
            this.logger.error(`Broadcast error: ${error.message}`);
        }
    }
    async getOnlineUsers() {
        const keys = await this.redisService.keys('user:sockets:*');
        return keys.map(key => key.replace('user:sockets:', ''));
    }
    async isUserOnline(userId) {
        const count = await this.redisService.scard(`user:sockets:${userId}`);
        return count > 0;
    }
};
exports.NotificationGateway = NotificationGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], NotificationGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('mark_read'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], NotificationGateway.prototype, "handleMarkRead", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('mark_all_read'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], NotificationGateway.prototype, "handleMarkAllRead", null);
exports.NotificationGateway = NotificationGateway = NotificationGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
            credentials: true,
        },
        namespace: 'notifications',
    }),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        config_1.ConfigService,
        redis_service_1.RedisService,
        users_service_1.UsersService])
], NotificationGateway);
