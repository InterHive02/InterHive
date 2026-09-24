import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { Company, CompanySchema } from '../companies/schemas/company.schema';
import { CompanyRequirement, CompanyRequirementSchema } from '../companies/schemas/company-requirement.schema';
import { InternshipApplication, InternshipApplicationSchema } from '../applications/schemas/internship-application.schema';
import { InternApplication, InternApplicationSchema } from '../interns/schemas/intern-application.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Company.name, schema: CompanySchema },
      { name: CompanyRequirement.name, schema: CompanyRequirementSchema },
      { name: InternshipApplication.name, schema: InternshipApplicationSchema },
      { name: InternApplication.name, schema: InternApplicationSchema },
    ]),
  ],
  controllers: [StatsController],
  providers: [StatsService],
  exports: [StatsService],
})
export class StatsModule {}
