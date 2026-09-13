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
exports.CommunicationController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const communication_service_1 = require("./communication.service");
const create_chat_dto_1 = require("./dto/create-chat.dto");
const send_message_dto_1 = require("./dto/send-message.dto");
const roles_decorator_1 = require("../../core/decorators/roles.decorator");
const current_user_decorator_1 = require("../../core/decorators/current-user.decorator");
const shared_1 = require("@interhive/shared");
const user_schema_1 = require("../users/schemas/user.schema");
let CommunicationController = class CommunicationController {
    constructor(communicationService) {
        this.communicationService = communicationService;
    }
    async getAnnouncements(user) {
        return this.communicationService.getAnnouncements(user?.id);
    }
    async markAnnouncementAsRead(user, id) {
        return this.communicationService.markAnnouncementAsRead(user?.id, id);
    }
    async pinAnnouncement(id, isPinned) {
        return this.communicationService.pinAnnouncement(id, isPinned);
    }
    async createChat(user, createChatDto) {
        return this.communicationService.createChat(user.id, createChatDto);
    }
    async getChats(user, page = 1, limit = 10) {
        return this.communicationService.getChats(user.id, page, limit);
    }
    async getChat(user, chatId) {
        return this.communicationService.getChat(user.id, chatId);
    }
    async updateChat(user, chatId, updateChatDto) {
        return this.communicationService.updateChat(user.id, chatId, updateChatDto);
    }
    async deleteChat(user, chatId) {
        await this.communicationService.deleteChat(user.id, chatId);
    }
    async sendMessage(user, chatId, sendMessageDto) {
        return this.communicationService.sendMessage(user.id, chatId, sendMessageDto);
    }
    async getMessages(user, chatId, page = 1, limit = 50) {
        return this.communicationService.getMessages(user.id, chatId, page, limit);
    }
    async updateMessage(user, messageId, content) {
        return this.communicationService.updateMessage(user.id, messageId, content);
    }
    async deleteMessage(user, messageId) {
        await this.communicationService.deleteMessage(user.id, messageId);
    }
    async markMessageAsRead(user, messageId) {
        return this.communicationService.markMessageAsRead(user.id, messageId);
    }
    async addParticipant(user, chatId, userId) {
        return this.communicationService.addParticipant(user.id, chatId, userId);
    }
    async removeParticipant(user, chatId, userId) {
        await this.communicationService.removeParticipant(user.id, chatId, userId);
    }
    async getUnreadCount(user) {
        return this.communicationService.getUnreadCount(user.id);
    }
    async getChatUnreadCount(user, chatId) {
        return this.communicationService.getChatUnreadCount(user.id, chatId);
    }
    async getStats() {
        return this.communicationService.getStats();
    }
};
exports.CommunicationController = CommunicationController;
__decorate([
    (0, common_1.Get)('announcements'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all announcements' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Announcements retrieved successfully' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User]),
    __metadata("design:returntype", Promise)
], CommunicationController.prototype, "getAnnouncements", null);
__decorate([
    (0, common_1.Post)('announcements/:id/read'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark announcement as read' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Announcement marked as read' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User, String]),
    __metadata("design:returntype", Promise)
], CommunicationController.prototype, "markAnnouncementAsRead", null);
__decorate([
    (0, common_1.Patch)('announcements/:id/pin'),
    (0, roles_decorator_1.Roles)(shared_1.UserRole.ADMIN, shared_1.UserRole.HR),
    (0, swagger_1.ApiOperation)({ summary: 'Pin or unpin announcement' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Announcement pin status updated' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('isPinned')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean]),
    __metadata("design:returntype", Promise)
], CommunicationController.prototype, "pinAnnouncement", null);
__decorate([
    (0, common_1.Post)('chats'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new chat' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Chat created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User,
        create_chat_dto_1.CreateChatDto]),
    __metadata("design:returntype", Promise)
], CommunicationController.prototype, "createChat", null);
__decorate([
    (0, common_1.Get)('chats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all chats for current user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Chats retrieved successfully' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User, Number, Number]),
    __metadata("design:returntype", Promise)
], CommunicationController.prototype, "getChats", null);
__decorate([
    (0, common_1.Get)('chats/:chatId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get chat by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Chat retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Chat not found' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('chatId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User, String]),
    __metadata("design:returntype", Promise)
], CommunicationController.prototype, "getChat", null);
__decorate([
    (0, common_1.Put)('chats/:chatId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update chat' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Chat updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Chat not found' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('chatId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User, String, Object]),
    __metadata("design:returntype", Promise)
], CommunicationController.prototype, "updateChat", null);
__decorate([
    (0, common_1.Delete)('chats/:chatId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete chat' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Chat deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Chat not found' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('chatId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User, String]),
    __metadata("design:returntype", Promise)
], CommunicationController.prototype, "deleteChat", null);
__decorate([
    (0, common_1.Post)('chats/:chatId/messages'),
    (0, swagger_1.ApiOperation)({ summary: 'Send message' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Message sent successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Chat not found' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('chatId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User, String, send_message_dto_1.SendMessageDto]),
    __metadata("design:returntype", Promise)
], CommunicationController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.Get)('chats/:chatId/messages'),
    (0, swagger_1.ApiOperation)({ summary: 'Get messages from chat' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Messages retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Chat not found' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('chatId')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User, String, Number, Number]),
    __metadata("design:returntype", Promise)
], CommunicationController.prototype, "getMessages", null);
__decorate([
    (0, common_1.Put)('messages/:messageId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update message' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Message updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Message not found' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('messageId')),
    __param(2, (0, common_1.Body)('content')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User, String, String]),
    __metadata("design:returntype", Promise)
], CommunicationController.prototype, "updateMessage", null);
__decorate([
    (0, common_1.Delete)('messages/:messageId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete message' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Message deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Message not found' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('messageId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User, String]),
    __metadata("design:returntype", Promise)
], CommunicationController.prototype, "deleteMessage", null);
__decorate([
    (0, common_1.Put)('messages/:messageId/read'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark message as read' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Message marked as read' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Message not found' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('messageId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User, String]),
    __metadata("design:returntype", Promise)
], CommunicationController.prototype, "markMessageAsRead", null);
__decorate([
    (0, common_1.Post)('chats/:chatId/participants'),
    (0, roles_decorator_1.Roles)(shared_1.UserRole.ADMIN, shared_1.UserRole.HR),
    (0, swagger_1.ApiOperation)({ summary: 'Add participant to chat' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Participant added successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Chat not found' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('chatId')),
    __param(2, (0, common_1.Body)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User, String, String]),
    __metadata("design:returntype", Promise)
], CommunicationController.prototype, "addParticipant", null);
__decorate([
    (0, common_1.Delete)('chats/:chatId/participants/:userId'),
    (0, roles_decorator_1.Roles)(shared_1.UserRole.ADMIN, shared_1.UserRole.HR),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Remove participant from chat' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Participant removed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Chat or participant not found' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('chatId')),
    __param(2, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User, String, String]),
    __metadata("design:returntype", Promise)
], CommunicationController.prototype, "removeParticipant", null);
__decorate([
    (0, common_1.Get)('unread-count'),
    (0, swagger_1.ApiOperation)({ summary: 'Get unread message count' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Unread count retrieved successfully' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User]),
    __metadata("design:returntype", Promise)
], CommunicationController.prototype, "getUnreadCount", null);
__decorate([
    (0, common_1.Get)('chats/:chatId/unread'),
    (0, swagger_1.ApiOperation)({ summary: 'Get unread count for specific chat' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Unread count retrieved successfully' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('chatId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User, String]),
    __metadata("design:returntype", Promise)
], CommunicationController.prototype, "getChatUnreadCount", null);
__decorate([
    (0, common_1.Get)('stats/overview'),
    (0, roles_decorator_1.Roles)(shared_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get communication statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Statistics retrieved successfully' }),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CommunicationController.prototype, "getStats", null);
exports.CommunicationController = CommunicationController = __decorate([
    (0, swagger_1.ApiTags)('Communication'),
    (0, common_1.Controller)('communication'),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [communication_service_1.CommunicationService])
], CommunicationController);
