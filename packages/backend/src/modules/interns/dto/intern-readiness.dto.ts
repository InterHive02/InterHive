import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsObject, IsDate, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class InternReadinessDto {
  @ApiProperty({ example: 85 })
  @IsNumber()
  overall: number;

  @ApiProperty()
  @IsObject()
  breakdown: {
    technicalSkills: number;
    projects: number;
    communication: number;
    problemSolving: number;
    industryWorkflow: number;
    teamCollaboration: number;
    leadership: number;
    adaptability: number;
  };

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  lastUpdated: Date;

  @ApiProperty()
  @IsArray()
  history: {
    score: number;
    breakdown: {
      technicalSkills: number;
      projects: number;
      communication: number;
      problemSolving: number;
      industryWorkflow: number;
      teamCollaboration: number;
      leadership: number;
      adaptability: number;
    };
    date: Date;
    event: string;
  }[];
}