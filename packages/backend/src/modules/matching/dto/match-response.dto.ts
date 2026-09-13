import { ApiProperty } from '@nestjs/swagger';
import { MatchStatus } from '@interhive/shared';

export class MatchResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  internId: string;

  @ApiProperty()
  companyId: string;

  @ApiProperty()
  requirementId: string;

  @ApiProperty()
  matchScore: number;

  @ApiProperty()
  breakdown: {
    skillMatch: number;
    readinessMatch: number;
    experienceMatch: number;
    preferenceMatch: number;
  };

  @ApiProperty()
  status: MatchStatus;

  @ApiProperty()
  interview?: {
    scheduledDate: Date;
    type: string;
    meetingLink: string;
    status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  };

  @ApiProperty()
  offer?: {
    amount: number;
    currency: string;
    period: string;
    startDate: Date;
    duration: number;
    position: string;
    benefits: string[];
    status: 'pending' | 'accepted' | 'rejected' | 'expired';
  };

  @ApiProperty()
  timeline?: {
    acceptedAt?: Date;
    rejectedAt?: Date;
    hiredAt?: Date;
    expiredAt?: Date;
  };

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}