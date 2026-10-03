import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company, CompanyDocument } from '../companies/schemas/company.schema';
import { CompanyRequirement, CompanyRequirementDocument } from '../companies/schemas/company-requirement.schema';
import { InternshipApplication, InternshipApplicationDocument } from '../applications/schemas/internship-application.schema';
import { InternApplication, InternApplicationDocument } from '../interns/schemas/intern-application.schema';
import { PlatformStat, PlatformStatDocument } from './schemas/platform-stat.schema';
import { UpdatePlatformStatDto } from './dto/update-platform-stat.dto';

export interface PlatformPublicStats {
  companyCount: number;
  activeInternshipsCount: number;
  studentsPlacedCount: number;
  averageRating: number | null;
}

export interface LandingStatItem {
  key: string;
  label: string;
  value: number;
  suffix: string;
  icon: string;
  order: number;
  useManualValue: boolean;
  manualValue: number | null;
  lastManualEditAt: Date | null;
  lastEditedBy: string | null;
}

/** Default seed rows that are created on first boot if the collection is empty */
const DEFAULT_STATS: Omit<PlatformStat, keyof Document>[] = [
  { key: 'students_trained',    label: 'Students Trained',         manualValue: 5000,  suffix: '+',  useManualValue: true,  icon: 'users',    order: 1, lastManualEditAt: null, lastEditedBy: null },
  { key: 'internships_provided', label: 'Internships Provided',    manualValue: 1200,  suffix: '+',  useManualValue: true,  icon: 'briefcase', order: 2, lastManualEditAt: null, lastEditedBy: null },
  { key: 'partner_companies',   label: 'Partner Companies',        manualValue: 80,    suffix: '+',  useManualValue: true,  icon: 'building2', order: 3, lastManualEditAt: null, lastEditedBy: null },
  { key: 'ppo_conversion',      label: 'PPO Conversion (Target)',  manualValue: 70,    suffix: '%+', useManualValue: true,  icon: 'trophy',   order: 4, lastManualEditAt: null, lastEditedBy: null },
];

@Injectable()
export class StatsService {
  private readonly logger = new Logger(StatsService.name);
  private cachedStats: PlatformPublicStats | null = null;
  private lastFetchedAt = 0;
  private readonly CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour in-memory cache

  constructor(
    @InjectModel(Company.name) private companyModel: Model<CompanyDocument>,
    @InjectModel(CompanyRequirement.name) private requirementModel: Model<CompanyRequirementDocument>,
    @InjectModel(InternshipApplication.name) private internshipAppModel: Model<InternshipApplicationDocument>,
    @InjectModel(InternApplication.name) private internAppModel: Model<InternApplicationDocument>,
    @InjectModel(PlatformStat.name) private platformStatModel: Model<PlatformStatDocument>,
  ) {}

  // ─────────────────────────────────────────────────────────
  //  INTERNAL: Seed default rows if none exist
  // ─────────────────────────────────────────────────────────
  async ensureSeedData(): Promise<void> {
    const count = await this.platformStatModel.countDocuments();
    if (count === 0) {
      this.logger.log('Seeding default platform stats...');
      await this.platformStatModel.insertMany(DEFAULT_STATS);
    }
  }

  // ─────────────────────────────────────────────────────────
  //  PUBLIC: Get landing page stats (merges DB live counts with manual overrides)
  // ─────────────────────────────────────────────────────────
  async getLandingStats(): Promise<LandingStatItem[]> {
    await this.ensureSeedData();

    // Fetch stored stat configurations
    const storedStats = await this.platformStatModel.find().sort({ order: 1 }).lean();

    // Compute live counts (used when useManualValue === false)
    const liveValues = await this.computeLiveValues();

    return storedStats.map((stat) => {
      let value: number;

      if (stat.useManualValue && stat.manualValue !== null) {
        value = stat.manualValue;
      } else {
        // Fall back to live computed value based on stat key
        value = liveValues[stat.key] ?? stat.manualValue ?? 0;
      }

      return {
        key: stat.key,
        label: stat.label,
        value,
        suffix: stat.suffix,
        icon: stat.icon,
        order: stat.order,
        useManualValue: stat.useManualValue,
        manualValue: stat.manualValue,
        lastManualEditAt: stat.lastManualEditAt,
        lastEditedBy: stat.lastEditedBy,
      };
    });
  }

