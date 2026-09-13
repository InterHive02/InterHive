import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, Inject, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../../../common/redis/redis.service';
import { UsersService } from '../../users/users.service';
import { CommunicationService } from '../communication.service';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
  namespace: 'chat',
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger = new Logger(ChatGateway.name);
  private userSockets: Map<string, string[]> = new Map();

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private redisService: RedisService,
    private usersService: UsersService,
    @Inject(forwardRef(() => CommunicationService))
    private communicationService: CommunicationService,
  ) {}

  afterInit(server: Server) {
    this.logger.log('Chat Gateway initialized');
  }

  async handleConnection(client: Socket) {
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

      // Store user socket mapping
      if (!this.userSockets.has(userId)) {
        this.userSockets.set(userId, []);
      }
      this.userSockets.get(userId).push(client.id);

      // Store in Redis for cross-instance communication
      await this.redisService.set(`socket:${client.id}`, userId);
      await this.redisService.sadd(`user:sockets:${userId}`, client.id);

      // Join user-specific room
      client.join(`user:${userId}`);

      // Get unread count
      const unreadCount = await this.redisService.get(`unread:${userId}:total`);
      client.emit('unread_count', { count: parseInt(unreadCount) || 0 });

      this.logger.log(`Client connected: ${client.id} for user ${userId}`);
    } catch (error) {
      this.logger.error(`Connection error: ${error.message}`);
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    try {
      const userId = await this.redisService.get(`socket:${client.id}`);
      if (userId) {
        // Remove from user sockets
        const userSockets = this.userSockets.get(userId) || [];
        const index = userSockets.indexOf(client.id);
        if (index > -1) {
          userSockets.splice(index, 1);
        }
        if (userSockets.length === 0) {
          this.userSockets.delete(userId);
        }

        // Remove from Redis
        await this.redisService.srem(`user:sockets:${userId}`, client.id);
        await this.redisService.del(`socket:${client.id}`);
      }

      this.logger.log(`Client disconnected: ${client.id}`);
    } catch (error) {
      this.logger.error(`Disconnect error: ${error.message}`);
    }
  }

  @SubscribeMessage('typing')
  async handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { chatId: string; isTyping: boolean },
  ) {
    const userId = await this.redisService.get(`socket:${client.id}`);
    if (!userId) return;

    const chat = await this.communicationService.getChat(userId, data.chatId);
    if (!chat) return;

    // Send typing status to other participants
    for (const participant of chat.data.participants) {
      const pid = String((participant as any)?._id || (participant as any)?.id || participant);
      if (pid !== userId) {
        this.server.to(`user:${pid}`).emit('typing', {
          chatId: data.chatId,
          userId,
          isTyping: data.isTyping,
        });
      }
    }
  }

  @SubscribeMessage('mark_read')
  async handleMarkRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { chatId: string; messageId: string },
  ) {
    const userId = await this.redisService.get(`socket:${client.id}`);
    if (!userId) return;

    await this.communicationService.markMessageAsRead(userId, data.messageId);

    // Notify chat participants
    const chat = await this.communicationService.getChat(userId, data.chatId);
    for (const participant of chat.data.participants) {
      this.server.to(`user:${participant.id}`).emit('message_read', {
        chatId: data.chatId,
        messageId: data.messageId,
        userId,
      });
    }

    // Update unread count
    const unreadCount = await this.redisService.get(`unread:${userId}:${data.chatId}`);
    client.emit('chat_unread_count', {
      chatId: data.chatId,
      count: parseInt(unreadCount) || 0,
    });
  }

  @SubscribeMessage('mark_chat_read')
  async handleMarkChatRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { chatId: string },
  ) {
    const userId = await this.redisService.get(`socket:${client.id}`);
    if (!userId) return;

    await this.redisService.set(`unread:${userId}:${data.chatId}`, '0');

    // Update total unread count
    const total = await this.redisService.decrement(`unread:${userId}:total`);
    client.emit('unread_count', { count: Math.max(0, total) });
  }

  // Methods to send events
  sendMessageToUser(userId: string, message: any, chat: any) {
    this.server.to(`user:${userId}`).emit('new_message', {
      message,
      chat,
    });
  }

  sendChatCreated(userId: string, chat: any) {
    this.server.to(`user:${userId}`).emit('chat_created', chat);
  }

  sendChatUpdated(userId: string, chat: any) {
    this.server.to(`user:${userId}`).emit('chat_updated', chat);
  }

  // Method to check if user is online
  async isUserOnline(userId: string): Promise<boolean> {
    const count = await this.redisService.scard(`user:sockets:${userId}`);
    return count > 0;
  }

  // Method to get online users
  async getOnlineUsers(): Promise<string[]> {
    const keys = await this.redisService.keys('user:sockets:*');
    return keys.map(key => key.replace('user:sockets:', ''));
  }
}