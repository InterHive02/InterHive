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
  Max,
  IsBoolean,
} from 'class-validator';
import { AssessmentType } from '@interhive/shared';

class QuestionOptionDto {
  @ApiProperty()
  @IsString()
  text: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isCorrect?: boolean;
}

class QuestionDto {
  @ApiProperty({ enum: ['multiple_choice', 'multiple_select', 'coding', 'essay', 'practical'] })
  @IsEnum(['multiple_choice', 'multiple_select', 'coding', 'essay', 'practical'])
  type: 'multiple_choice' | 'multiple_select' | 'coding' | 'essay' | 'practical';

  @ApiProperty({ enum: ['easy', 'medium', 'hard'], default: 'medium' })
  @IsOptional()
  @IsEnum(['easy', 'medium', 'hard'])
  difficulty?: 'easy' | 'medium' | 'hard';

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty()
  @IsString()
  text: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionOptionDto)
  options?: QuestionOptionDto[];

  @ApiProperty()
  @IsOptional()
  correctAnswer?: string | string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  explanation?: string;

  @ApiProperty({ default: 10 })
  @IsNumber()
  @Min(1)
  points: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  codeSnippet?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  expectedOutput?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  constraints?: string[];
}

export class CreateAssessmentDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: ['technical', 'soft_skills', 'aptitude', 'behavioral', 'coding', 'project'] })
  @IsEnum(['technical', 'soft_skills', 'aptitude', 'behavioral', 'coding', 'project'])
  type: AssessmentType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  category?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  skillsAssessed?: {
    id: string;
    name: string;
    category: string;
    level: string;
  }[];

  @ApiProperty({ enum: ['beginner', 'intermediate', 'advanced', 'expert'], default: 'intermediate' })
  @IsOptional()
  @IsEnum(['beginner', 'intermediate', 'advanced', 'expert'])
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'expert';

  @ApiProperty()
  @IsNumber()
  @Min(1)
  duration: number;

  @ApiProperty({ default: 70 })
  @IsNumber()
  @Min(0)
  @Max(100)
  passingScore?: number;

  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  questions: QuestionDto[];

  @ApiProperty({ default: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  maxAttempts?: number;
}