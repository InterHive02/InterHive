import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { MatchStatus } from '@interhive/shared';

export type MatchDocument = Match & Document;

@Schema({ timestamps: true })
export class Match {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  internId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Company',
    required: true,
  })
  companyId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'CompanyRequirement',
    required: true,
  })
  requirementId: Types.ObjectId;

  @Prop({
    type: Number,
    required: true,
    min: 0,
    max: 100,
  })
  matchScore: number;

  @Prop({
    type: {
      skillMatch: { type: Number, min: 0, max: 100 },
      readinessMatch: { type: Number, min: 0, max: 100 },
      experienceMatch: { type: Number, min: 0, max: 100 },
      preferenceMatch: { type: Number, min: 0, max: 100 },
    },
  })
  breakdown: {
    skillMatch: number;
    readinessMatch: number;
    experienceMatch: number;
    preferenceMatch: number;
  };

  @Prop({
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'interview_scheduled', 'interview_completed', 'offer_made', 'offer_accepted', 'offer_rejected', 'hired', 'expired'],
    default: 'pending',
  })
  status: any;

  acceptedAt?: Date;
  rejectedAt?: Date;
  hiredAt?: Date;

  @Prop({
    type: {
      scheduledDate: { type: Date },
      type: { type: String },
      meetingLink: { type: String },
      status: { type: String, enum: ['scheduled', 'completed', 'cancelled', 'rescheduled'] },
    },
  })
  interview: {
    scheduledDate: Date;
    type: string;
    meetingLink: string;
    status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  };

  @Prop({
    type: {
      amount: { type: Number },
      currency: { type: String },
      period: { type: String },
      startDate: { type: Date },
      duration: { type: Number },
      position: { type: String },
      benefits: [{ type: String }],
      status: { type: String, enum: ['pending', 'accepted', 'rejected', 'expired'] },
      sentAt: { type: Date },
    },
  })
  offer: {
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

  @Prop({
    type: {
      acceptedAt: { type: Date },
      rejectedAt: { type: Date },
      hiredAt: { type: Date },
      expiredAt: { type: Date },
    },
  })
  timeline: {
    acceptedAt?: Date;
    rejectedAt?: Date;
    hiredAt?: Date;
    expiredAt?: Date;
  };

  @Prop({
    type: [{
      user: { type: Types.ObjectId, ref: 'User' },
      message: { type: String },
      createdAt: { type: Date, default: Date.now },
    }],
  })
  notes: {
    user: Types.ObjectId;
    message: string;
    createdAt: Date;
  }[];
}

export const MatchSchema = SchemaFactory.createForClass(Match);