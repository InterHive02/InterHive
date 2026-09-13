import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TrainingModuleDocument = TrainingModule & Document;

@Schema({ timestamps: true })
export class TrainingModule {
  @Prop({
    type: Types.ObjectId,
    ref: 'TrainingProgram',
    required: true,
  })
  programId: Types.ObjectId;

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
    type: Number,
    required: true,
  })
  order: number;

  @Prop({
    type: String,
    enum: ['video', 'article', 'quiz', 'assignment', 'project', 'lab'],
    default: 'video',
  })
  type: 'video' | 'article' | 'quiz' | 'assignment' | 'project' | 'lab';

  @Prop({
    type: Number,
    default: 0,
  })
  duration: number;

  @Prop({
    type: {
      videoUrl: { type: String },
      content: { type: String },
      resources: [{
        title: { type: String },
        url: { type: String },
        type: { type: String },
      }],
    },
  })
  content: {
    videoUrl?: string;
    content?: string;
    resources?: {
      title: string;
      url: string;
      type: string;
    }[];
  };

  @Prop({
    type: [{
      type: {
        type: { type: String },
        question: { type: String },
        options: [{ type: String }],
        correctAnswer: { type: String },
        explanation: { type: String },
      },
    }],
  })
  quiz: {
    type: string;
    question: string;
    options: string[];
    correctAnswer: string;
    explanation?: string;
  }[];

  @Prop({
    type: {
      description: { type: String },
      instructions: [{ type: String }],
      submissionType: { type: String },
      maxScore: { type: Number, default: 100 },
    },
  })
  assignment: {
    description: string;
    instructions: string[];
    submissionType: string;
    maxScore: number;
  };

  @Prop({
    type: Boolean,
    default: false,
  })
  isRequired: boolean;

  @Prop({
    type: [Types.ObjectId],
  })
  prerequisites: Types.ObjectId[];
}

export const TrainingModuleSchema = SchemaFactory.createForClass(TrainingModule);