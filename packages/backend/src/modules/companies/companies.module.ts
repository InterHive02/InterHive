import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { Company, CompanySchema } from './schemas/company.schema';
import { CompanyRequirement, CompanyRequirementSchema } from './schemas/company-requirement.schema';
import { CompanyLead, CompanyLeadSchema } from './schemas/company-lead.schema';
import { UsersModule } from '../users/users.module';
import { RedisModule } from '../../common/redis/redis.module';
import { MailModule } from '../../common/mail/mail.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Company.name, schema: CompanySchema },
      { name: CompanyRequirement.name, schema: CompanyRequirementSchema },
      { name: CompanyLead.name, schema: CompanyLeadSchema },
    ]),
    UsersModule,
    RedisModule,
    MailModule,
  ],
  controllers: [CompaniesController],
  providers: [CompaniesService],
  exports: [CompaniesService, MongooseModule],
})
export class CompaniesModule {}