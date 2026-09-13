import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AssessmentsController } from './assessments.controller';
import { AssessmentsService } from './assessments.service';
import { SkillAssessment, SkillAssessmentSchema } from './schemas/skill-assessment.schema';
import { AssessmentQuestion, AssessmentQuestionSchema } from './schemas/assessment-question.schema';
import { AssessmentResult, AssessmentResultSchema } from './schemas/assessment-result.schema';
import { UsersModule } from '../users/users.module';
import { InternsModule } from '../interns/interns.module';
import { RedisModule } from '../../common/redis/redis.module';
import { MailModule } from '../../common/mail/mail.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SkillAssessment.name, schema: SkillAssessmentSchema },
      { name: AssessmentQuestion.name, schema: AssessmentQuestionSchema },
      { name: AssessmentResult.name, schema: AssessmentResultSchema },
    ]),
    UsersModule,
    InternsModule,
    RedisModule,
    MailModule,
  ],
  controllers: [AssessmentsController],
  providers: [AssessmentsService],
  exports: [AssessmentsService],
})
export class AssessmentsModule {}