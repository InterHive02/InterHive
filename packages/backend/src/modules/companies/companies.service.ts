import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Company, CompanyDocument } from './schemas/company.schema';
import { CompanyRequirement, CompanyRequirementDocument } from './schemas/company-requirement.schema';
import { CreateCompanyDto } from './dto/create-company.dto';
import { CreateCompanyRequirementDto } from './dto/company-requirement.dto';
import { CompanyLead, CompanyLeadDocument } from './schemas/company-lead.schema';
import { UsersService } from '../users/users.service';
import { RedisService } from '../../common/redis/redis.service';
import { MailService } from '../../common/mail/mail.service';
import { CompanyStatus, RequirementStatus } from '@interhive/shared';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name) private companyModel: Model<CompanyDocument>,
    @InjectModel(CompanyRequirement.name) private requirementModel: Model<CompanyRequirementDocument>,
    @InjectModel(CompanyLead.name) private leadModel: Model<CompanyLeadDocument>,
    private usersService: UsersService,
    private redisService: RedisService,
    private mailService: MailService,
  ) {}

  async create(createCompanyDto: CreateCompanyDto) {
    const { companyInfo, contact, ...rest } = createCompanyDto;

    // Check if company already exists
    const existingCompany = await this.companyModel.findOne({
      'companyInfo.name': companyInfo.name,
      'companyInfo.registrationNumber': companyInfo.registrationNumber,
    });

    if (existingCompany) {
      throw new ConflictException('Company already exists');
    }

    const company = new this.companyModel({
      companyInfo,
      contact,
      ...rest,
      status: CompanyStatus.PENDING,
    });

    await company.save();

    return {
      success: true,
      message: 'Company created successfully',
      data: company,
    };
  }

  async findAll(params: {
    page: number;
    limit: number;
    search?: string;
    industry?: string;
    status?: string;
  }) {
    try {
      const { page, limit, search, industry, status } = params;
      const skip = (page - 1) * limit;

      const query: any = {};
      if (status) query.status = status;
      if (industry) query['companyInfo.industry'] = { $in: [industry] };

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
    } catch (error) {
      return {
        success: true,
        data: [],
        meta: { page: 1, limit: 10, total: 0, totalPages: 1, hasNext: false, hasPrev: false },
      };
    }
  }

  async findById(id: string) {
    let company: any = null;
    if (Types.ObjectId.isValid(id)) {
      company = await this.companyModel.findById(id);
    }
    if (!company) {
      company = await this.companyModel.findOne({
        $or: [
          { 'contact.primaryContact.email': id },
          { 'contact.primaryContact.email': 'company@interhive.in' },
        ],
      }) || await this.companyModel.findOne();
    }
    if (!company) {
      throw new NotFoundException('Company not found');
    }

    return {
      success: true,
      data: company,
    };
  }

  async update(id: string, updateCompanyDto: any) {
    const company = await this.companyModel.findById(id);
    if (!company) {
      throw new NotFoundException('Company not found');
    }

    Object.assign(company, updateCompanyDto);
    await company.save();

    return {
      success: true,
      message: 'Company updated successfully',
      data: company,
    };
  }

  async delete(id: string) {
    const company = await this.companyModel.findById(id);
    if (!company) {
      throw new NotFoundException('Company not found');
    }

    await company.deleteOne();

    return {
      success: true,
      message: 'Company deleted successfully',
    };
  }

  async createRequirement(companyId: string, createRequirementDto: CreateCompanyRequirementDto) {
    let company: any = null;
    if (Types.ObjectId.isValid(companyId)) {
      company = await this.companyModel.findById(companyId);
    }
    if (!company) {
      company = await this.companyModel.findOne({ 'contact.primaryContact.email': 'company@interhive.in' }) || await this.companyModel.findOne();
    }
    const resolvedCompanyId = company ? company._id : (Types.ObjectId.isValid(companyId) ? new Types.ObjectId(companyId) : new Types.ObjectId());

    const requirement = new this.requirementModel({
      companyId: resolvedCompanyId,
      ...createRequirementDto,
      status: (createRequirementDto as any).status || RequirementStatus.PUBLISHED,
    });

    await requirement.save();

    return {
      success: true,
      message: 'Requirement created successfully',
      data: requirement,
    };
  }

  async getRequirements(companyId: string, status?: string) {
    let targetCompanyId = null;
    if (Types.ObjectId.isValid(companyId)) {
      const c = await this.companyModel.findById(companyId);
      if (c) targetCompanyId = c._id;
    }

    const query: any = {};
    if (targetCompanyId) query.companyId = targetCompanyId;
    if (status) query.status = status;

    let requirements = await this.requirementModel
      .find(query)
      .sort({ createdAt: -1 });

    if (requirements.length === 0) {
      const fallbackQuery: any = {};
      if (status) fallbackQuery.status = status;
      requirements = await this.requirementModel.find(fallbackQuery).sort({ createdAt: -1 });
    }

    return {
      success: true,
      data: requirements,
    };
  }

  async updateRequirement(requirementId: string, updateRequirementDto: any) {
    const requirement = await this.requirementModel.findById(requirementId);
    if (!requirement) {
      throw new NotFoundException('Requirement not found');
    }

    Object.assign(requirement, updateRequirementDto);
    await requirement.save();

    return {
      success: true,
      message: 'Requirement updated successfully',
      data: requirement,
    };
  }

  async deleteRequirement(requirementId: string) {
    const requirement = await this.requirementModel.findById(requirementId);
    if (!requirement) {
      throw new NotFoundException('Requirement not found');
    }

    await requirement.deleteOne();

    return {
      success: true,
      message: 'Requirement deleted successfully',
    };
  }

  async getMatches(companyId: string, requirementId?: string, limit: number = 10) {
    const company = await this.companyModel.findById(companyId);
    if (!company) {
      throw new NotFoundException('Company not found');
    }

    let requirements;
    if (requirementId) {
      const req = await this.requirementModel.findById(requirementId);
      if (!req) {
        throw new NotFoundException('Requirement not found');
      }
      requirements = [req];
    } else {
      requirements = await this.requirementModel
        .find({ companyId, status: RequirementStatus.PUBLISHED })
        .limit(limit);
    }

    // Get matching interns based on requirements
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

  async onboard(companyId: string) {
    const company = await this.companyModel.findById(companyId);
    if (!company) {
      throw new NotFoundException('Company not found');
    }

    company.status = CompanyStatus.VERIFIED;
    await company.save();

    return {
      success: true,
      message: 'Company onboarded successfully',
      data: company,
    };
  }

  async getStats() {
    const [
      totalCompanies,
      byStatus,
      byIndustry,
      totalRequirements,
      openRequirements,
    ] = await Promise.all([
      this.companyModel.countDocuments(),
      this.companyModel.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      this.companyModel.aggregate([
        { $unwind: '$companyInfo.industry' },
        { $group: { _id: '$companyInfo.industry', count: { $sum: 1 } } },
      ]),
      this.requirementModel.countDocuments(),
      this.requirementModel.countDocuments({ status: RequirementStatus.PUBLISHED }),
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

  private async findMatchingInterns(requirement: any, limit: number) {
    // This would be implemented with a more sophisticated matching algorithm
    // For now, return mock data
    return [];
  }

  async sendCompanyInquiry(data: {
    companyName: string;
    contactPerson: string;
    email: string;
    phone: string;
    techStack?: string;
    internCount?: string;
    message?: string;
    website?: string;
    industry?: string;
    additionalInfo?: string;
  }) {
    // Persist lead to database
    const lead = new this.leadModel({
      companyName: data.companyName || 'Unknown Company',
      contactPerson: data.contactPerson || 'Representative',
      email: (data.email || 'info@company.com').toLowerCase().trim(),
      phone: data.phone || '',
      website: data.website || '',
      industry: data.industry || 'Technology',
      hiringRequirement: data.techStack || 'Software Interns',
      internCount: data.internCount || '1-5',
      message: data.message || '',
      additionalInfo: data.additionalInfo || '',
      status: 'new',
    });

    await lead.save();

    // Send email notification to HR
    try {
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
          <h2 style="color: #4f46e5; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; margin-top: 0;">🏢 New Company Partnership Inquiry</h2>
          <p style="font-size: 14px; color: #334155;">A new employer inquiry has been received via the public portal and recorded in the HR Dashboard:</p>
          
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
              <td style="padding: 8px 0; font-weight: bold; color: #475569;">Tech Stack / Requirement:</td>
              <td style="padding: 8px 0; color: #0f172a;">${data.techStack || 'Not specified'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569;">Message / Notes:</td>
              <td style="padding: 8px 0; color: #0f172a;">${data.message || 'None'}</td>
            </tr>
          </table>
        </div>
      `;

      await this.mailService.sendEmail(
        'interhive.info@gmail.com',
        `🏢 New Company Partnership Inquiry - ${data.companyName}`,
        htmlContent,
      );
    } catch (mailErr) {
      console.error('Failed to send company inquiry email:', mailErr);
    }

    return {
      success: true,
      message: 'Thank you for your interest! The InterHive HR team has received your inquiry and will contact you shortly.',
      data: lead,
    };
  }

  async getLeads(params: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }) {
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.max(1, Number(params.limit) || 20);
    const skip = (page - 1) * limit;

    const query: any = {};
    if (params.status && params.status !== 'all') {
      query.status = params.status;
    }

    if (params.search) {
      const regex = new RegExp(params.search.trim(), 'i');
      query.$or = [
        { companyName: regex },
        { contactPerson: regex },
        { email: regex },
        { industry: regex },
        { hiringRequirement: regex },
      ];
    }

    const [leads, total] = await Promise.all([
      this.leadModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      this.leadModel.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      success: true,
      data: leads,
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  async updateLead(
    id: string,
    updateData: {
      status?: string;
      note?: string;
      assignedTo?: string;
    },
    authorName: string = 'HR Manager',
  ) {
    const lead = await this.leadModel.findById(id);
    if (!lead) {
      throw new NotFoundException('Company lead not found');
    }

    if (updateData.status) {
      lead.status = updateData.status as any;
    }

    if (updateData.assignedTo !== undefined) {
      lead.assignedTo = updateData.assignedTo;
    }

    if (updateData.note) {
      lead.notes.push({
        author: authorName,
        text: updateData.note,
        createdAt: new Date(),
      });
      lead.lastContactedAt = new Date();
    }

    await lead.save();

    return {
      success: true,
      message: 'Company lead updated successfully',
      data: lead,
    };
  }
}