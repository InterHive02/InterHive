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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { CommunicationService } from './communication.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { Roles } from '../../core/decorators/roles.decorator';
import { CurrentUser } from '../../core/decorators/current-user.decorator';
import { UserRole } from '@interhive/shared';
import { User } from '../users/schemas/user.schema';

@ApiTags('Communication')
@Controller('communication')
@ApiBearerAuth()
export class CommunicationController {
  constructor(private readonly communicationService: CommunicationService) {}

  // Chats
  @Post('chats')
  @ApiOperation({ summary: 'Create a new chat' })
  @ApiResponse({ status: 201, description: 'Chat created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createChat(
    @CurrentUser() user: User,
    @Body() createChatDto: CreateChatDto,
  ) {
    return this.communicationService.createChat(user.id, createChatDto);
  }

  @Get('chats')
  @ApiOperation({ summary: 'Get all chats for current user' })
  @ApiResponse({ status: 200, description: 'Chats retrieved successfully' })
  async getChats(
    @CurrentUser() user: User,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.communicationService.getChats(user.id, page, limit);
  }

  @Get('chats/:chatId')
  @ApiOperation({ summary: 'Get chat by ID' })
  @ApiResponse({ status: 200, description: 'Chat retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Chat not found' })
  async getChat(@CurrentUser() user: User, @Param('chatId') chatId: string) {
    return this.communicationService.getChat(user.id, chatId);
  }

  @Put('chats/:chatId')
  @ApiOperation({ summary: 'Update chat' })
  @ApiResponse({ status: 200, description: 'Chat updated successfully' })
  @ApiResponse({ status: 404, description: 'Chat not found' })
  async updateChat(
    @CurrentUser() user: User,
    @Param('chatId') chatId: string,
    @Body() updateChatDto: any,
  ) {
    return this.communicationService.updateChat(user.id, chatId, updateChatDto);
  }

  @Delete('chats/:chatId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete chat' })
  @ApiResponse({ status: 204, description: 'Chat deleted successfully' })
  @ApiResponse({ status: 404, description: 'Chat not found' })
  async deleteChat(@CurrentUser() user: User, @Param('chatId') chatId: string) {
    await this.communicationService.deleteChat(user.id, chatId);
  }

  // Messages
  @Post('chats/:chatId/messages')
  @ApiOperation({ summary: 'Send message' })
  @ApiResponse({ status: 201, description: 'Message sent successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Chat not found' })
  async sendMessage(
    @CurrentUser() user: User,
    @Param('chatId') chatId: string,
    @Body() sendMessageDto: SendMessageDto,
  ) {
    return this.communicationService.sendMessage(user.id, chatId, sendMessageDto);
  }

  @Get('chats/:chatId/messages')
  @ApiOperation({ summary: 'Get messages from chat' })
  @ApiResponse({ status: 200, description: 'Messages retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Chat not found' })
  async getMessages(
    @CurrentUser() user: User,
    @Param('chatId') chatId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50,
  ) {
    return this.communicationService.getMessages(user.id, chatId, page, limit);
  }

  @Put('messages/:messageId')
  @ApiOperation({ summary: 'Update message' })
  @ApiResponse({ status: 200, description: 'Message updated successfully' })
  @ApiResponse({ status: 404, description: 'Message not found' })
  async updateMessage(
    @CurrentUser() user: User,
    @Param('messageId') messageId: string,
    @Body('content') content: string,
  ) {
    return this.communicationService.updateMessage(user.id, messageId, content);
  }

  @Delete('messages/:messageId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete message' })
  @ApiResponse({ status: 204, description: 'Message deleted successfully' })
  @ApiResponse({ status: 404, description: 'Message not found' })
  async deleteMessage(@CurrentUser() user: User, @Param('messageId') messageId: string) {
    await this.communicationService.deleteMessage(user.id, messageId);
  }

  @Put('messages/:messageId/read')
  @ApiOperation({ summary: 'Mark message as read' })
  @ApiResponse({ status: 200, description: 'Message marked as read' })
  @ApiResponse({ status: 404, description: 'Message not found' })
  async markMessageAsRead(@CurrentUser() user: User, @Param('messageId') messageId: string) {
    return this.communicationService.markMessageAsRead(user.id, messageId);
  }

  // Chat participation
  @Post('chats/:chatId/participants')
  @Roles(UserRole.ADMIN, UserRole.HR)
  @ApiOperation({ summary: 'Add participant to chat' })
  @ApiResponse({ status: 200, description: 'Participant added successfully' })
  @ApiResponse({ status: 404, description: 'Chat not found' })
  async addParticipant(
    @CurrentUser() user: User,
    @Param('chatId') chatId: string,
    @Body('userId') userId: string,
  ) {
    return this.communicationService.addParticipant(user.id, chatId, userId);
  }

  @Delete('chats/:chatId/participants/:userId')
  @Roles(UserRole.ADMIN, UserRole.HR)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove participant from chat' })
  @ApiResponse({ status: 204, description: 'Participant removed successfully' })
  @ApiResponse({ status: 404, description: 'Chat or participant not found' })
  async removeParticipant(
    @CurrentUser() user: User,
    @Param('chatId') chatId: string,
    @Param('userId') userId: string,
  ) {
    await this.communicationService.removeParticipant(user.id, chatId, userId);
  }

  // Unread counts
  @Get('unread-count')
  @ApiOperation({ summary: 'Get unread message count' })
  @ApiResponse({ status: 200, description: 'Unread count retrieved successfully' })
  async getUnreadCount(@CurrentUser() user: User) {
    return this.communicationService.getUnreadCount(user.id);
  }

  @Get('chats/:chatId/unread')
  @ApiOperation({ summary: 'Get unread count for specific chat' })
  @ApiResponse({ status: 200, description: 'Unread count retrieved successfully' })
  async getChatUnreadCount(@CurrentUser() user: User, @Param('chatId') chatId: string) {
    return this.communicationService.getChatUnreadCount(user.id, chatId);
  }

  // Admin endpoints
  @Get('stats/overview')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get communication statistics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  async getStats() {
    return this.communicationService.getStats();
  }
}