import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DiscountCampaign, DiscountCampaignDocument } from '../schemas/discount-campaign.schema';
import { PricingAuditLog, PricingAuditLogDocument } from '../schemas/pricing-audit-log.schema';
import { CreateCampaignDto, UpdateCampaignDto } from '../dto/campaign.dto';
import { DEFAULT_CAMPAIGNS } from '@interhive/shared';

@Injectable()
export class CampaignService implements OnModuleInit {
  constructor(
    @InjectModel(DiscountCampaign.name) private readonly campaignModel: Model<DiscountCampaignDocument>,
    @InjectModel(PricingAuditLog.name) private readonly auditModel: Model<PricingAuditLogDocument>,
  ) {}

  async onModuleInit() {
    try {
      const count = await this.campaignModel.countDocuments();
      if (count === 0) {
        for (const item of DEFAULT_CAMPAIGNS) {
          await this.campaignModel.create(item);
        }
        console.log('[CampaignService] Seeded default discount campaigns.');
      }
    } catch (err) {
      console.warn('[CampaignService] Error seeding campaigns:', err.message);
    }
  }

  async getAllCampaigns(): Promise<DiscountCampaign[]> {
    return this.campaignModel.find().sort({ createdAt: -1 }).exec();
  }

  async getActiveCampaignForProgram(programKey: string, amount: number): Promise<DiscountCampaign | null> {
    const now = new Date();
    const campaigns = await this.campaignModel
      .find({
        isActive: true,
        startDate: { $lte: now },
        endDate: { $gte: now },
      })
      .sort({ discountValue: -1 })
      .exec();

    for (const c of campaigns) {
      // Check budget
      if (c.budgetCap > 0 && c.currentSpend >= c.budgetCap) continue;
      // Check min order
      if (c.minOrderValue > 0 && amount < c.minOrderValue) continue;
      // Check program eligibility
      if (c.eligiblePrograms && c.eligiblePrograms.length > 0 && !c.eligiblePrograms.includes(programKey)) continue;

      return c;
    }

    return null;
  }

  async createCampaign(dto: CreateCampaignDto, adminUser: any): Promise<DiscountCampaign> {
    const created = await this.campaignModel.create({
      ...dto,
      currentSpend: 0,
    });

    await this.auditModel.create({
      action: 'CREATE_CAMPAIGN',
      performedBy: adminUser?.email || 'admin',
      entityType: 'CAMPAIGN',
      entityId: created._id.toString(),
      newState: dto,
      notes: `Created campaign ${dto.name}`,
    });

    return created;
  }

  async updateCampaign(id: string, dto: UpdateCampaignDto, adminUser: any): Promise<DiscountCampaign> {
    const previous = await this.campaignModel.findById(id).exec();
    if (!previous) throw new NotFoundException('Campaign not found.');

    const updated = await this.campaignModel.findByIdAndUpdate(id, dto, { new: true }).exec();

    await this.auditModel.create({
      action: 'UPDATE_CAMPAIGN',
      performedBy: adminUser?.email || 'admin',
      entityType: 'CAMPAIGN',
      entityId: id,
      previousState: previous.toObject(),
      newState: updated.toObject(),
      notes: `Updated campaign ${previous.name}`,
    });

    return updated;
  }

  async recordSpend(campaignId: string, amount: number) {
    await this.campaignModel.findByIdAndUpdate(campaignId, { $inc: { currentSpend: amount } }).exec();
  }
}
