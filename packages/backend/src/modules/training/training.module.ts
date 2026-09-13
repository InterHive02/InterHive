import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TrainingController } from './training.controller';
import { TrainingService } from './training.service';
import { TrainingProgram, TrainingProgramSchema } from './schemas/training-program.schema';
import { TrainingModule as TrainingModuleEntity, TrainingModuleSchema } from './schemas/training-module.schema';
import { TrainingEnrollment, TrainingEnrollmentSchema } from './schemas/training-enrollment.schema';
import { UsersModule } from '../users/users.module';
import { InternsModule } from '../interns/interns.module';
import { RedisModule } from '../../common/redis/redis.module';
import { MailModule } from '../../common/mail/mail.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TrainingProgram.name, schema: TrainingProgramSchema },
      { name: TrainingModuleEntity.name, schema: TrainingModuleSchema },
      { name: TrainingEnrollment.name, schema: TrainingEnrollmentSchema },
    ]),
    UsersModule,
    InternsModule,
    RedisModule,
    MailModule,
  ],
  controllers: [TrainingController],
  providers: [TrainingService],
  exports: [TrainingService],
})
export class TrainingModule {}