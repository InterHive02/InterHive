import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { ReadinessAnalyticsService } from './services/readiness-analytics.service';
import { CompanyAnalyticsService } from './services/company-analytics.service';
import { UsersModule } from '../users/users.module';
import { InternsModule } from '../interns/interns.module';
import { CompaniesModule } from '../companies/companies.module';
import { AssessmentsModule } from '../assessments/assessments.module';
import { ProjectsModule } from '../projects/projects.module';
import { MatchingModule } from '../matching/matching.module';
import { RedisModule } from '../../common/redis/redis.module';

@Module({
  imports: [
    UsersModule,
    InternsModule,
    CompaniesModule,
    AssessmentsModule,
    ProjectsModule,
    MatchingModule,
    RedisModule,
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService, ReadinessAnalyticsService, CompanyAnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}