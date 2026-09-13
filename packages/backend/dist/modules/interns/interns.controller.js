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
exports.InternsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const interns_service_1 = require("./interns.service");
const create_intern_profile_dto_1 = require("./dto/create-intern-profile.dto");
const update_intern_profile_dto_1 = require("./dto/update-intern-profile.dto");
const roles_decorator_1 = require("../../core/decorators/roles.decorator");
const current_user_decorator_1 = require("../../core/decorators/current-user.decorator");
const shared_1 = require("@interhive/shared");
const user_schema_1 = require("../users/schemas/user.schema");
let InternsController = class InternsController {
    constructor(internsService) {
        this.internsService = internsService;
    }
    async createProfile(user, createProfileDto) {
        return this.internsService.createProfile(user.id, createProfileDto);
    }
    async getProfile(user) {
        if (!user) {
            return { success: true, data: null };
        }
        const userIdStr = user._id?.toString() || user.id;
        if (!userIdStr) {
            return { success: true, data: null };
        }
        return this.internsService.getProfile(userIdStr);
    }
    async updateProfile(user, updateProfileDto) {
        return this.internsService.updateProfile(user.id, updateProfileDto);
    }
    async getReadiness(user) {
        return this.internsService.getReadiness(user.id);
    }
    async apply(user, programId, coverLetter) {
        return this.internsService.apply(user.id, programId, coverLetter);
    }
    async getApplications(user, status) {
        return this.internsService.getApplications(user.id, status);
    }
    async getApplication(user, applicationId) {
        return this.internsService.getApplication(user.id, applicationId);
    }
    async withdrawApplication(user, applicationId) {
        return this.internsService.withdrawApplication(user.id, applicationId);
    }
    async getOpportunities(user, page = 1, limit = 10) {
        return this.internsService.getOpportunities(user.id, page, limit);
    }
    async onboard(user, programId) {
        return this.internsService.onboard(user.id, programId);
    }
    async findAll(page = 1, limit = 10, status, search) {
        return this.internsService.findAll({ page, limit, status, search });
    }
    async getStats() {
        return this.internsService.getStats();
    }
    async findById(id) {
        return this.internsService.findById(id);
    }
    async recalculateReadiness(id) {
        return this.internsService.recalculateReadiness(id);
    }
    async updateStatus(id, status) {
        return this.internsService.updateStatus(id, status);
    }
    async uploadResume(user, file) {
        return this.internsService.uploadResume(user.id, file);
    }
    async deleteResume(user) {
        return this.internsService.deleteResume(user.id);
    }
};
exports.InternsController = InternsController;
__decorate([
    (0, common_1.Post)('profile'),
    (0, swagger_1.ApiOperation)({ summary: 'Create intern profile' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Profile created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Profile already exists' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User,
        create_intern_profile_dto_1.CreateInternProfileDto]),
    __metadata("design:returntype", Promise)
], InternsController.prototype, "createProfile", null);
__decorate([
    (0, common_1.Get)('profile'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current intern profile' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Profile retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Profile not found' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User]),
    __metadata("design:returntype", Promise)
], InternsController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Put)('profile'),
    (0, swagger_1.ApiOperation)({ summary: 'Update intern profile' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Profile updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Profile not found' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User,
        update_intern_profile_dto_1.UpdateInternProfileDto]),
    __metadata("design:returntype", Promise)
], InternsController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Get)('readiness'),
    (0, swagger_1.ApiOperation)({ summary: 'Get intern readiness score' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Readiness score retrieved successfully' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User]),
    __metadata("design:returntype", Promise)
], InternsController.prototype, "getReadiness", null);
__decorate([
    (0, common_1.Post)('applications'),
    (0, swagger_1.ApiOperation)({ summary: 'Apply for internship program' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Application submitted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)('programId')),
    __param(2, (0, common_1.Body)('coverLetter')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User, String, String]),
    __metadata("design:returntype", Promise)
], InternsController.prototype, "apply", null);
__decorate([
    (0, common_1.Get)('applications'),
    (0, swagger_1.ApiOperation)({ summary: 'Get intern applications' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Applications retrieved successfully' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User, String]),
    __metadata("design:returntype", Promise)
], InternsController.prototype, "getApplications", null);
__decorate([
    (0, common_1.Get)('applications/:applicationId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get application details' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Application details retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Application not found' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('applicationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User, String]),
    __metadata("design:returntype", Promise)
], InternsController.prototype, "getApplication", null);
__decorate([
    (0, common_1.Post)('applications/:applicationId/withdraw'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Withdraw application' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Application withdrawn successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Cannot withdraw application' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('applicationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User, String]),
    __metadata("design:returntype", Promise)
], InternsController.prototype, "withdrawApplication", null);
__decorate([
    (0, common_1.Get)('opportunities'),
    (0, swagger_1.ApiOperation)({ summary: 'Get matched opportunities' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Opportunities retrieved successfully' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User, Number, Number]),
    __metadata("design:returntype", Promise)
], InternsController.prototype, "getOpportunities", null);
__decorate([
    (0, common_1.Post)('onboard'),
    (0, swagger_1.ApiOperation)({ summary: 'Onboard intern to program' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Intern onboarded successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)('programId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User, String]),
    __metadata("design:returntype", Promise)
], InternsController.prototype, "onboard", null);
__decorate([
    (0, common_1.Get)('all'),
    (0, roles_decorator_1.Roles)(shared_1.UserRole.ADMIN, shared_1.UserRole.HR, shared_1.UserRole.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Get all interns (admin/manager)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Interns retrieved successfully' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String]),
    __metadata("design:returntype", Promise)
], InternsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('stats/overview'),
    (0, roles_decorator_1.Roles)(shared_1.UserRole.ADMIN, shared_1.UserRole.HR),
    (0, swagger_1.ApiOperation)({ summary: 'Get intern statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Statistics retrieved successfully' }),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InternsController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(shared_1.UserRole.ADMIN, shared_1.UserRole.HR, shared_1.UserRole.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Get intern by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Intern retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Intern not found' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InternsController.prototype, "findById", null);
__decorate([
    (0, common_1.Post)(':id/readiness/recalculate'),
    (0, roles_decorator_1.Roles)(shared_1.UserRole.ADMIN, shared_1.UserRole.HR, shared_1.UserRole.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Recalculate intern readiness score' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Readiness score recalculated successfully' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InternsController.prototype, "recalculateReadiness", null);
__decorate([
    (0, common_1.Post)(':id/status'),
    (0, roles_decorator_1.Roles)(shared_1.UserRole.ADMIN, shared_1.UserRole.HR),
    (0, swagger_1.ApiOperation)({ summary: 'Update intern status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Status updated successfully' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], InternsController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Post)('upload-resume'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('resume')),
    (0, swagger_1.ApiOperation)({ summary: 'Upload resume' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Resume uploaded successfully' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User, Object]),
    __metadata("design:returntype", Promise)
], InternsController.prototype, "uploadResume", null);
__decorate([
    (0, common_1.Delete)('resume'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete resume' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Resume deleted successfully' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User]),
    __metadata("design:returntype", Promise)
], InternsController.prototype, "deleteResume", null);
exports.InternsController = InternsController = __decorate([
    (0, swagger_1.ApiTags)('Interns'),
    (0, common_1.Controller)('interns'),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [interns_service_1.InternsService])
], InternsController);
