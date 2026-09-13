import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  InternshipApplication,
  InternshipApplicationSchema,
} from './schemas/internship-application.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { ApplicationsService } from './applications.service';
import { ApplicationsController } from './applications.controller';
import { MailModule } from '../../common/mail/mail.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: InternshipApplication.name, schema: InternshipApplicationSchema },
      { name: User.name, schema: UserSchema },
    ]),
    MailModule,
  ],
  controllers: [ApplicationsController],
  providers: [ApplicationsService],
  exports: [ApplicationsService],
})
export class ApplicationsModule {}
