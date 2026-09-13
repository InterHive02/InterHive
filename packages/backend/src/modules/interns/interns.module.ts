import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InternsController } from './interns.controller';
import { InternsService } from './interns.service';
import { InternProfile, InternProfileSchema } from './schemas/intern-profile.schema';
import { InternApplication, InternApplicationSchema } from './schemas/intern-application.schema';
import { InternReadiness, InternReadinessSchema } from './schemas/intern-readiness.schema';
import { UsersModule } from '../users/users.module';
import { RedisModule } from '../../common/redis/redis.module';
import { MailModule } from '../../common/mail/mail.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: InternProfile.name, schema: InternProfileSchema },
      { name: InternApplication.name, schema: InternApplicationSchema },
      { name: InternReadiness.name, schema: InternReadinessSchema },
    ]),
    UsersModule,
    RedisModule,
    MailModule,
  ],
  controllers: [InternsController],
  providers: [InternsService],
  exports: [InternsService, MongooseModule],
})
export class InternsModule {}