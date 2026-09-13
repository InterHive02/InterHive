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
var CompanyAnalyticsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyAnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const company_schema_1 = require("../../companies/schemas/company.schema");
const company_requirement_schema_1 = require("../../companies/schemas/company-requirement.schema");
const match_schema_1 = require("../../matching/schemas/match.schema");
let CompanyAnalyticsService = CompanyAnalyticsService_1 = class CompanyAnalyticsService {
    constructor(companyModel, requirementModel, matchModel) {
        this.companyModel = companyModel;
        this.requirementModel = requirementModel;
        this.matchModel = matchModel;
        this.logger = new common_1.Logger(CompanyAnalyticsService_1.name);
    }
    async getCompanyAnalytics(query) {
        const { industry, status } = query;
        const match = {};
        if (industry)
            match['companyInfo.industry'] = { $in: [industry] };
        if (status)
            match.status = status;
        const companies = await this.companyModel.find(match);
        const byIndustry = companies.reduce((acc, c) => {
            for (const industry of c.companyInfo.industry || []) {
                if (!acc[industry])
                    acc[industry] = 0;
                acc[industry]++;
            }
            return acc;
        }, {});
        const byStatus = companies.reduce((acc, c) => {
            if (!acc[c.status])
                acc[c.status] = 0;
            acc[c.status]++;
            return acc;
        }, {});
        const hiringTrends = await this.getHiringTrends();
        const satisfactionScore = await this.getSatisfactionScore();
        return {
            totalCompanies: companies.length,
            byIndustry: Object.entries(byIndustry).map(([industry, count]) => ({ industry, count })),
            byStatus: Object.entries(byStatus).map(([status, count]) => ({ status, count })),
            hiringTrends,
            satisfactionScore,
        };
    }
    async getCompanyAnalyticsById(companyId) {
        const company = await this.companyModel.findById(companyId);
        if (!company) {
            throw new Error('Company not found');
        }
        const requirements = await this.requirementModel.find({ companyId });
        const matches = await this.matchModel.find({ companyId });
        return {
            company: {
                name: company.companyInfo.name,
                industry: company.companyInfo.industry,
                status: company.status,
                joinedDate: company.createdAt || new Date(),
            },
            requirements: {
                total: requirements.length,
                active: requirements.filter(r => r.status === 'published').length,
                filled: requirements.filter(r => r.status === 'filled').length,
            },
            hiring: {
                totalMatches: matches.length,
                hires: matches.filter(m => m.status === 'hired').length,
                hiringRate: matches.length > 0
                    ? Math.round((matches.filter(m => m.status === 'hired').length / matches.length) * 100)
                    : 0,
            },
            satisfaction: await this.getCompanySatisfaction(companyId),
        };
    }
    async exportCompanyData() {
        const companies = await this.companyModel.find();
        return companies;
    }
    async getHiringTrends() {
        const trends = [];
        const months = 12;
        for (let i = months - 1; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
            const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
            const requirements = await this.requirementModel.countDocuments({
                createdAt: { $gte: monthStart, $lte: monthEnd },
            });
            const hires = await this.matchModel.countDocuments({
                status: 'hired',
                updatedAt: { $gte: monthStart, $lte: monthEnd },
            });
            trends.push({
                month: date.toLocaleString('default', { month: 'short' }),
                year: date.getFullYear(),
                requirements,
                hires,
            });
        }
        return trends;
    }
    async getSatisfactionScore() {
        const matches = await this.matchModel.find({ status: 'hired' });
        if (matches.length === 0)
            return 0;
        return 85;
    }
    async getCompanySatisfaction(companyId) {
        const matches = await this.matchModel.find({
            companyId,
            status: 'hired'
        });
        if (matches.length === 0)
            return 0;
        return 85;
    }
};
exports.CompanyAnalyticsService = CompanyAnalyticsService;
exports.CompanyAnalyticsService = CompanyAnalyticsService = CompanyAnalyticsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(company_schema_1.Company.name)),
    __param(1, (0, mongoose_1.InjectModel)(company_requirement_schema_1.CompanyRequirement.name)),
    __param(2, (0, mongoose_1.InjectModel)(match_schema_1.Match.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], CompanyAnalyticsService);
