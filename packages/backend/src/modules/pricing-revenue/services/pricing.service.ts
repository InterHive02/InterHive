import { Injectable, NotFoundException, BadRequestException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProgramPricing, ProgramPricingDocument } from '../schemas/program-pricing.schema';
import { PricingAuditLog, PricingAuditLogDocument } from '../schemas/pricing-audit-log.schema';
import { CreateProgramPricingDto, UpdateProgramPricingDto } from '../dto/pricing.dto';
import { DEFAULT_PROGRAM_PRICINGS } from '@interhive/shared';

@Injectable()
export class PricingService implements OnModuleInit {
  constructor(
    @InjectModel(ProgramPricing.name) private readonly pricingModel: Model<ProgramPricingDocument>,
    @InjectModel(PricingAuditLog.name) private readonly auditModel: Model<PricingAuditLogDocument>,
  ) {}

  async onModuleInit() {
    // Auto-seed default program pricings if collection is empty and ensure all programs include taxes
    try {
      await this.pricingModel.updateMany({}, { $set: { taxIncluded: true, taxPercentage: 0 } });
      const count = await this.pricingModel.countDocuments();
      if (count === 0) {
        for (const item of DEFAULT_PROGRAM_PRICINGS) {
          await this.pricingModel.create({ ...item, taxIncluded: true, taxPercentage: 0 });
        }
        console.log('[PricingService] Seeded default program pricing configurations.');
      }
    } catch (err) {
      console.warn('[PricingService] Error during auto-seeding:', err.message);
    }
  }

  async getAllPrograms(onlyActive = false): Promise<ProgramPricing[]> {
    const filter = onlyActive ? { isActive: true } : {};
    return this.pricingModel.find(filter).sort({ originalPrice: 1 }).exec();
  }

  async getProgramByKey(programKey: string): Promise<ProgramPricing> {
    const program = await this.pricingModel.findOne({ programKey }).exec();
    if (!program) {
      throw new NotFoundException(`Program pricing for key '${programKey}' not found.`);
    }
    return program;
  }

  async getProgramById(id: string): Promise<ProgramPricing> {
    const program = await this.pricingModel.findById(id).exec();
    if (!program) {
      throw new NotFoundException(`Program pricing with id '${id}' not found.`);
    }
    return program;
  }

  async createProgramPricing(dto: CreateProgramPricingDto, adminUser: any): Promise<ProgramPricing> {
    const existing = await this.pricingModel.findOne({ programKey: dto.programKey }).exec();
    if (existing) {
      throw new BadRequestException(`Pricing for program '${dto.programKey}' already exists.`);
    }

    const created = await this.pricingModel.create({
      ...dto,
      pricingVersion: 1,
      history: [
        {
          version: 1,
          originalPrice: dto.originalPrice,
          promotionalPrice: dto.promotionalPrice,
          changedAt: new Date().toISOString(),
          changedBy: adminUser?.email || 'admin',
          reason: 'Initial pricing configuration',
        },
      ],
    });

    await this.auditModel.create({
      action: 'CREATE_PRICING',
      performedBy: adminUser?.email || 'admin',
      entityType: 'PRICING',
      entityId: created._id.toString(),
      newState: dto,
      notes: `Created pricing for ${dto.title}`,
    });

    return created;
  }

  async updateProgramPricing(id: string, dto: UpdateProgramPricingDto, adminUser: any): Promise<ProgramPricing> {
    const program = await this.pricingModel.findById(id).exec();
    if (!program) {
      throw new NotFoundException(`Program pricing not found.`);
    }

    const previousState = program.toObject();
    const isPriceChanged =
      (dto.originalPrice !== undefined && dto.originalPrice !== program.originalPrice) ||
      (dto.promotionalPrice !== undefined && dto.promotionalPrice !== program.promotionalPrice);

    const nextVersion = isPriceChanged ? program.pricingVersion + 1 : program.pricingVersion;
    const historyEntry = isPriceChanged
      ? {
          version: nextVersion,
          originalPrice: dto.originalPrice ?? program.originalPrice,
          promotionalPrice: dto.promotionalPrice ?? program.promotionalPrice,
          changedAt: new Date().toISOString(),
          changedBy: adminUser?.email || 'admin',
          reason: dto.changeReason || 'Admin updated program price',
        }
      : null;

    const updated = await this.pricingModel
      .findByIdAndUpdate(
        id,
        {
          ...dto,
          pricingVersion: nextVersion,
          ...(historyEntry ? { $push: { history: historyEntry } } : {}),
        },
        { new: true },
      )
      .exec();

    await this.auditModel.create({
      action: 'UPDATE_PRICING',
      performedBy: adminUser?.email || 'admin',
      entityType: 'PRICING',
      entityId: id,
      previousState,
      newState: updated.toObject(),
      notes: dto.changeReason || `Updated pricing for ${program.title}`,
    });

    return updated;
  }

  async toggleActive(id: string, isActive: boolean, adminUser: any): Promise<ProgramPricing> {
    const updated = await this.pricingModel.findByIdAndUpdate(id, { isActive }, { new: true }).exec();
    if (!updated) {
      throw new NotFoundException(`Program pricing not found.`);
    }

    await this.auditModel.create({
      action: isActive ? 'ACTIVATE_PRICING' : 'DEACTIVATE_PRICING',
      performedBy: adminUser?.email || 'admin',
      entityType: 'PRICING',
      entityId: id,
      notes: `Set isActive to ${isActive}`,
    });

    return updated;
  }
}
