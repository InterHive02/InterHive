import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsArray,
  IsObject,
  IsNumber,
  IsEnum,
  ValidateNested,
  Min,
} from 'class-validator';

class ModuleDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  order?: number;

  @ApiProperty({ enum: ['video', 'article', 'quiz', 'assignment', 'project', 'lab'] })
  @IsEnum(['video', 'article', 'quiz', 'assignment', 'project', 'lab'])
  type: 'video' | 'article' | 'quiz' | 'assignment' | 'project' | 'lab';

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  duration?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  content?: {
    videoUrl?: string;
    content?: string;
    resources?: {
      title: string;
      url: string;
      type: string;
    }[];
  };

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  quiz?: {
    type: string;
    question: string;
    options: string[];
    correctAnswer: string;
    explanation?: string;
  }[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  assignment?: {
    description: string;
    instructions: string[];
    submissionType: string;
    maxScore: number;
  };

  @ApiProperty({ default: true })
  @IsOptional()
  isRequired?: boolean;
}

export class CreateTrainingDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  duration?: {
    min: number;
    max: number;
  };

  @ApiProperty({ enum: ['beginner', 'intermediate', 'advanced', 'expert'], default: 'intermediate' })
  @IsOptional()
  @IsEnum(['beginner', 'intermediate', 'advanced', 'expert'])
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  industry?: {
    id: string;
    name: string;
    category: string;
  }[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  eligibility?: {
    requiredSkills?: {
      id: string;
      name: string;
      category: string;
    }[];
    preferredSkills?: {
      id: string;
      name: string;
      category: string;
    }[];
    minReadinessScore?: number;
    startDate?: Date;
    endDate?: Date;
  };

  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ModuleDto)
  modules: ModuleDto[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  mentors?: string[];

  @ApiProperty({ enum: ['free', 'paid'], default: 'free' })
  @IsOptional()
  @IsEnum(['free', 'paid'])
  pricing?: {
    type: 'free' | 'paid';
  };
}