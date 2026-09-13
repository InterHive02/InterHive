import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification, NotificationDocument } from './schemas/notification.schema';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationGateway } from './gateways/notification.gateway';
import { UsersService } from '../users/users.service';
import { RedisService } from '../../common/redis/redis.service';
import { MailService } from '../../common/mail/mail.service';
import { NotificationCategory, NotificationPriority } from '@interhive/shared';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
    private notificationGateway: NotificationGateway,
    private usersService: UsersService,
    private redisService: RedisService,
    private mailService: MailService,
  ) {}

  async create(createNotificationDto: CreateNotificationDto) {
    const notification = new this.notificationModel({
      ...createNotificationDto,
      read: false,
      readAt: null,
    });

    await notification.save();

    // Send real-time notification via WebSocket
    this.notificationGateway.sendNotificationToUser(
      createNotificationDto.userId,
      notification,
    );

    // If high priority, also send email
    if (notification.priority === NotificationPriority.HIGH ||
        notification.priority === NotificationPriority.URGENT) {
      const user = await this.usersService.findById(notification.userId.toString());
      if (user?.data?.email) {
        await this.mailService.sendNotificationEmail(
          user.data.email,
          notification.title,
          notification.message,
        );
      }
    }

    return {
      success: true,
      message: 'Notification created successfully',
      data: notification,
    };
  }

  async findAll(
    userId: string,
    params: {
      page: number;
      limit: number;
      read?: boolean;
      type?: string;
    },
  ) {
    const { page, limit, read, type } = params;
    const skip = (page - 1) * limit;

    const query: any = { userId };
    if (read !== undefined) query.read = read;
    if (type) query.type = type;

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

  async getUnreadCount(userId: string) {
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
    } catch (error) {
      return {
        success: true,
        data: { count: 0 },
      };
    }
  }

  async findById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Notification not found');
    }

    const notification = await this.notificationModel.findById(id);
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    return {
      success: true,
      data: notification,
    };
  }

  async markAsRead(userId: string, notificationId: string) {
    const notification = await this.notificationModel.findOne({
      _id: notificationId,
      userId,
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    if (notification.read) {
      throw new BadRequestException('Notification already read');
    }

    notification.read = true;
    notification.readAt = new Date();
    await notification.save();

    // Update unread count in Redis
    await this.redisService.decrement(`unread:${userId}`);

    return {
      success: true,
      message: 'Notification marked as read',
      data: notification,
    };
  }

  async markAllAsRead(userId: string) {
    await this.notificationModel.updateMany(
      { userId, read: false },
      { read: true, readAt: new Date() },
    );

    // Reset unread count in Redis
    await this.redisService.set(`unread:${userId}`, '0');

    return {
      success: true,
      message: 'All notifications marked as read',
    };
  }

  async delete(userId: string, notificationId: string) {
    const notification = await this.notificationModel.findOne({
      _id: notificationId,
      userId,
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    await notification.deleteOne();

    return {
      success: true,
      message: 'Notification deleted successfully',
    };
  }

  async deleteAll(userId: string) {
    await this.notificationModel.deleteMany({ userId });

    return {
      success: true,
      message: 'All notifications deleted successfully',
    };
  }

  async broadcast(data: {
    title: string;
    message: string;
    type: string;
    roles?: string[];
  }) {
    // Get users based on roles
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
    } else {
      const allUsers = await this.usersService.findAll({
        page: 1,
        limit: 1000,
      });
      users = allUsers.data;
    }

    // Create notification for each user
    const notifications = [];
    for (const user of users) {
      const notification = new this.notificationModel({
        userId: user.id,
        title: data.title,
        message: data.message,
        type: data.type,
        priority: NotificationPriority.MEDIUM,
        read: false,
      });

      await notification.save();
      notifications.push(notification);

      // Send real-time notification
      this.notificationGateway.sendNotificationToUser(user.id, notification);
    }

    return {
      success: true,
      message: `Broadcast sent to ${notifications.length} users`,
      data: notifications,
    };
  }

  async getStats() {
    const [
      total,
      unread,
      byType,
      last24Hours,
    ] = await Promise.all([
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
}