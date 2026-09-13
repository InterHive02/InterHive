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
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const notification_schema_1 = require("./schemas/notification.schema");
const notification_gateway_1 = require("./gateways/notification.gateway");
const users_service_1 = require("../users/users.service");
const redis_service_1 = require("../../common/redis/redis.service");
const mail_service_1 = require("../../common/mail/mail.service");
const shared_1 = require("@interhive/shared");
let NotificationsService = class NotificationsService {
    constructor(notificationModel, notificationGateway, usersService, redisService, mailService) {
        this.notificationModel = notificationModel;
        this.notificationGateway = notificationGateway;
        this.usersService = usersService;
        this.redisService = redisService;
        this.mailService = mailService;
    }
    async create(createNotificationDto) {
        const notification = new this.notificationModel({
            ...createNotificationDto,
            read: false,
            readAt: null,
        });
        await notification.save();
        this.notificationGateway.sendNotificationToUser(createNotificationDto.userId, notification);
        if (notification.priority === shared_1.NotificationPriority.HIGH ||
            notification.priority === shared_1.NotificationPriority.URGENT) {
            const user = await this.usersService.findById(notification.userId.toString());
            if (user?.data?.email) {
                await this.mailService.sendNotificationEmail(user.data.email, notification.title, notification.message);
            }
        }
        return {
            success: true,
            message: 'Notification created successfully',
            data: notification,
        };
    }
    async findAll(userId, params) {
        const { page, limit, read, type } = params;
        const skip = (page - 1) * limit;
        const query = { userId };
        if (read !== undefined)
            query.read = read;
        if (type)
            query.type = type;
        const [notifications, total] = await Promise.all([
            this.notificationModel
                .find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            this.notificationModel.countDocuments(query),
        ]);
        const totalPages = Math.ceil(total / limit);
        return {
            success: true,
            data: notifications,
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
    async getUnreadCount(userId) {
        if (!userId) {
            return {
                success: true,
                data: { count: 0 },
            };
        }
        try {
            const count = await this.notificationModel.countDocuments({
                userId,
                read: false,
            });
            return {
                success: true,
                data: { count },
            };
        }
        catch (error) {
            return {
                success: true,
                data: { count: 0 },
            };
        }
    }
    async findById(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.NotFoundException('Notification not found');
        }
        const notification = await this.notificationModel.findById(id);
        if (!notification) {
            throw new common_1.NotFoundException('Notification not found');
        }
        return {
            success: true,
            data: notification,
        };
    }
    async markAsRead(userId, notificationId) {
        const notification = await this.notificationModel.findOne({
            _id: notificationId,
            userId,
        });
        if (!notification) {
            throw new common_1.NotFoundException('Notification not found');
        }
        if (notification.read) {
            throw new common_1.BadRequestException('Notification already read');
        }
        notification.read = true;
        notification.readAt = new Date();
        await notification.save();
        await this.redisService.decrement(`unread:${userId}`);
        return {
            success: true,
            message: 'Notification marked as read',
            data: notification,
        };
    }
    async markAllAsRead(userId) {
        await this.notificationModel.updateMany({ userId, read: false }, { read: true, readAt: new Date() });
        await this.redisService.set(`unread:${userId}`, '0');
        return {
            success: true,
            message: 'All notifications marked as read',
        };
    }
    async delete(userId, notificationId) {
        const notification = await this.notificationModel.findOne({
            _id: notificationId,
            userId,
        });
        if (!notification) {
            throw new common_1.NotFoundException('Notification not found');
        }
        await notification.deleteOne();
        return {
            success: true,
            message: 'Notification deleted successfully',
        };
    }
    async deleteAll(userId) {
        await this.notificationModel.deleteMany({ userId });
        return {
            success: true,
            message: 'All notifications deleted successfully',
        };
    }
    async broadcast(data) {
        let users = [];
        if (data.roles) {
            for (const role of data.roles) {
                const roleUsers = await this.usersService.findAll({
                    page: 1,
                    limit: 1000,
                    role,
                });
                users.push(...roleUsers.data);
            }
        }
        else {
            const allUsers = await this.usersService.findAll({
                page: 1,
                limit: 1000,
            });
            users = allUsers.data;
        }
        const notifications = [];
        for (const user of users) {
            const notification = new this.notificationModel({
                userId: user.id,
                title: data.title,
                message: data.message,
                type: data.type,
                priority: shared_1.NotificationPriority.MEDIUM,
                read: false,
            });
            await notification.save();
            notifications.push(notification);
            this.notificationGateway.sendNotificationToUser(user.id, notification);
        }
        return {
            success: true,
            message: `Broadcast sent to ${notifications.length} users`,
            data: notifications,
        };
    }
    async getStats() {
        const [total, unread, byType, last24Hours,] = await Promise.all([
            this.notificationModel.countDocuments(),
            this.notificationModel.countDocuments({ read: false }),
            this.notificationModel.aggregate([
                { $group: { _id: '$type', count: { $sum: 1 } } },
            ]),
            this.notificationModel.countDocuments({
                createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
            }),
        ]);
        return {
            success: true,
            data: {
                total,
                unread,
                read: total - unread,
                byType,
                last24Hours,
            },
        };
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(notification_schema_1.Notification.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        notification_gateway_1.NotificationGateway,
        users_service_1.UsersService,
        redis_service_1.RedisService,
        mail_service_1.MailService])
], NotificationsService);
