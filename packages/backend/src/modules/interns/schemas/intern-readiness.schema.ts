import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type InternReadinessDocument = InternReadiness & Document;

@Schema({ timestamps: true })
export class InternReadiness {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  })
  userId: Types.ObjectId;

  @Prop({
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  })
  overall: number;

  @Prop({
    type: {
      technicalSkills: { type: Number, min: 0, max: 100, default: 0 },
      projects: { type: Number, min: 0, max: 100, default: 0 },
      communication: { type: Number, min: 0, max: 100, default: 0 },
      problemSolving: { type: Number, min: 0, max: 100, default: 0 },
      industryWorkflow: { type: Number, min: 0, max: 100, default: 0 },
      teamCollaboration: { type: Number, min: 0, max: 100, default: 0 },
      leadership: { type: Number, min: 0, max: 100, default: 0 },
      adaptability: { type: Number, min: 0, max: 100, default: 0 },
    },
  })
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

  @Prop({
    type: Date,
    default: Date.now,
  })
  lastUpdated: Date;

  @Prop({
    type: [{
      score: { type: Number },
      breakdown: {
        technicalSkills: { type: Number },
        projects: { type: Number },
        communication: { type: Number },
        problemSolving: { type: Number },
        industryWorkflow: { type: Number },
        teamCollaboration: { type: Number },
        leadership: { type: Number },
        adaptability: { type: Number },
      },
      date: { type: Date, default: Date.now },
      event: { type: String },
    }],
  })
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

export const InternReadinessSchema = SchemaFactory.createForClass(InternReadiness);