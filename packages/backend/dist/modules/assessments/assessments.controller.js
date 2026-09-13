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
exports.AssessmentsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const assessments_service_1 = require("./assessments.service");
const create_assessment_dto_1 = require("./dto/create-assessment.dto");
const submit_assessment_dto_1 = require("./dto/submit-assessment.dto");
const roles_decorator_1 = require("../../core/decorators/roles.decorator");
const current_user_decorator_1 = require("../../core/decorators/current-user.decorator");
const shared_1 = require("@interhive/shared");
const user_schema_1 = require("../users/schemas/user.schema");
let AssessmentsController = class AssessmentsController {
    constructor(assessmentsService) {
        this.assessmentsService = assessmentsService;
    }
    async create(createAssessmentDto) {
        return this.assessmentsService.create(createAssessmentDto);
    }
    async findAll(page = 1, limit = 10, type, category, status) {
        return this.assessmentsService.findAll({ page, limit, type, category, status });
    }
    async getMyResults(user) {
        return this.assessmentsService.getMyResults(user.id);
    }
    async getUserResults(userId) {
        return this.assessmentsService.getUserResults(userId);
    }
    async getStats() {
        return this.assessmentsService.getStats();
    }
    async findById(id) {
        return this.assessmentsService.findById(id);
    }
    async update(id, updateAssessmentDto) {
        return this.assessmentsService.update(id, updateAssessmentDto);
    }
    async delete(id) {
        await this.assessmentsService.delete(id);
    }
    async publish(id) {
        return this.assessmentsService.publish(id);
    }
    async startAssessment(user, id) {
        return this.assessmentsService.startAssessment(user.id, id);
    }
    async submitAssessment(user, id, submitAssessmentDto) {
        return this.assessmentsService.submitAssessment(user.id, id, submitAssessmentDto);
    }
    async getResult(user, id) {
        return this.assessmentsService.getResult(user.id, id);
    }
    async evaluateAssessment(id, resultId, feedback) {
        return this.assessmentsService.evaluateAssessment(id, resultId, feedback);
    }
};
exports.AssessmentsController = AssessmentsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(shared_1.UserRole.ADMIN, shared_1.UserRole.HR),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new assessment' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Assessment created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_assessment_dto_1.CreateAssessmentDto]),
    __metadata("design:returntype", Promise)
], AssessmentsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all assessments' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Assessments retrieved successfully' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('type')),
    __param(3, (0, common_1.Query)('category')),
    __param(4, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String]),
    __metadata("design:returntype", Promise)
], AssessmentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('my-results'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all assessment results for current user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Results retrieved successfully' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User]),
    __metadata("design:returntype", Promise)
], AssessmentsController.prototype, "getMyResults", null);
__decorate([
    (0, common_1.Get)('results/:userId'),
    (0, roles_decorator_1.Roles)(shared_1.UserRole.ADMIN, shared_1.UserRole.HR, shared_1.UserRole.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Get assessment results for a user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Results retrieved successfully' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AssessmentsController.prototype, "getUserResults", null);
__decorate([
    (0, common_1.Get)('stats/overview'),
    (0, roles_decorator_1.Roles)(shared_1.UserRole.ADMIN, shared_1.UserRole.HR),
    (0, swagger_1.ApiOperation)({ summary: 'Get assessment statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Statistics retrieved successfully' }),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AssessmentsController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get assessment by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Assessment retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Assessment not found' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AssessmentsController.prototype, "findById", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)(shared_1.UserRole.ADMIN, shared_1.UserRole.HR),
    (0, swagger_1.ApiOperation)({ summary: 'Update assessment' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Assessment updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Assessment not found' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AssessmentsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(shared_1.UserRole.ADMIN),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete assessment' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Assessment deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Assessment not found' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AssessmentsController.prototype, "delete", null);
__decorate([
    (0, common_1.Post)(':id/publish'),
    (0, roles_decorator_1.Roles)(shared_1.UserRole.ADMIN, shared_1.UserRole.HR),
    (0, swagger_1.ApiOperation)({ summary: 'Publish assessment' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Assessment published successfully' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AssessmentsController.prototype, "publish", null);
__decorate([
    (0, common_1.Post)(':id/start'),
    (0, swagger_1.ApiOperation)({ summary: 'Start an assessment' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Assessment started successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Cannot start assessment' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User, String]),
    __metadata("design:returntype", Promise)
], AssessmentsController.prototype, "startAssessment", null);
__decorate([
    (0, common_1.Post)(':id/submit'),
    (0, swagger_1.ApiOperation)({ summary: 'Submit assessment answers' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Assessment submitted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Cannot submit assessment' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User, String, submit_assessment_dto_1.SubmitAssessmentDto]),
    __metadata("design:returntype", Promise)
], AssessmentsController.prototype, "submitAssessment", null);
__decorate([
    (0, common_1.Get)(':id/result'),
    (0, swagger_1.ApiOperation)({ summary: 'Get assessment result' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Assessment result retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Result not found' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User, String]),
    __metadata("design:returntype", Promise)
], AssessmentsController.prototype, "getResult", null);
__decorate([
    (0, common_1.Post)(':id/evaluate'),
    (0, roles_decorator_1.Roles)(shared_1.UserRole.ADMIN, shared_1.UserRole.HR),
    (0, swagger_1.ApiOperation)({ summary: 'Evaluate assessment manually' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Assessment evaluated successfully' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('resultId')),
    __param(2, (0, common_1.Body)('feedback')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AssessmentsController.prototype, "evaluateAssessment", null);
exports.AssessmentsController = AssessmentsController = __decorate([
    (0, swagger_1.ApiTags)('Assessments'),
    (0, common_1.Controller)('assessments'),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [assessments_service_1.AssessmentsService])
], AssessmentsController);
