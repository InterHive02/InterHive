import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpStatus,
  HttpCode,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Roles } from '../../core/decorators/roles.decorator';
import { CurrentUser } from '../../core/decorators/current-user.decorator';
import { UserRole } from '@interhive/shared';
import { User } from '../users/schemas/user.schema';

@ApiTags('Notifications')
@Controller('notifications')
@ApiBearerAuth()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.HR, UserRole.MANAGER)
  @ApiOperation({ summary: 'Create a new notification' })
  @ApiResponse({ status: 201, description: 'Notification created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.create(createNotificationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all notifications for current user' })
  @ApiResponse({ status: 200, description: 'Notifications retrieved successfully' })
  async findAll(
    @CurrentUser() user: User,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('read') read?: boolean,
    @Query('type') type?: string,
  ) {
    if (!user) {
      return { success: true, data: [], meta: { page: 1, limit: 10, total: 0, totalPages: 0, hasNext: false, hasPrev: false } };
    }
    const userId = (user as any)?._id?.toString() || (user as any)?.id || '';
    if (!userId) {
      return { success: true, data: [], meta: { page: 1, limit: 10, total: 0, totalPages: 0, hasNext: false, hasPrev: false } };
    }
    return this.notificationsService.findAll(userId, { page, limit, read, type });
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Get unread notification count' })
  @ApiResponse({ status: 200, description: 'Count retrieved successfully' })
  async getUnreadCount(@CurrentUser() user: User) {
    if (!user) {
      return { success: true, data: { count: 0 } };
    }
    const userId = (user as any)?._id?.toString() || (user as any)?.id || '';
    if (!userId) {
      return { success: true, data: { count: 0 } };
    }
    return this.notificationsService.getUnreadCount(userId);
  }

  @Post('broadcast')
  @Roles(UserRole.ADMIN, UserRole.HR)
  @ApiOperation({ summary: 'Broadcast notification to all users' })
  @ApiResponse({ status: 200, description: 'Broadcast sent successfully' })
  async broadcast(
    @Body('title') title: string,
    @Body('message') message: string,
    @Body('type') type: string,
    @Body('roles') roles?: string[],
  ) {
    return this.notificationsService.broadcast({ title, message, type, roles });
  }

  @Get('stats/overview')
  @Roles(UserRole.ADMIN, UserRole.HR)
  @ApiOperation({ summary: 'Get notification statistics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  async getStats() {
    return this.notificationsService.getStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get notification by ID' })
  @ApiResponse({ status: 200, description: 'Notification retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Notification not found' })
  async findById(@Param('id') id: string) {
    return this.notificationsService.findById(id);
  }

  @Put(':id/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  @ApiResponse({ status: 200, description: 'Notification marked as read' })
  @ApiResponse({ status: 404, description: 'Notification not found' })
  async markAsRead(@CurrentUser() user: User, @Param('id') id: string) {
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return this.notificationsService.markAsRead(user.id, id);
  }

  @Put('mark-all-read')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  @ApiResponse({ status: 200, description: 'All notifications marked as read' })
  async markAllAsRead(@CurrentUser() user: User) {
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return this.notificationsService.markAllAsRead(user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete notification' })
  @ApiResponse({ status: 204, description: 'Notification deleted successfully' })
  @ApiResponse({ status: 404, description: 'Notification not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@CurrentUser() user: User, @Param('id') id: string) {
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    await this.notificationsService.delete(user.id, id);
  }

  @Delete('all')
  @ApiOperation({ summary: 'Delete all notifications' })
  @ApiResponse({ status: 204, description: 'All notifications deleted' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAll(@CurrentUser() user: User) {
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    await this.notificationsService.deleteAll(user.id);
  }
}