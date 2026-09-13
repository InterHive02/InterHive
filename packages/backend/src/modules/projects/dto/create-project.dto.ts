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
  ValidateNested,
  Min,
} from 'class-validator';

class TaskDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  assignedTo?: string[];

  @ApiProperty({ enum: ['low', 'medium', 'high', 'critical'], default: 'medium' })
  @IsOptional()
  @IsEnum(['low', 'medium', 'high', 'critical'])
  priority?: 'low' | 'medium' | 'high' | 'critical';

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  storyPoints?: number;

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

export class CreateProjectDto {
  @ApiProperty()
  @IsString()
  companyId: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  category?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  requiredSkills?: {
    id: string;
    name: string;
    category: string;
    level: string;
  }[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  teamSize?: {
    min: number;
    max: number;
  };

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  duration?: {
    weeks: number;
    startDate: Date;
    endDate: Date;
  };

  @ApiProperty({ enum: ['remote', 'hybrid', 'onsite'], default: 'hybrid' })
  @IsOptional()
  @IsEnum(['remote', 'hybrid', 'onsite'])
  workType?: 'remote' | 'hybrid' | 'onsite';

  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TaskDto)
  tasks: TaskDto[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  assignedTo?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  mentors?: string[];
}