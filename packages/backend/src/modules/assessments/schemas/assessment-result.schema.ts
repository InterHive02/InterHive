import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, SchemaTypes } from 'mongoose';

export type AssessmentResultDocument = AssessmentResult & Document;

@Schema({ timestamps: true })
export class AssessmentResult {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  userId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'SkillAssessment',
    required: true,
  })
  assessmentId: Types.ObjectId;

  @Prop({
    type: Date,
    required: true,
    default: Date.now,
  })
  startedAt: Date;

  @Prop({
    type: Date,
  })
  completedAt: Date;

  @Prop({
    type: Number,
    default: 0,
  })
  timeSpent: number;

  @Prop({
    type: [{
      questionId: { type: Types.ObjectId, ref: 'AssessmentQuestion' },
      answer: { type: SchemaTypes.Mixed },
      isCorrect: { type: Boolean },
      score: { type: Number },
    }],
  })
  answers: {
    questionId: Types.ObjectId;
    answer: any;
    isCorrect?: boolean;
    score?: number;
  }[];

  @Prop({
    type: Number,
    default: 0,
  })
  score: number;

  @Prop({
    type: Number,
    default: 0,
  })
  percentage: number;

  @Prop({
    type: String,
    enum: ['A', 'B', 'C', 'D', 'F'],
  })
  grade: 'A' | 'B' | 'C' | 'D' | 'F';

  @Prop({
    type: Boolean,
    default: false,
  })
  passed: boolean;

  @Prop({
    type: String,
    enum: ['in_progress', 'submitted', 'completed', 'evaluated', 'expired'],
    default: 'in_progress',
  })
  status: 'in_progress' | 'submitted' | 'completed' | 'evaluated' | 'expired';

  @Prop({
    type: {
      overall: { type: String },
      strengths: [{ type: String }],
      weaknesses: [{ type: String }],
      recommendations: [{ type: String }],
      detailedFeedback: [{
        questionId: { type: Types.ObjectId },
        feedback: { type: String },
        suggestions: [{ type: String }],
      }],
    },
  })
  feedback: {
    overall: string;
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    detailedFeedback: {
      questionId: Types.ObjectId;
      feedback: string;
      suggestions: string[];
    }[];
  };
}

export const AssessmentResultSchema = SchemaFactory.createForClass(AssessmentResult);