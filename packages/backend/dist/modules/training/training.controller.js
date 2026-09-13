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
exports.TrainingController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const training_service_1 = require("./training.service");
const create_training_dto_1 = require("./dto/create-training.dto");
const enroll_training_dto_1 = require("./dto/enroll-training.dto");
const roles_decorator_1 = require("../../core/decorators/roles.decorator");
const current_user_decorator_1 = require("../../core/decorators/current-user.decorator");
const shared_1 = require("@interhive/shared");
const user_schema_1 = require("../users/schemas/user.schema");
let TrainingController = class TrainingController {
    constructor(trainingService) {
        this.trainingService = trainingService;
    }
    async create(createTrainingDto) {
        return this.trainingService.create(createTrainingDto);
    }
    async findAll(page = 1, limit = 10, status, category, search) {
        return this.trainingService.findAll({ page, limit, status, category, search });
    }
    async getAvailable(user) {
        return this.trainingService.getAvailable(user.id);
    }
    async getMyEnrollments(user) {
        return this.trainingService.getMyEnrollments(user.id);
    }
    async getAllEnrollments(page = 1, limit = 10, status, programId) {
        return this.trainingService.getAllEnrollments({ page, limit, status, programId });
    }
    async getEnrollment(user, enrollmentId) {
        return this.trainingService.getEnrollment(user.id, enrollmentId);
    }
    async getStats() {
        return this.trainingService.getStats();
    }
    async findById(id) {
        return this.trainingService.findById(id);
    }
    async update(id, updateTrainingDto) {
        return this.trainingService.update(id, updateTrainingDto);
    }
    async delete(id) {
        await this.trainingService.delete(id);
    }
    async publish(id) {
        return this.trainingService.publish(id);
    }
    async enroll(user, id, enrollTrainingDto) {
        return this.trainingService.enroll(user.id, id, enrollTrainingDto);
    }
    async updateProgress(user, enrollmentId, moduleId, progress) {
        return this.trainingService.updateProgress(user.id, enrollmentId, moduleId, progress);
    }
    async completeEnrollment(user, enrollmentId) {
        return this.trainingService.completeEnrollment(user.id, enrollmentId);
    }
    async withdrawEnrollment(user, enrollmentId) {
        return this.trainingService.withdrawEnrollment(user.id, enrollmentId);
    }
};
exports.TrainingController = TrainingController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(shared_1.UserRole.ADMIN, shared_1.UserRole.HR),
    (0, swagger_1.ApiOperation)({ summary: 'Create a training program' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Training program created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_training_dto_1.CreateTrainingDto]),
    __metadata("design:returntype", Promise)
], TrainingController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all training programs' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Training programs retrieved successfully' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('category')),
    __param(4, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String]),
    __metadata("design:returntype", Promise)
], TrainingController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('available'),
    (0, swagger_1.ApiOperation)({ summary: 'Get available training programs for enrollment' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Available training programs retrieved successfully' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User]),
    __metadata("design:returntype", Promise)
], TrainingController.prototype, "getAvailable", null);
__decorate([
    (0, common_1.Get)('my-enrollments'),
    (0, swagger_1.ApiOperation)({ summary: 'Get my training enrollments' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Enrollments retrieved successfully' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User]),
    __metadata("design:returntype", Promise)
], TrainingController.prototype, "getMyEnrollments", null);
__decorate([
    (0, common_1.Get)('enrollments/all'),
    (0, roles_decorator_1.Roles)(shared_1.UserRole.ADMIN, shared_1.UserRole.HR, shared_1.UserRole.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Get all enrollments' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Enrollments retrieved successfully' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('programId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String]),
    __metadata("design:returntype", Promise)
], TrainingController.prototype, "getAllEnrollments", null);
__decorate([
    (0, common_1.Get)('enrollments/:enrollmentId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get enrollment details' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Enrollment details retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Enrollment not found' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('enrollmentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User, String]),
    __metadata("design:returntype", Promise)
], TrainingController.prototype, "getEnrollment", null);
__decorate([
    (0, common_1.Get)('stats/overview'),
    (0, roles_decorator_1.Roles)(shared_1.UserRole.ADMIN, shared_1.UserRole.HR),
    (0, swagger_1.ApiOperation)({ summary: 'Get training statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Statistics retrieved successfully' }),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TrainingController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get training program by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Training program retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Training program not found' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TrainingController.prototype, "findById", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)(shared_1.UserRole.ADMIN, shared_1.UserRole.HR),
    (0, swagger_1.ApiOperation)({ summary: 'Update training program' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Training program updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Training program not found' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TrainingController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(shared_1.UserRole.ADMIN),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete training program' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Training program deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Training program not found' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TrainingController.prototype, "delete", null);
__decorate([
    (0, common_1.Post)(':id/publish'),
    (0, roles_decorator_1.Roles)(shared_1.UserRole.ADMIN, shared_1.UserRole.HR),
    (0, swagger_1.ApiOperation)({ summary: 'Publish training program' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Training program published successfully' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TrainingController.prototype, "publish", null);
__decorate([
    (0, common_1.Post)(':id/enroll'),
    (0, swagger_1.ApiOperation)({ summary: 'Enroll in a training program' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Enrolled successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Cannot enroll' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User, String, enroll_training_dto_1.EnrollTrainingDto]),
    __metadata("design:returntype", Promise)
], TrainingController.prototype, "enroll", null);
__decorate([
    (0, common_1.Post)('enrollments/:enrollmentId/progress'),
    (0, swagger_1.ApiOperation)({ summary: 'Update enrollment progress' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Progress updated successfully' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('enrollmentId')),
    __param(2, (0, common_1.Body)('moduleId')),
    __param(3, (0, common_1.Body)('progress')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User, String, String, Number]),
    __metadata("design:returntype", Promise)
], TrainingController.prototype, "updateProgress", null);
__decorate([
    (0, common_1.Post)('enrollments/:enrollmentId/complete'),
    (0, swagger_1.ApiOperation)({ summary: 'Complete a training program' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Training program completed successfully' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('enrollmentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User, String]),
    __metadata("design:returntype", Promise)
], TrainingController.prototype, "completeEnrollment", null);
__decorate([
    (0, common_1.Post)('enrollments/:enrollmentId/withdraw'),
    (0, swagger_1.ApiOperation)({ summary: 'Withdraw from training program' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Withdrawn successfully' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('enrollmentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User, String]),
    __metadata("design:returntype", Promise)
], TrainingController.prototype, "withdrawEnrollment", null);
exports.TrainingController = TrainingController = __decorate([
    (0, swagger_1.ApiTags)('Training'),
    (0, common_1.Controller)('training'),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [training_service_1.TrainingService])
], TrainingController);
