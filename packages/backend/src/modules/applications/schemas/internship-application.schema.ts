import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type InternshipApplicationDocument = InternshipApplication & Document;

export type ApplicationWorkflowStatus =
  | 'new'
  | 'under_review'
  | 'shortlisted'
  | 'interview_scheduled'
  | 'interview_completed'
  | 'selected'
  | 'rejected';

@Schema({ timestamps: true })
export class InternshipApplication {
  @Prop({ required: true, trim: true })
  fullName: string;

  @Prop({ required: true, lowercase: true, trim: true, index: true })
  email: string;

  @Prop({ required: true, trim: true })
  phone: string;

  @Prop({ required: true, trim: true })
  rollNumber: string;

  @Prop({ required: true, trim: true })
  institution: string;

  @Prop({ required: true, trim: true })
  degree: string;

  @Prop({ required: true, trim: true })
  semester: string;

  @Prop({ type: [String], default: [] })
  skills: string[];

  @Prop({ type: [String], default: [] })
  areasOfInterest: string[];

  @Prop({
    type: String,
    enum: ['remote', 'hybrid', 'onsite'],
    default: 'remote',
  })
  internshipPreference: 'remote' | 'hybrid' | 'onsite';

  @Prop({ trim: true })
  previousExperience?: string;

  @Prop({ trim: true })
  resumeUrl: string;

  @Prop({ trim: true })
  linkedInUrl?: string;

  @Prop({ trim: true })
  githubUrl?: string;

  @Prop({ trim: true })
  portfolioUrl?: string;

  @Prop({ required: true, trim: true })
  reasonForApplying: string;

  @Prop({ trim: true })
  additionalInfo?: string;

  @Prop({
    type: String,
    enum: [
      'new',
      'under_review',
      'shortlisted',
      'interview_scheduled',
      'interview_completed',
      'selected',
      'rejected',
    ],
    default: 'new',
  })
  status: ApplicationWorkflowStatus;

  @Prop({
    type: {
      date: { type: String },
      time: { type: String },
      mode: { type: String, enum: ['online', 'offline'], default: 'online' },
      linkOrLocation: { type: String },
      interviewer: { type: String },
      notes: { type: String },
      result: { type: String, enum: ['pending', 'passed', 'failed'], default: 'pending' },
    },
  })
  interview?: {
    date?: string;
    time?: string;
    mode?: 'online' | 'offline';
    linkOrLocation?: string;
    interviewer?: string;
    notes?: string;
    result?: 'pending' | 'passed' | 'failed';
  };

  @Prop({
    type: [
      {
        author: { type: String, required: true },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    default: [],
  })
  notes: {
    author: string;
    text: string;
    createdAt: Date;
  }[];

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdUserId?: Types.ObjectId;

  @Prop({ type: Boolean, default: false })
  accountCreated: boolean;
}

export const InternshipApplicationSchema = SchemaFactory.createForClass(InternshipApplication);
