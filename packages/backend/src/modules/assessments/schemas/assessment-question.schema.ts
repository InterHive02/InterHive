import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, SchemaTypes } from 'mongoose';

export type AssessmentQuestionDocument = AssessmentQuestion & Document;

@Schema({ timestamps: true })
export class AssessmentQuestion {
  @Prop({
    type: Types.ObjectId,
    ref: 'SkillAssessment',
    required: true,
  })
  assessmentId: Types.ObjectId;

  @Prop({
    type: String,
    enum: ['multiple_choice', 'multiple_select', 'coding', 'essay', 'practical'],
    required: true,
  })
  type: 'multiple_choice' | 'multiple_select' | 'coding' | 'essay' | 'practical';

  @Prop({
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium',
  })
  difficulty: 'easy' | 'medium' | 'hard';

  @Prop({
    type: String,
  })
  category: string;

  @Prop({
    type: String,
    required: true,
  })
  text: string;

  @Prop({
    type: [{
      id: { type: String },
      text: { type: String },
      isCorrect: { type: Boolean },
    }],
  })
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];

  @Prop({
    type: SchemaTypes.Mixed,
  })
  correctAnswer: string | string[];

  @Prop({
    type: String,
  })
  explanation: string;

  @Prop({
    type: Number,
    required: true,
    default: 10,
  })
  points: number;

  @Prop({
    type: String,
  })
  codeSnippet: string;

  @Prop({
    type: String,
  })
  expectedOutput: string;

  @Prop({
    type: [String],
  })
  constraints: string[];
}

export const AssessmentQuestionSchema = SchemaFactory.createForClass(AssessmentQuestion);