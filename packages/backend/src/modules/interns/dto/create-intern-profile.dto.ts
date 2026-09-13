import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsEmail,
  IsDate,
  IsNumber,
  IsArray,
  IsObject,
  ValidateNested,
  Min,
  Max,
} from 'class-validator';

class PersonalInfoDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dateOfBirth?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  nationality?: string;
}

class ContactDto {
  @ApiProperty({ example: 'john@example.com' })
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

class AcademicInfoDto {
  @ApiProperty()
  @IsObject()
  @ValidateNested()
  @Type(() => Object)
  currentEducation: {
    institution: string;
    degree: string;
    field: string;
    startDate: Date;
    endDate?: Date;
    isCurrent: boolean;
    grade?: string;
  };

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  previousEducation?: any[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  cgpa?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  graduationYear?: number;
}

class ProfessionalInfoDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  experience?: any[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  skills?: any[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  certifications?: any[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  resume?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  portfolio?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  github?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  linkedin?: string;
}

class PreferencesDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  preferredDomains?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  preferredLocation?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  preferredWorkType?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  expectedStipend?: {
    min: number;
    max: number;
  };

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  availability?: {
    startDate: Date;
    duration: number;
  };
}

export class CreateInternProfileDto {
  @ApiProperty()
  @IsObject()
  @ValidateNested()
  @Type(() => PersonalInfoDto)
  personalInfo: PersonalInfoDto;

  @ApiProperty()
  @IsObject()
  @ValidateNested()
  @Type(() => ContactDto)
  contact: ContactDto;

  @ApiProperty()
  @IsObject()
  @ValidateNested()
  @Type(() => AcademicInfoDto)
  academicInfo: AcademicInfoDto;

  @ApiProperty()
  @IsObject()
  @ValidateNested()
  @Type(() => ProfessionalInfoDto)
  professionalInfo: ProfessionalInfoDto;

  @ApiProperty()
  @IsObject()
  @ValidateNested()
  @Type(() => PreferencesDto)
  preferences: PreferencesDto;
}