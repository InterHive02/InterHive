import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class AnswerDto {
  @ApiProperty()
  @IsString()
  questionId: string;

  @ApiProperty()
  answer: string | string[] | any;

  @ApiProperty({ required: false })
  @IsOptional()
  codeSubmission?: {
    language: string;
    code: string;
  };
}

export class SubmitAssessmentDto {
  @ApiProperty()
  @IsString()
  resultId: string;

  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerDto)
  answers: AnswerDto[];
}