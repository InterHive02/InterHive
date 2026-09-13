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
exports.CompaniesController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const companies_service_1 = require("./companies.service");
const create_company_dto_1 = require("./dto/create-company.dto");
const company_requirement_dto_1 = require("./dto/company-requirement.dto");
const roles_decorator_1 = require("../../core/decorators/roles.decorator");
const public_decorator_1 = require("../../core/decorators/public.decorator");
const current_user_decorator_1 = require("../../core/decorators/current-user.decorator");
const shared_1 = require("@interhive/shared");
const user_schema_1 = require("../users/schemas/user.schema");
let CompaniesController = class CompaniesController {
    constructor(companiesService) {
        this.companiesService = companiesService;
    }
    async sendInquiry(body) {
        return this.companiesService.sendCompanyInquiry(body);
    }
    async getLeads(page, limit, status, search) {
        return this.companiesService.getLeads({ page, limit, status, search });
    }
    async updateLead(id, body, user) {
        const author = user ? `${user.firstName} ${user.lastName}`.trim() : 'HR Team';
        return this.companiesService.updateLead(id, body, author);
    }
    async create(createCompanyDto) {
        return this.companiesService.create(createCompanyDto);
    }
    async findAll(page = 1, limit = 10, search, industry, status) {
        return this.companiesService.findAll({ page, limit, search, industry, status });
    }
    async getStats() {
        return this.companiesService.getStats();
    }
    async createRequirement(companyId, createRequirementDto) {
        return this.companiesService.createRequirement(companyId, createRequirementDto);
    }
    async getRequirements(companyId, status) {
        return this.companiesService.getRequirements(companyId, status);
    }
    async updateRequirement(requirementId, updateRequirementDto) {
        return this.companiesService.updateRequirement(requirementId, updateRequirementDto);
    }
    async deleteRequirement(requirementId) {
        await this.companiesService.deleteRequirement(requirementId);
    }
    async getMatches(companyId, requirementId, limit = 10) {
        return this.companiesService.getMatches(companyId, requirementId, limit);
    }
    async findById(id) {
        return this.companiesService.findById(id);
    }
    async update(id, updateCompanyDto) {
        return this.companiesService.update(id, updateCompanyDto);
    }
    async delete(id) {
        await this.companiesService.delete(id);
    }
    async onboard(companyId) {
        return this.companiesService.onboard(companyId);
    }
};
exports.CompaniesController = CompaniesController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('inquiry'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Submit company inquiry' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Inquiry submitted successfully' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CompaniesController.prototype, "sendInquiry", null);
__decorate([
    (0, common_1.Get)('leads'),
    (0, roles_decorator_1.Roles)(shared_1.UserRole.ADMIN, shared_1.UserRole.HR),
    (0, swagger_1.ApiOperation)({ summary: 'Get all company leads for HR and Admin' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String]),
    __metadata("design:returntype", Promise)
], CompaniesController.prototype, "getLeads", null);
__decorate([
    (0, common_1.Patch)('leads/:id'),
    (0, roles_decorator_1.Roles)(shared_1.UserRole.ADMIN, shared_1.UserRole.HR),
    (0, swagger_1.ApiOperation)({ summary: 'Update company lead status and notes' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, user_schema_1.User]),
    __metadata("design:returntype", Promise)
], CompaniesController.prototype, "updateLead", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(shared_1.UserRole.ADMIN, shared_1.UserRole.HR),
    (0, swagger_1.ApiOperation)({ summary: 'Create company' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Company created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Company already exists' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_company_dto_1.CreateCompanyDto]),
    __metadata("design:returntype", Promise)
], CompaniesController.prototype, "create", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all companies' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Companies retrieved successfully' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('industry')),
    __param(4, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String]),
    __metadata("design:returntype", Promise)
], CompaniesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('stats/overview'),
    (0, roles_decorator_1.Roles)(shared_1.UserRole.ADMIN, shared_1.UserRole.HR),
    (0, swagger_1.ApiOperation)({ summary: 'Get company statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Statistics retrieved successfully' }),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CompaniesController.prototype, "getStats", null);
__decorate([
    (0, common_1.Post)(':id/requirements'),
    (0, roles_decorator_1.Roles)(shared_1.UserRole.ADMIN, shared_1.UserRole.HR, shared_1.UserRole.COMPANY),
    (0, swagger_1.ApiOperation)({ summary: 'Create company requirement' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Requirement created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Company not found' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, company_requirement_dto_1.CreateCompanyRequirementDto]),
    __metadata("design:returntype", Promise)
], CompaniesController.prototype, "createRequirement", null);
__decorate([
    (0, common_1.Get)(':id/requirements'),
    (0, swagger_1.ApiOperation)({ summary: 'Get company requirements' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Requirements retrieved successfully' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CompaniesController.prototype, "getRequirements", null);
__decorate([
    (0, common_1.Put)('requirements/:requirementId'),
    (0, roles_decorator_1.Roles)(shared_1.UserRole.ADMIN, shared_1.UserRole.HR, shared_1.UserRole.COMPANY),
    (0, swagger_1.ApiOperation)({ summary: 'Update company requirement' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Requirement updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Requirement not found' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('requirementId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CompaniesController.prototype, "updateRequirement", null);
__decorate([
    (0, common_1.Delete)('requirements/:requirementId'),
    (0, roles_decorator_1.Roles)(shared_1.UserRole.ADMIN, shared_1.UserRole.HR, shared_1.UserRole.COMPANY),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete company requirement' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Requirement deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Requirement not found' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('requirementId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CompaniesController.prototype, "deleteRequirement", null);
__decorate([
    (0, common_1.Get)(':id/matches'),
    (0, swagger_1.ApiOperation)({ summary: 'Get matched interns for company' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Matches retrieved successfully' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('requirementId')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number]),
    __metadata("design:returntype", Promise)
], CompaniesController.prototype, "getMatches", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get company by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Company retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Company not found' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CompaniesController.prototype, "findById", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)(shared_1.UserRole.ADMIN, shared_1.UserRole.HR),
    (0, swagger_1.ApiOperation)({ summary: 'Update company' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Company updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Company not found' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CompaniesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(shared_1.UserRole.ADMIN),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete company' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Company deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Company not found' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CompaniesController.prototype, "delete", null);
__decorate([
    (0, common_1.Post)(':id/onboard'),
    (0, roles_decorator_1.Roles)(shared_1.UserRole.ADMIN, shared_1.UserRole.HR),
    (0, swagger_1.ApiOperation)({ summary: 'Onboard company' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Company onboarded successfully' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CompaniesController.prototype, "onboard", null);
exports.CompaniesController = CompaniesController = __decorate([
    (0, swagger_1.ApiTags)('Companies'),
    (0, common_1.Controller)('companies'),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [companies_service_1.CompaniesService])
], CompaniesController);
