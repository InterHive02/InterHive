import { Document, Types } from 'mongoose';
import { MatchStatus } from '@interhive/shared';

export interface IMatch extends Document {
  internId: Types.ObjectId;
  companyId: Types.ObjectId;
  requirementId: Types.ObjectId;
  matchScore: number;
  breakdown: {
    skillMatch: number;
    readinessMatch: number;
    experienceMatch: number;
    preferenceMatch: number;
  };
  status: MatchStatus;
  interview?: {
    scheduledDate: Date;
    type: string;
    meetingLink: string;
    status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  };
  offer?: {
    amount: number;
    currency: string;
    period: string;
    startDate: Date;
    duration: number;
    position: string;
    benefits: string[];
    status: 'pending' | 'accepted' | 'rejected' | 'expired';
    sentAt: Date;
  };
  timeline: {
    acceptedAt?: Date;
    rejectedAt?: Date;
    hiredAt?: Date;
    expiredAt?: Date;
  };
  notes: {
    user: Types.ObjectId;
    message: string;
    createdAt: Date;
  }[];
}

export interface IMatchScore {
  internId: string;
  companyId: string;
  requirementId: string;
  matchScore: number;
  breakdown: {
    skillMatch: number;
    readinessMatch: number;
    experienceMatch: number;
    preferenceMatch: number;
  };
}

export interface IMatchingAlgorithm {
  calculateMatchScore(intern: any, requirement: any): Promise<number>;
  calculateSkillMatch(internSkills: any[], requirementSkills: any[]): number;
  calculateExperienceMatch(internExperience: any[], requirement: any): number;
  calculatePreferenceMatch(internPreferences: any, requirement: any): number;
}