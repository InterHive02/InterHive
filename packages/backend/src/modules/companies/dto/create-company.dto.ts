import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsEmail,
  IsArray,
  IsObject,
  ValidateNested,
  IsNumber,
  IsUrl,
  IsDate,
} from 'class-validator';

class CompanyInfoDto {
  @ApiProperty({ example: 'Tech Corp' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Tech Corporation Pvt Ltd' })
  @IsString()
  legalName: string;

  @ApiProperty({ example: 'TC123456' })
  @IsString()
  registrationNumber: string;

  @ApiProperty({ example: ['Technology', 'Software'] })
  @IsArray()
  @IsString({ each: true })
  industry: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  size?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  foundedYear?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;
}

class ContactInfoDto {
  @ApiProperty({ example: 'hr@techcorp.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
}

class SubscriptionDto {
  @ApiProperty({ required: false, default: 'basic' })
  @IsOptional()
  @IsString()
  plan?: string;

  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  @IsNumber()
  tier?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;
}

export class CreateCompanyDto {
  @ApiProperty()
  @IsObject()
  @ValidateNested()
  @Type(() => CompanyInfoDto)
  companyInfo: CompanyInfoDto;

  @ApiProperty()
  @IsObject()
  @ValidateNested()
  @Type(() => ContactInfoDto)
  contact: {
    primaryContact: ContactInfoDto;
    hrContact?: ContactInfoDto;
    technicalContact?: ContactInfoDto;
  };

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => SubscriptionDto)
  subscription?: SubscriptionDto;
}