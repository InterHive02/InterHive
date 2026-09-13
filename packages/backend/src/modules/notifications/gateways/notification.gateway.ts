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
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../../../common/redis/redis.service';
import { UsersService } from '../../users/users.service';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
  namespace: 'notifications',
})
export class NotificationGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger = new Logger(NotificationGateway.name);
  private userSockets: Map<string, string[]> = new Map();

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private redisService: RedisService,
    private usersService: UsersService,
  ) {}

  afterInit(server: Server) {
    this.logger.log('Notification Gateway initialized');
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

      // Store user socket mapping
      const userId = user.data.id;
      if (!this.userSockets.has(userId)) {
        this.userSockets.set(userId, []);
      }
      this.userSockets.get(userId).push(client.id);

      // Store in Redis for cross-instance communication
      await this.redisService.set(`socket:${client.id}`, userId);
      await this.redisService.sadd(`user:sockets:${userId}`, client.id);

      // Join user-specific room
      client.join(`user:${userId}`);

      // Send unread notifications count
      const unreadCount = await this.redisService.get(`unread:${userId}`);
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

  @SubscribeMessage('mark_read')
  async handleMarkRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { notificationId: string },
  ) {
    try {
      const userId = await this.redisService.get(`socket:${client.id}`);
      if (!userId) return;

      // Update unread count
      const unreadCount = await this.redisService.decrement(`unread:${userId}`);
      client.emit('unread_count', { count: Math.max(0, unreadCount) });
    } catch (error) {
      this.logger.error(`Mark read error: ${error.message}`);
    }
  }

  @SubscribeMessage('mark_all_read')
  async handleMarkAllRead(@ConnectedSocket() client: Socket) {
    try {
      const userId = await this.redisService.get(`socket:${client.id}`);
      if (!userId) return;

      // Reset unread count
      await this.redisService.set(`unread:${userId}`, '0');
      client.emit('unread_count', { count: 0 });
    } catch (error) {
      this.logger.error(`Mark all read error: ${error.message}`);
    }
  }

  async sendNotificationToUser(userId: string, notification: any) {
    try {
      // Increment unread count
      const unreadCount = await this.redisService.increment(`unread:${userId}`);

      // Send to user's room
      this.server.to(`user:${userId}`).emit('new_notification', {
        notification,
        unreadCount,
      });

      // Also send to specific sockets if needed
      const socketIds = this.userSockets.get(userId) || [];
      for (const socketId of socketIds) {
        this.server.to(socketId).emit('new_notification', {
          notification,
          unreadCount,
        });
      }

      this.logger.log(`Notification sent to user ${userId}`);
    } catch (error) {
      this.logger.error(`Send notification error: ${error.message}`);
    }
  }

  async sendToAll(notification: any) {
    try {
      this.server.emit('new_notification', notification);
      this.logger.log('Broadcast notification sent');
    } catch (error) {
      this.logger.error(`Broadcast error: ${error.message}`);
    }
  }

  // Method to get online users
  async getOnlineUsers(): Promise<string[]> {
    const keys = await this.redisService.keys('user:sockets:*');
    return keys.map(key => key.replace('user:sockets:', ''));
  }

  // Method to check if user is online
  async isUserOnline(userId: string): Promise<boolean> {
    const count = await this.redisService.scard(`user:sockets:${userId}`);
    return count > 0;
  }
}