import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MatchingController } from './matching.controller';
import { MatchingService } from './matching.service';
import { Match, MatchSchema } from './schemas/match.schema';
import { SkillMatcher } from './algorithms/skill-matcher';
import { ReadinessScorer } from './algorithms/readiness-scorer';
import { UsersModule } from '../users/users.module';
import { InternsModule } from '../interns/interns.module';
import { CompaniesModule } from '../companies/companies.module';
import { AssessmentsModule } from '../assessments/assessments.module';
import { RedisModule } from '../../common/redis/redis.module';
import { MailModule } from '../../common/mail/mail.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Match.name, schema: MatchSchema },
    ]),
    UsersModule,
    InternsModule,
    CompaniesModule,
    AssessmentsModule,
    RedisModule,
    MailModule,
  ],
  controllers: [MatchingController],
  providers: [MatchingService, SkillMatcher, ReadinessScorer],
  exports: [MatchingService, MongooseModule],
})
export class MatchingModule {}