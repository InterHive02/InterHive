import { Document, Types } from 'mongoose';

export interface IChat extends Document {
  participants: Types.ObjectId[];
  name?: string;
  isGroupChat: boolean;
  avatar?: string;
  createdBy: Types.ObjectId;
  lastMessage?: Types.ObjectId;
  isActive: boolean;
  settings: {
    pinned: boolean;
    muted: boolean;
    notifications: boolean;
  };
}

export interface IMessage extends Document {
  chatId: Types.ObjectId;
  senderId: Types.ObjectId;
  content: string;
  type: 'text' | 'image' | 'file' | 'audio' | 'video';
  attachments?: {
    name: string;
    url: string;
    type: string;
    size: number;
  }[];
  readBy: Types.ObjectId[];
  isEdited: boolean;
  editedAt?: Date;
  isDeleted: boolean;
  replyTo?: Types.ObjectId;
}

export interface ICommunicationService {
  createChat(userId: string, createChatDto: any): Promise<any>;
  getChats(userId: string, page: number, limit: number): Promise<any>;
  getChat(userId: string, chatId: string): Promise<any>;
  sendMessage(userId: string, chatId: string, sendMessageDto: any): Promise<any>;
  getMessages(userId: string, chatId: string, page: number, limit: number): Promise<any>;
  markMessageAsRead(userId: string, messageId: string): Promise<any>;
  getUnreadCount(userId: string): Promise<any>;
}

export interface IChatGateway {
  sendMessageToUser(userId: string, message: any, chat: any): void;
  sendChatCreated(userId: string, chat: any): void;
  sendChatUpdated(userId: string, chat: any): void;
  isUserOnline(userId: string): Promise<boolean>;
  getOnlineUsers(): Promise<string[]>;
}