import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsObject, IsArray, IsString, IsNumber, IsEmail } from 'class-validator';

export class UpdateInternProfileDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  personalInfo?: {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: Date;
    gender?: string;
    nationality?: string;
    profilePhoto?: string;
  };

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  contact?: {
    email?: string;
    phone?: string;
    alternatePhone?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      country?: string;
      zipCode?: string;
    };
  };

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  academicInfo?: {
    currentEducation?: {
      institution: string;
      degree: string;
      field: string;
      startDate: Date;
      endDate?: Date;
      isCurrent: boolean;
      grade?: string;
    };
    cgpa?: number;
    graduationYear?: number;
  };

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  professionalInfo?: {
    experience?: any[];
    skills?: any[];
    certifications?: any[];
    resume?: string;
    portfolio?: string;
    github?: string;
    linkedin?: string;
  };

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  preferences?: {
    preferredDomains?: string[];
    preferredLocation?: string[];
    preferredWorkType?: string[];
    expectedStipend?: {
      min: number;
      max: number;
    };
    availability?: {
      startDate: Date;
      duration: number;
    };
  };
}