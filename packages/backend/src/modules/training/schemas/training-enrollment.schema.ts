import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TrainingEnrollmentDocument = TrainingEnrollment & Document;

@Schema({ timestamps: true })
export class TrainingEnrollment {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  userId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'TrainingProgram',
    required: true,
  })
  programId: Types.ObjectId;

  @Prop({
    type: Date,
    default: Date.now,
  })
  enrollmentDate: Date;

  @Prop({
    type: Date,
  })
  completionDate: Date;

  @Prop({
    type: String,
    enum: ['active', 'completed', 'withdrawn', 'dropped'],
    default: 'active',
  })
  status: 'active' | 'completed' | 'withdrawn' | 'dropped';

  @Prop({
    type: Number,
    default: 0,
  })
  progress: number;

  @Prop({
    type: Number,
    default: 0,
  })
  currentModuleIndex: number;

  @Prop({
    type: [{
      moduleId: { type: Types.ObjectId, ref: 'TrainingModule' },
      status: { type: String, enum: ['locked', 'in_progress', 'completed'], default: 'locked' },
      progress: { type: Number, default: 0 },
      score: { type: Number },
      startedAt: { type: Date },
      completedAt: { type: Date },
    }],
  })
  moduleProgress: {
    moduleId: Types.ObjectId;
    status: 'locked' | 'in_progress' | 'completed';
    progress: number;
    score?: number;
    startedAt?: Date;
    completedAt?: Date;
  }[];

  @Prop({
    type: {
      issued: { type: Boolean, default: false },
      issuedDate: { type: Date },
      certificateId: { type: String },
      verificationUrl: { type: String },
    },
  })
  certification: {
    issued: boolean;
    issuedDate?: Date;
    certificateId?: string;
    verificationUrl?: string;
  };

  @Prop({
    type: [{
      date: { type: Date, default: Date.now },
      type: { type: String },
      message: { type: String },
    }],
  })
  activityLog: {
    date: Date;
    type: string;
    message: string;
  }[];
}

export const TrainingEnrollmentSchema = SchemaFactory.createForClass(TrainingEnrollment);