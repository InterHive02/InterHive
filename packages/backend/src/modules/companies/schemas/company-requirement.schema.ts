import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { RequirementStatus } from '@interhive/shared';

export type CompanyRequirementDocument = CompanyRequirement & Document;

@Schema({ timestamps: true })
export class CompanyRequirement {
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
  position: string;

  @Prop({
    type: String,
  })
  department: string;

  @Prop({
    type: Number,
    required: true,
    min: 1,
  })
  count: number;

  @Prop({
    type: [{
      id: { type: String },
      name: { type: String },
      category: { type: String },
      level: { type: String },
    }],
  })
  skills: {
    id: string;
    name: string;
    category: string;
    level: string;
  }[];

  @Prop({
    type: {
      min: { type: Number, default: 0 },
      max: { type: Number },
    },
  })
  experience: {
    min: number;
    max?: number;
  };

  @Prop({
    type: {
      minDegree: { type: String },
      preferredFields: [{ type: String }],
    },
  })
  education: {
    minDegree: string;
    preferredFields: string[];
  };

  @Prop({
    type: [String],
  })
  responsibilities: string[];

  @Prop({
    type: [String],
  })
  benefits: string[];

  @Prop({
    type: {
      min: { type: Number },
      max: { type: Number },
      currency: { type: String, default: 'INR' },
      period: { type: String, enum: ['monthly', 'hourly', 'stipend'], default: 'monthly' },
    },
  })
  stipend: {
    min: number;
    max: number;
    currency: string;
    period: 'monthly' | 'hourly' | 'stipend';
  };

  @Prop({
    type: String,
    enum: ['remote', 'hybrid', 'onsite'],
    default: 'hybrid',
  })
  workType: 'remote' | 'hybrid' | 'onsite';

  @Prop({
    type: String,
  })
  location: string;

  @Prop({
    type: {
      min: { type: Number, default: 1 },
      max: { type: Number },
    },
  })
  duration: {
    min: number;
    max: number;
  };

  @Prop({
    type: Date,
    required: true,
  })
  startDate: Date;

  @Prop({
    type: Date,
  })
  applicationDeadline: Date;

  @Prop({
    type: String,
    enum: ['draft', 'published', 'closed', 'filled', 'cancelled'],
    default: 'draft',
  })
  status: RequirementStatus;
}

export const CompanyRequirementSchema = SchemaFactory.createForClass(CompanyRequirement);