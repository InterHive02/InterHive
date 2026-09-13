import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, SchemaTypes } from 'mongoose';
import { TaskStatus } from '@interhive/shared';

export type ProjectTaskDocument = ProjectTask & Document;

@Schema({ timestamps: true })
export class ProjectTask {
  @Prop({
    type: Types.ObjectId,
    ref: 'Project',
    required: true,
  })
  projectId: Types.ObjectId;

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
    type: [Types.ObjectId],
    ref: 'User',
  })
  assignedTo: Types.ObjectId[];

  @Prop({
    type: String,
    enum: ['to_do', 'in_progress', 'review', 'completed', 'blocked'],
    default: 'to_do',
  })
  status: TaskStatus;

  @Prop({
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium',
  })
  priority: 'low' | 'medium' | 'high' | 'critical';

  @Prop({
    type: Number,
  })
  storyPoints: number;

  @Prop({
    type: Date,
  })
  startDate: Date;

  @Prop({
    type: Date,
  })
  endDate: Date;

  @Prop({
    type: [Types.ObjectId],
  })
  dependencies: Types.ObjectId[];

  @Prop({
    type: [{
      title: { type: String },
      status: { type: String, enum: ['to_do', 'in_progress', 'completed'] },
      assignedTo: { type: Types.ObjectId },
    }],
  })
  subtasks: {
    title: string;
    status: 'to_do' | 'in_progress' | 'completed';
    assignedTo?: Types.ObjectId;
  }[];

  @Prop({
    type: [{
      authorId: { type: Types.ObjectId, ref: 'User' },
      content: { type: String },
      attachments: [{
        name: { type: String },
        url: { type: String },
        type: { type: String },
      }],
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date },
      replies: [
        {
          authorId: { type: Types.ObjectId, ref: 'User' },
          content: { type: String },
          createdAt: { type: Date, default: Date.now },
        },
      ],
    }],
  })
  comments: {
    authorId: Types.ObjectId;
    content: string;
    attachments?: {
      name: string;
      url: string;
      type: string;
    }[];
    createdAt: Date;
    updatedAt?: Date;
    replies?: {
      authorId: Types.ObjectId;
      content: string;
      createdAt: Date;
    }[];
  }[];

  @Prop({
    type: [{
      name: { type: String },
      url: { type: String },
      type: { type: String },
      size: { type: Number },
    }],
  })
  attachments: {
    name: string;
    url: string;
    type: string;
    size: number;
  }[];

  @Prop({ type: Date })
  completedAt?: Date;

  @Prop({
    type: [{
      field: { type: String },
      oldValue: { type: SchemaTypes.Mixed },
      newValue: { type: SchemaTypes.Mixed },
      changedBy: { type: Types.ObjectId, ref: 'User' },
      changedAt: { type: Date, default: Date.now },
    }],
  })
  history: {
    field: string;
    oldValue: any;
    newValue: any;
    changedBy: Types.ObjectId;
    changedAt: Date;
  }[];
}

export const ProjectTaskSchema = SchemaFactory.createForClass(ProjectTask);