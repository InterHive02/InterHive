import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApplicationStatus } from '@interhive/shared';

export type InternApplicationDocument = InternApplication & Document;

@Schema({ timestamps: true })
export class InternApplication {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  userId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Program',
    required: true,
  })
  programId: Types.ObjectId;

  @Prop({
    type: String,
  })
  coverLetter: string;

  @Prop({
    type: String,
    enum: ['pending', 'under_review', 'assessment', 'interview', 'offered', 'accepted', 'rejected', 'withdrawn'],
    default: 'pending',
  })
  status: ApplicationStatus;

  @Prop({
    type: Number,
  })
  assessmentScore: number;

  @Prop({
    type: Date,
  })
  interviewDate: Date;

  @Prop({
    type: {
      companyId: { type: Types.ObjectId },
      position: { type: String },
      stipend: {
        amount: { type: Number },
        currency: { type: String },
        period: { type: String },
      },
      startDate: { type: Date },
      duration: { type: Number },
      location: { type: String },
      workType: { type: String },
    },
  })
  offerDetails: {
    companyId: Types.ObjectId;
    position: string;
    stipend: {
      amount: number;
      currency: string;
      period: 'monthly' | 'hourly' | 'stipend';
    };
    startDate: Date;
    duration: number;
    location: string;
    workType: 'remote' | 'hybrid' | 'onsite';
  };

  @Prop({
    type: [{
      user: { type: Types.ObjectId, ref: 'User' },
      text: { type: String },
      createdAt: { type: Date, default: Date.now },
    }],
  })
  comments: {
    user: Types.ObjectId;
    text: string;
    createdAt: Date;
  }[];
}

export const InternApplicationSchema = SchemaFactory.createForClass(InternApplication);