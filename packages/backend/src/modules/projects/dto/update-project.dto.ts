import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsObject, IsNumber, IsDate, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProjectDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  title?: string;

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

  @ApiProperty({ enum: ['remote', 'hybrid', 'onsite'], required: false })
  @IsOptional()
  @IsEnum(['remote', 'hybrid', 'onsite'])
  workType?: 'remote' | 'hybrid' | 'onsite';

  @ApiProperty({ enum: ['planning', 'in_progress', 'completed', 'paused', 'cancelled'], required: false })
  @IsOptional()
  @IsEnum(['planning', 'in_progress', 'completed', 'paused', 'cancelled'])
  status?: 'planning' | 'in_progress' | 'completed' | 'paused' | 'cancelled';

  @ApiProperty({ enum: ['initiation', 'planning', 'execution', 'monitoring', 'closure'], required: false })
  @IsOptional()
  @IsEnum(['initiation', 'planning', 'execution', 'monitoring', 'closure'])
  phase?: 'initiation' | 'planning' | 'execution' | 'monitoring' | 'closure';

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