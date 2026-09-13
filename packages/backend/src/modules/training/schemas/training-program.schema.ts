import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TrainingProgramDocument = TrainingProgram & Document;

@Schema({ timestamps: true })
export class TrainingProgram {
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
  })
  category: string;

  @Prop({
    type: [String],
  })
  tags: string[];

  @Prop({
    type: {
      min: { type: Number },
      max: { type: Number },
    },
  })
  duration: {
    min: number;
    max: number;
  };

  @Prop({
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    default: 'intermediate',
  })
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';

  @Prop({
    type: [{
      id: { type: String },
      name: { type: String },
      category: { type: String },
    }],
  })
  industry: {
    id: string;
    name: string;
    category: string;
  }[];

  @Prop({
    type: {
      requiredSkills: [{
        id: { type: String },
        name: { type: String },
        category: { type: String },
      }],
      preferredSkills: [{
        id: { type: String },
        name: { type: String },
        category: { type: String },
      }],
      minReadinessScore: { type: Number, default: 40 },
      startDate: { type: Date },
      endDate: { type: Date },
    },
  })
  eligibility: {
    requiredSkills: {
      id: string;
      name: string;
      category: string;
    }[];
    preferredSkills: {
      id: string;
      name: string;
      category: string;
    }[];
    minReadinessScore: number;
    startDate?: Date;
    endDate?: Date;
  };

  @Prop({
    type: [{
      type: Types.ObjectId,
      ref: 'TrainingModule',
    }],
  })
  modules: Types.ObjectId[];

  @Prop({
    type: Number,
    default: 0,
  })
  totalModules: number;

  @Prop({
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft',
  })
  status: 'draft' | 'published' | 'archived';

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  createdBy: Types.ObjectId;

  @Prop({
    type: [{
      type: Types.ObjectId,
      ref: 'User',
    }],
  })
  mentors: Types.ObjectId[];

  @Prop({
    type: {
      type: String,
      default: 'free',
    },
  })
  pricing: {
    type: 'free' | 'paid';
  };
}

export const TrainingProgramSchema = SchemaFactory.createForClass(TrainingProgram);