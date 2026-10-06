import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  InternshipApplication,
  InternshipApplicationSchema,
} from './schemas/internship-application.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { ApplicationsService } from './applications.service';
import { ApplicationsController } from './applications.controller';
import { MailModule } from '../../common/mail/mail.module';
import { CommunicationModule } from '../communication/communication.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: InternshipApplication.name, schema: InternshipApplicationSchema },
      { name: User.name, schema: UserSchema },
    ]),
    MailModule,
    forwardRef(() => CommunicationModule),
  ],
  controllers: [ApplicationsController],
  providers: [ApplicationsService],
  exports: [ApplicationsService],
})
export class ApplicationsModule {}