  // ─────────────────────────────────────────────────────────
  //  ADMIN: Get all stat configs (full detail for admin panel)
  // ─────────────────────────────────────────────────────────
  async getAllStatConfigs(): Promise<PlatformStatDocument[]> {
    await this.ensureSeedData();
    return this.platformStatModel.find().sort({ order: 1 });
  }

  // ─────────────────────────────────────────────────────────
  //  ADMIN: Update a single stat (manual value + mode toggle)
  // ─────────────────────────────────────────────────────────
  async updateStat(
    key: string,
    dto: UpdatePlatformStatDto,
    editorEmail?: string,
  ): Promise<PlatformStatDocument> {
    const stat = await this.platformStatModel.findOne({ key });
    if (!stat) {
      throw new NotFoundException(`Stat with key "${key}" not found.`);
    }

    if (dto.manualValue !== undefined) {
      stat.manualValue = dto.manualValue;
      stat.lastManualEditAt = new Date();
      stat.lastEditedBy = editorEmail || null;
    }
    if (dto.useManualValue !== undefined) {
      stat.useManualValue = dto.useManualValue;
    }
    if (dto.label !== undefined) {
      stat.label = dto.label;
    }
    if (dto.suffix !== undefined) {
      stat.suffix = dto.suffix;
    }

    await stat.save();
    this.logger.log(`Stat "${key}" updated by ${editorEmail ?? 'unknown'}: ${JSON.stringify(dto)}`);
    return stat;
  }

  // ─────────────────────────────────────────────────────────
  //  ADMIN: Sync — compute live values and push them to manualValue
  //         but keep useManualValue = false (live mode)
  // ─────────────────────────────────────────────────────────
  async syncFromSystemData(editorEmail?: string): Promise<LandingStatItem[]> {
    const liveValues = await this.computeLiveValues();

    await this.ensureSeedData();
    const storedStats = await this.platformStatModel.find();

    for (const stat of storedStats) {
      const live = liveValues[stat.key];
      if (live !== undefined && live > 0) {
        // Sync live value into manualValue for reference, switch to live mode
        stat.manualValue = live;
        stat.useManualValue = false;
        stat.lastManualEditAt = new Date();
        stat.lastEditedBy = editorEmail || null;
        await stat.save();
      }
    }

    this.logger.log(`Stats synced from system data by ${editorEmail ?? 'unknown'}. Live values: ${JSON.stringify(liveValues)}`);
    return this.getLandingStats();
  }

  // ─────────────────────────────────────────────────────────
  //  INTERNAL: Compute live values from DB collections
  // ─────────────────────────────────────────────────────────
  private async computeLiveValues(): Promise<Record<string, number>> {
    try {
      const [
        companyCount,
        activeInternshipsCount,
        placedInternshipApps,
        placedInternApps,
        totalApplications,
      ] = await Promise.all([
        this.companyModel.countDocuments(),
        this.requirementModel.countDocuments({ status: { $in: ['active', 'open', 'published'] } }),
        this.internshipAppModel.countDocuments({ status: { $in: ['selected', 'hired', 'placed'] } }),
        this.internAppModel.countDocuments({ status: { $in: ['accepted', 'hired', 'placed', 'offered'] } }),
        this.internshipAppModel.countDocuments(),
      ]);

      const studentsPlaced = placedInternshipApps + placedInternApps;

      return {
        students_trained: totalApplications,         // All applicants ever = trained pipeline
        internships_provided: studentsPlaced || activeInternshipsCount,
        partner_companies: companyCount,
        ppo_conversion: 70,                          // Target — cannot be auto-computed yet
      };
    } catch (err: any) {
      this.logger.error(`Error computing live stats: ${err.message}`);
      return {};
    }
  }

  // ─────────────────────────────────────────────────────────
  //  LEGACY: Keep backward compatible getPublicStats()
  // ─────────────────────────────────────────────────────────
  async getPublicStats(): Promise<PlatformPublicStats> {
    const now = Date.now();
    if (this.cachedStats && now - this.lastFetchedAt < this.CACHE_TTL_MS) {
      return this.cachedStats;
    }

    try {
      const live = await this.computeLiveValues();
      this.cachedStats = {
        companyCount: live['partner_companies'] ?? 0,
        activeInternshipsCount: live['internships_provided'] ?? 0,
        studentsPlacedCount: live['students_trained'] ?? 0,
        averageRating: null,
      };
      this.lastFetchedAt = now;
      return this.cachedStats;
    } catch {
      return { companyCount: 0, activeInternshipsCount: 0, studentsPlacedCount: 0, averageRating: null };
    }
  }
}
