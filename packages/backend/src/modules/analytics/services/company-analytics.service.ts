import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company, CompanyDocument } from '../../companies/schemas/company.schema';
import { CompanyRequirement, CompanyRequirementDocument } from '../../companies/schemas/company-requirement.schema';
import { AnalyticsQueryDto } from '../dto/analytics-query.dto';
import { Match, MatchDocument } from '../../matching/schemas/match.schema';

@Injectable()
export class CompanyAnalyticsService {
  private readonly logger = new Logger(CompanyAnalyticsService.name);

  constructor(
    @InjectModel(Company.name) private companyModel: Model<CompanyDocument>,
    @InjectModel(CompanyRequirement.name) private requirementModel: Model<CompanyRequirementDocument>,
    @InjectModel(Match.name) private matchModel: Model<MatchDocument>,
  ) {}

  async getCompanyAnalytics(query: AnalyticsQueryDto) {
    const { industry, status } = query as any;

    // Build query
    const match: any = {};
    if (industry) match['companyInfo.industry'] = { $in: [industry] };
    if (status) match.status = status;

    // Get companies
    const companies = await this.companyModel.find(match);

    // By industry
    const byIndustry = companies.reduce((acc, c) => {
      for (const industry of c.companyInfo.industry || []) {
        if (!acc[industry]) acc[industry] = 0;
        acc[industry]++;
      }
      return acc;
    }, {});

    // By status
    const byStatus = companies.reduce((acc, c) => {
      if (!acc[c.status]) acc[c.status] = 0;
      acc[c.status]++;
      return acc;
    }, {});

    // Hiring trends
    const hiringTrends = await this.getHiringTrends();

    // Satisfaction score
    const satisfactionScore = await this.getSatisfactionScore();

    return {
      totalCompanies: companies.length,
      byIndustry: Object.entries(byIndustry).map(([industry, count]) => ({ industry, count })),
      byStatus: Object.entries(byStatus).map(([status, count]) => ({ status, count })),
      hiringTrends,
      satisfactionScore,
    };
  }

  async getCompanyAnalyticsById(companyId: string) {
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
        joinedDate: (company as any).createdAt || new Date(),
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

  private async getHiringTrends() {
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

  private async getSatisfactionScore(): Promise<number> {
    const matches = await this.matchModel.find({ status: 'hired' });
    if (matches.length === 0) return 0;

    // This would be calculated from actual feedback
    return 85; // Placeholder
  }

  private async getCompanySatisfaction(companyId: string): Promise<number> {
    const matches = await this.matchModel.find({ 
      companyId, 
      status: 'hired' 
    });

    if (matches.length === 0) return 0;
    return 85; // Placeholder
  }
}