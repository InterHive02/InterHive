import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company, CompanyDocument } from '../companies/schemas/company.schema';
import { CompanyRequirement, CompanyRequirementDocument } from '../companies/schemas/company-requirement.schema';
import { InternshipApplication, InternshipApplicationDocument } from '../applications/schemas/internship-application.schema';
import { InternApplication, InternApplicationDocument } from '../interns/schemas/intern-application.schema';

export interface PlatformPublicStats {
  companyCount: number;
  activeInternshipsCount: number;
  studentsPlacedCount: number;
  averageRating: number | null;
}

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
  ) {}

  async getPublicStats(): Promise<PlatformPublicStats> {
    const now = Date.now();
    // Return cached data if within TTL
    if (this.cachedStats && now - this.lastFetchedAt < this.CACHE_TTL_MS) {
      return this.cachedStats;
    }

    try {
      const [
        companyCount,
        activeInternshipsCount,
        placedInternshipApps,
        placedInternApps,
      ] = await Promise.all([
        this.companyModel.countDocuments(),
        this.requirementModel.countDocuments({
          status: { $in: ['active', 'open', 'published'] },
        }),
        this.internshipAppModel.countDocuments({
          status: { $in: ['selected', 'hired', 'placed'] },
        }),
        this.internAppModel.countDocuments({
          status: { $in: ['accepted', 'hired', 'placed', 'offered'] },
        }),
      ]);

      const studentsPlacedCount = Math.max(placedInternshipApps, placedInternApps) || (placedInternshipApps + placedInternApps);

      this.cachedStats = {
        companyCount: companyCount || 0,
        activeInternshipsCount: activeInternshipsCount || 0,
        studentsPlacedCount: studentsPlacedCount || 0,
        averageRating: null, // Honest: null until real rating collection exists
      };
      this.lastFetchedAt = now;

      this.logger.log(`Updated public platform stats cache: ${JSON.stringify(this.cachedStats)}`);
      return this.cachedStats;
    } catch (err: any) {
      this.logger.error(`Error querying public platform stats: ${err.message}`);
      if (this.cachedStats) return this.cachedStats;
      return {
        companyCount: 0,
        activeInternshipsCount: 0,
        studentsPlacedCount: 0,
        averageRating: null,
      };
    }
  }
}
