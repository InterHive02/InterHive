import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsArray,
  IsObject,
  IsNumber,
  IsDate,
  IsEnum,
  Min,
} from 'class-validator';

export class CreateCompanyRequirementDto {
  @ApiProperty({ example: 'Frontend Developer' })
  @IsString()
  position: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiProperty({ example: 5 })
  @IsNumber()
  @Min(1)
  count: number;

  @ApiProperty()
  @IsArray()
  @IsObject({ each: true })
  skills: {
    id: string;
    name: string;
    category: string;
    level: string;
  }[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  experience?: {
    min: number;
    max?: number;
  };

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  education?: {
    minDegree: string;
    preferredFields: string[];
  };

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  responsibilities?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  benefits?: string[];

  @ApiProperty()
  @IsObject()
  stipend: {
    min: number;
    max: number;
    currency: string;
    period: 'monthly' | 'hourly' | 'stipend';
  };

  @ApiProperty({ enum: ['remote', 'hybrid', 'onsite'], default: 'hybrid' })
  @IsEnum(['remote', 'hybrid', 'onsite'])
  workType: 'remote' | 'hybrid' | 'onsite';

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty()
  @IsObject()
  duration: {
    min: number;
    max: number;
  };

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  applicationDeadline?: Date;
}