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
exports.AnalyticsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const analytics_service_1 = require("./analytics.service");
const analytics_query_dto_1 = require("./dto/analytics-query.dto");
const roles_decorator_1 = require("../../core/decorators/roles.decorator");
const current_user_decorator_1 = require("../../core/decorators/current-user.decorator");
const shared_1 = require("@interhive/shared");
const user_schema_1 = require("../users/schemas/user.schema");
let AnalyticsController = class AnalyticsController {
    constructor(analyticsService) {
        this.analyticsService = analyticsService;
    }
    async getDashboardAnalytics(user, query) {
        return this.analyticsService.getDashboardAnalytics(user, query);
    }
    async getReadinessAnalytics(query) {
        return this.analyticsService.getReadinessAnalytics(query);
    }
    async getInternReadinessAnalytics(internId) {
        return this.analyticsService.getInternReadinessAnalytics(internId);
    }
    async getCompanyAnalytics(query) {
        return this.analyticsService.getCompanyAnalytics(query);
    }
    async getCompanyAnalyticsById(companyId) {
        return this.analyticsService.getCompanyAnalyticsById(companyId);
    }
    async getProjectAnalytics(query) {
        return this.analyticsService.getProjectAnalytics(query);
    }
    async getMatchingAnalytics(query) {
        return this.analyticsService.getMatchingAnalytics(query);
    }
    async getTrendAnalytics(query) {
        return this.analyticsService.getTrendAnalytics(query);
    }
    async getDashboardActivities(user) {
        return this.analyticsService.getDashboardActivities(user.id);
    }
    async exportReadinessData(response) {
        const data = await this.analyticsService.exportReadinessData();
        response.setHeader('Content-Type', 'application/json');
        response.setHeader('Content-Disposition', 'attachment; filename=readiness-data.json');
        response.send(data);
    }
    async exportCompanyData(response) {
        const data = await this.analyticsService.exportCompanyData();
        response.setHeader('Content-Type', 'application/json');
        response.setHeader('Content-Disposition', 'attachment; filename=company-data.json');
        response.send(data);
    }
    async refreshCache() {
        return this.analyticsService.refreshCache();
    }
};
exports.AnalyticsController = AnalyticsController;
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, swagger_1.ApiOperation)({ summary: 'Get dashboard analytics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Dashboard analytics retrieved successfully' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User,
        analytics_query_dto_1.AnalyticsQueryDto]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getDashboardAnalytics", null);
__decorate([
    (0, common_1.Get)('readiness'),
    (0, roles_decorator_1.Roles)(shared_1.UserRole.ADMIN, shared_1.UserRole.HR, shared_1.UserRole.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Get readiness analytics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Readiness analytics retrieved successfully' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [analytics_query_dto_1.AnalyticsQueryDto]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getReadinessAnalytics", null);
__decorate([
    (0, common_1.Get)('readiness/:internId'),
    (0, roles_decorator_1.Roles)(shared_1.UserRole.ADMIN, shared_1.UserRole.HR, shared_1.UserRole.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Get intern readiness analytics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Intern readiness analytics retrieved successfully' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('internId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getInternReadinessAnalytics", null);
__decorate([
    (0, common_1.Get)('companies'),
    (0, roles_decorator_1.Roles)(shared_1.UserRole.ADMIN, shared_1.UserRole.HR),
    (0, swagger_1.ApiOperation)({ summary: 'Get company analytics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Company analytics retrieved successfully' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [analytics_query_dto_1.AnalyticsQueryDto]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getCompanyAnalytics", null);
__decorate([
    (0, common_1.Get)('companies/:companyId'),
    (0, roles_decorator_1.Roles)(shared_1.UserRole.ADMIN, shared_1.UserRole.HR),
    (0, swagger_1.ApiOperation)({ summary: 'Get specific company analytics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Company analytics retrieved successfully' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getCompanyAnalyticsById", null);
__decorate([
    (0, common_1.Get)('projects'),
    (0, roles_decorator_1.Roles)(shared_1.UserRole.ADMIN, shared_1.UserRole.HR, shared_1.UserRole.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Get project analytics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Project analytics retrieved successfully' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [analytics_query_dto_1.AnalyticsQueryDto]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getProjectAnalytics", null);
__decorate([
    (0, common_1.Get)('matching'),
    (0, roles_decorator_1.Roles)(shared_1.UserRole.ADMIN, shared_1.UserRole.HR),
    (0, swagger_1.ApiOperation)({ summary: 'Get matching analytics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Matching analytics retrieved successfully' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [analytics_query_dto_1.AnalyticsQueryDto]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getMatchingAnalytics", null);
__decorate([
    (0, common_1.Get)('trends'),
    (0, roles_decorator_1.Roles)(shared_1.UserRole.ADMIN, shared_1.UserRole.HR),
    (0, swagger_1.ApiOperation)({ summary: 'Get trend analytics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Trend analytics retrieved successfully' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [analytics_query_dto_1.AnalyticsQueryDto]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getTrendAnalytics", null);
__decorate([
    (0, common_1.Get)('dashboard/activities'),
    (0, swagger_1.ApiOperation)({ summary: 'Get recent activities for dashboard' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Activities retrieved successfully' }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getDashboardActivities", null);
__decorate([
    (0, common_1.Get)('export/readiness'),
    (0, roles_decorator_1.Roles)(shared_1.UserRole.ADMIN, shared_1.UserRole.HR),
    (0, swagger_1.ApiOperation)({ summary: 'Export readiness data' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Data exported successfully' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "exportReadinessData", null);
__decorate([
    (0, common_1.Get)('export/companies'),
    (0, roles_decorator_1.Roles)(shared_1.UserRole.ADMIN, shared_1.UserRole.HR),
    (0, swagger_1.ApiOperation)({ summary: 'Export company data' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Data exported successfully' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "exportCompanyData", null);
__decorate([
    (0, common_1.Post)('cache/refresh'),
    (0, roles_decorator_1.Roles)(shared_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Refresh analytics cache' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cache refreshed successfully' }),
    openapi.ApiResponse({ status: 201 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "refreshCache", null);
exports.AnalyticsController = AnalyticsController = __decorate([
    (0, swagger_1.ApiTags)('Analytics'),
    (0, common_1.Controller)('analytics'),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [analytics_service_1.AnalyticsService])
], AnalyticsController);
