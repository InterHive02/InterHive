import { Document, Types } from 'mongoose';
import { NotificationCategory, NotificationPriority } from '@interhive/shared';

export interface INotification extends Document {
  userId: Types.ObjectId;
  title: string;
  message: string;
  type: NotificationCategory;
  priority: NotificationPriority;
  read: boolean;
  readAt?: Date;
  data?: {
    icon?: string;
    action?: string;
    metadata?: any;
  };
  recipients: Types.ObjectId[];
  delivery: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface INotificationService {
  create(notification: any): Promise<INotification>;
  findAll(userId: string, params: any): Promise<any>;
  markAsRead(userId: string, notificationId: string): Promise<INotification>;
  markAllAsRead(userId: string): Promise<void>;
  delete(userId: string, notificationId: string): Promise<void>;
  deleteAll(userId: string): Promise<void>;
  broadcast(data: any): Promise<INotification[]>;
}

export interface INotificationGateway {
  sendNotificationToUser(userId: string, notification: any): Promise<void>;
  sendToAll(notification: any): Promise<void>;
  getOnlineUsers(): Promise<string[]>;
  isUserOnline(userId: string): Promise<boolean>;
}