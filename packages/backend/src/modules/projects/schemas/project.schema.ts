import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ProjectStatus } from '@interhive/shared';

export type ProjectDocument = Project & Document;

@Schema({ timestamps: true })
export class Project {
  @Prop({
    type: Types.ObjectId,
    ref: 'Company',
    required: true,
  })
  companyId: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
  })
  title: string;

  @Prop({
    type: String,
  })
  description: string;

  @Prop({
    type: [String],
  })
  category: string[];

  @Prop({
    type: [{
      id: { type: String },
      name: { type: String },
      category: { type: String },
      level: { type: String },
    }],
  })
  requiredSkills: {
    id: string;
    name: string;
    category: string;
    level: string;
  }[];

  @Prop({
    type: {
      min: { type: Number },
      max: { type: Number },
    },
  })
  teamSize: {
    min: number;
    max: number;
  };

  @Prop({
    type: {
      weeks: { type: Number },
      startDate: { type: Date },
      endDate: { type: Date },
    },
  })
  duration: {
    weeks: number;
    startDate: Date;
    endDate: Date;
  };

  @Prop({
    type: String,
    enum: ['remote', 'hybrid', 'onsite'],
    default: 'hybrid',
  })
  workType: 'remote' | 'hybrid' | 'onsite';

  @Prop({
    type: [{
      type: Types.ObjectId,
      ref: 'ProjectTask',
    }],
  })
  tasks: Types.ObjectId[];

  @Prop({
    type: [{
      type: Types.ObjectId,
      ref: 'User',
    }],
  })
  assignedTo: Types.ObjectId[];

  @Prop({
    type: [{
      type: Types.ObjectId,
      ref: 'User',
    }],
  })
  mentors: Types.ObjectId[];

  @Prop({
    type: String,
    enum: ['planning', 'in_progress', 'completed', 'paused', 'cancelled'],
    default: 'planning',
  })
  status: ProjectStatus;

  @Prop({
    type: String,
    enum: ['initiation', 'planning', 'execution', 'monitoring', 'closure'],
    default: 'initiation',
  })
  phase: 'initiation' | 'planning' | 'execution' | 'monitoring' | 'closure';

  @Prop({
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  })
  progress: number;

  @Prop({
    type: Date,
  })
  startDate: Date;

  @Prop({
    type: Date,
  })
  completedDate: Date;

  @Prop({
    type: [{
      name: { type: String },
      description: { type: String },
      type: { type: String },
      format: { type: String },
      expectedBy: { type: Date },
      submittedBy: { type: Types.ObjectId },
      submittedAt: { type: Date },
      reviewStatus: { type: String, enum: ['pending', 'under_review', 'approved', 'rejected'] },
      feedback: { type: String },
    }],
  })
  deliverables: {
    name: string;
    description: string;
    type: string;
    format: string;
    expectedBy: Date;
    submittedBy?: Types.ObjectId;
    submittedAt?: Date;
    reviewStatus: 'pending' | 'under_review' | 'approved' | 'rejected';
    feedback?: string;
  }[];

  @Prop({
    type: [{
      name: { type: String },
      type: { type: String },
      url: { type: String },
      description: { type: String },
      accessLevel: { type: String, enum: ['public', 'team', 'restricted'] },
    }],
  })
  resources: {
    name: string;
    type: string;
    url: string;
    description: string;
    accessLevel: 'public' | 'team' | 'restricted';
  }[];
}

export const ProjectSchema = SchemaFactory.createForClass(Project);