import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { AssessmentType } from '@interhive/shared';

export type SkillAssessmentDocument = SkillAssessment & Document;

@Schema({ timestamps: true })
export class SkillAssessment {
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
    type: String,
    enum: ['technical', 'soft_skills', 'aptitude', 'behavioral', 'coding', 'project'],
    required: true,
  })
  type: AssessmentType;

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
  skillsAssessed: {
    id: string;
    name: string;
    category: string;
    level: string;
  }[];

  @Prop({
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    default: 'intermediate',
  })
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';

  @Prop({
    type: Number,
    required: true,
  })
  duration: number;

  @Prop({
    type: Number,
    required: true,
    default: 0,
  })
  totalScore: number;

  @Prop({
    type: Number,
    required: true,
    default: 70,
  })
  passingScore: number;

  @Prop({
    type: [{
      type: Types.ObjectId,
      ref: 'AssessmentQuestion',
    }],
  })
  questions: Types.ObjectId[];

  @Prop({
    type: String,
    enum: ['draft', 'published', 'active', 'archived'],
    default: 'draft',
  })
  status: 'draft' | 'published' | 'active' | 'archived';

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  createdBy: Types.ObjectId;

  @Prop({
    type: Number,
    default: 1,
  })
  maxAttempts: number;
}

export const SkillAssessmentSchema = SchemaFactory.createForClass(SkillAssessment);