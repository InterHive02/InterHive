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
exports.CompaniesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const company_schema_1 = require("./schemas/company.schema");
const company_requirement_schema_1 = require("./schemas/company-requirement.schema");
const users_service_1 = require("../users/users.service");
const redis_service_1 = require("../../common/redis/redis.service");
const mail_service_1 = require("../../common/mail/mail.service");
const shared_1 = require("@interhive/shared");
let CompaniesService = class CompaniesService {
    constructor(companyModel, requirementModel, usersService, redisService, mailService) {
        this.companyModel = companyModel;
        this.requirementModel = requirementModel;
        this.usersService = usersService;
        this.redisService = redisService;
        this.mailService = mailService;
    }
    async create(createCompanyDto) {
        const { companyInfo, contact, ...rest } = createCompanyDto;
        const existingCompany = await this.companyModel.findOne({
            'companyInfo.name': companyInfo.name,
            'companyInfo.registrationNumber': companyInfo.registrationNumber,
        });
        if (existingCompany) {
            throw new common_1.ConflictException('Company already exists');
        }
        const company = new this.companyModel({
            companyInfo,
            contact,
            ...rest,
            status: shared_1.CompanyStatus.PENDING,
        });
        await company.save();
        return {
            success: true,
            message: 'Company created successfully',
            data: company,
        };
    }
    async findAll(params) {
        try {
            const { page, limit, search, industry, status } = params;
            const skip = (page - 1) * limit;
            const query = {};
            if (status)
                query.status = status;
            if (industry)
                query['companyInfo.industry'] = { $in: [industry] };
            if (search) {
                query.$or = [
                    { 'companyInfo.name': { $regex: search, $options: 'i' } },
                    { 'companyInfo.description': { $regex: search, $options: 'i' } },
                    { 'companyInfo.legalName': { $regex: search, $options: 'i' } },
                ];
            }
            const [companies, total] = await Promise.all([
                this.companyModel
                    .find(query)
                    .skip(skip)
                    .limit(limit)
                    .sort({ createdAt: -1 }),
                this.companyModel.countDocuments(query),
            ]);
            const totalPages = Math.ceil(total / limit) || 1;
            return {
                success: true,
                data: companies || [],
                meta: {
                    page,
                    limit,
                    total: total || 0,
                    totalPages,
                    hasNext: page < totalPages,
                    hasPrev: page > 1,
                },
            };
        }
        catch (error) {
            return {
                success: true,
                data: [],
                meta: { page: 1, limit: 10, total: 0, totalPages: 1, hasNext: false, hasPrev: false },
            };
        }
    }
    async findById(id) {
        const company = await this.companyModel.findById(id);
        if (!company) {
            throw new common_1.NotFoundException('Company not found');
        }
        return {
            success: true,
            data: company,
        };
    }
    async update(id, updateCompanyDto) {
        const company = await this.companyModel.findById(id);
        if (!company) {
            throw new common_1.NotFoundException('Company not found');
        }
        Object.assign(company, updateCompanyDto);
        await company.save();
        return {
            success: true,
            message: 'Company updated successfully',
            data: company,
        };
    }
    async delete(id) {
        const company = await this.companyModel.findById(id);
        if (!company) {
            throw new common_1.NotFoundException('Company not found');
        }
        await company.deleteOne();
        return {
            success: true,
            message: 'Company deleted successfully',
        };
    }
    async createRequirement(companyId, createRequirementDto) {
        const company = await this.companyModel.findById(companyId);
        if (!company) {
            throw new common_1.NotFoundException('Company not found');
        }
        const requirement = new this.requirementModel({
            companyId,
            ...createRequirementDto,
            status: shared_1.RequirementStatus.DRAFT,
        });
        await requirement.save();
        return {
            success: true,
            message: 'Requirement created successfully',
            data: requirement,
        };
    }
    async getRequirements(companyId, status) {
        const company = await this.companyModel.findById(companyId);
        if (!company) {
            throw new common_1.NotFoundException('Company not found');
        }
        const query = { companyId };
        if (status)
            query.status = status;
        const requirements = await this.requirementModel
            .find(query)
            .sort({ createdAt: -1 });
        return {
            success: true,
            data: requirements,
        };
    }
    async updateRequirement(requirementId, updateRequirementDto) {
        const requirement = await this.requirementModel.findById(requirementId);
        if (!requirement) {
            throw new common_1.NotFoundException('Requirement not found');
        }
        Object.assign(requirement, updateRequirementDto);
        await requirement.save();
        return {
            success: true,
            message: 'Requirement updated successfully',
            data: requirement,
        };
    }
    async deleteRequirement(requirementId) {
        const requirement = await this.requirementModel.findById(requirementId);
        if (!requirement) {
            throw new common_1.NotFoundException('Requirement not found');
        }
        await requirement.deleteOne();
        return {
            success: true,
            message: 'Requirement deleted successfully',
        };
    }
    async getMatches(companyId, requirementId, limit = 10) {
        const company = await this.companyModel.findById(companyId);
        if (!company) {
            throw new common_1.NotFoundException('Company not found');
        }
        let requirements;
        if (requirementId) {
            const req = await this.requirementModel.findById(requirementId);
            if (!req) {
                throw new common_1.NotFoundException('Requirement not found');
            }
            requirements = [req];
        }
        else {
            requirements = await this.requirementModel
                .find({ companyId, status: shared_1.RequirementStatus.PUBLISHED })
                .limit(limit);
        }
        const matches = [];
        for (const req of requirements) {
            const interns = await this.findMatchingInterns(req, limit);
            matches.push({
                requirement: req,
                interns,
            });
        }
        return {
            success: true,
            data: matches,
        };
    }
    async onboard(companyId) {
        const company = await this.companyModel.findById(companyId);
        if (!company) {
            throw new common_1.NotFoundException('Company not found');
        }
        company.status = shared_1.CompanyStatus.VERIFIED;
        await company.save();
        return {
            success: true,
            message: 'Company onboarded successfully',
            data: company,
        };
    }
    async getStats() {
        const [totalCompanies, byStatus, byIndustry, totalRequirements, openRequirements,] = await Promise.all([
            this.companyModel.countDocuments(),
            this.companyModel.aggregate([
                { $group: { _id: '$status', count: { $sum: 1 } } },
            ]),
            this.companyModel.aggregate([
                { $unwind: '$companyInfo.industry' },
                { $group: { _id: '$companyInfo.industry', count: { $sum: 1 } } },
            ]),
            this.requirementModel.countDocuments(),
            this.requirementModel.countDocuments({ status: shared_1.RequirementStatus.PUBLISHED }),
        ]);
        return {
            success: true,
            data: {
                total: totalCompanies,
                byStatus,
                byIndustry,
                requirements: {
                    total: totalRequirements,
                    open: openRequirements,
                },
            },
        };
    }
    async findMatchingInterns(requirement, limit) {
        return [];
    }
    async sendCompanyInquiry(data) {
        const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
        <h2 style="color: #4f46e5; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; margin-top: 0;">🏢 New Company Credentials Request</h2>
        <p style="font-size: 14px; color: #334155;">A new employer has requested company login credentials via the website portal:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 14px;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #475569; width: 140px;">Company Name:</td>
            <td style="padding: 8px 0; color: #0f172a;">${data.companyName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #475569;">Contact Person:</td>
            <td style="padding: 8px 0; color: #0f172a;">${data.contactPerson}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #475569;">Work Email:</td>
            <td style="padding: 8px 0; color: #2563eb;"><a href="mailto:${data.email}">${data.email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #475569;">Phone Number:</td>
            <td style="padding: 8px 0; color: #0f172a;">${data.phone}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #475569;">Interns Needed:</td>
            <td style="padding: 8px 0; color: #0f172a;">${data.internCount || '1-5'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #475569;">Tech Stack:</td>
            <td style="padding: 8px 0; color: #0f172a;">${data.techStack || 'Not specified'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #475569;">Message / Notes:</td>
            <td style="padding: 8px 0; color: #0f172a;">${data.message || 'None'}</td>
          </tr>
        </table>

        <div style="margin-top: 24px; padding: 12px 16px; background-color: #f8fafc; border-radius: 8px; font-size: 12px; color: #64748b;">
          This request was sent directly from the InterHive web application. Please review their details and issue employer account credentials.
        </div>
      </div>
    `;
        await this.mailService.sendEmail('interhive.info@gmail.com', `🏢 Company Credentials Request - ${data.companyName}`, htmlContent);
        return { success: true, message: 'Inquiry sent directly to interhive.info@gmail.com' };
    }
};
exports.CompaniesService = CompaniesService;
exports.CompaniesService = CompaniesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(company_schema_1.Company.name)),
    __param(1, (0, mongoose_1.InjectModel)(company_requirement_schema_1.CompanyRequirement.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        users_service_1.UsersService,
        redis_service_1.RedisService,
        mail_service_1.MailService])
], CompaniesService);
