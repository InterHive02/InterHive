import { ApiProperty } from '@nestjs/swagger';

export class AnalyticsResponseDto {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  message: string;

  @ApiProperty()
  data: any;

  @ApiProperty()
  timestamp: Date;
}

export class ReadinessAnalyticsDto {
  @ApiProperty()
  overallAverage: number;

  @ApiProperty()
  byDepartment: {
    department: string;
    average: number;
    count: number;
  }[];

  @ApiProperty()
  distribution: {
    range: string;
    count: number;
  }[];

  @ApiProperty()
  topSkills: {
    skill: string;
    count: number;
    averageLevel: string;
  }[];

  @ApiProperty()
  trends: {
    date: Date;
    average: number;
    total: number;
  }[];
}

export class CompanyAnalyticsDto {
  @ApiProperty()
  totalCompanies: number;

  @ApiProperty()
  byIndustry: {
    industry: string;
    count: number;
  }[];

  @ApiProperty()
  byStatus: {
    status: string;
    count: number;
  }[];

  @ApiProperty()
  hiringTrends: {
    month: string;
    requirements: number;
    hires: number;
  }[];

  @ApiProperty()
  satisfactionScore: number;
}