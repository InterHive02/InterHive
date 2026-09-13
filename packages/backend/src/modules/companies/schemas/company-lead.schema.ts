import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CompanyLeadDocument = CompanyLead & Document;

export type LeadStatus = 'new' | 'contacted' | 'follow_up' | 'discussion' | 'converted' | 'closed';

@Schema({ timestamps: true })
export class CompanyLead {
  @Prop({ required: true, trim: true })
  companyName: string;

  @Prop({ required: true, trim: true })
  contactPerson: string;

  @Prop({ required: true, lowercase: true, trim: true })
  email: string;

  @Prop({ trim: true, default: '' })
  phone: string;

  @Prop({ trim: true })
  website?: string;

  @Prop({ trim: true, default: 'Technology' })
  industry?: string;

  @Prop({ trim: true, default: 'Engineering Interns' })
  hiringRequirement: string;

  @Prop({ default: '1-5' })
  internCount: string;

  @Prop({ trim: true })
  message?: string;

  @Prop({ trim: true })
  additionalInfo?: string;

  @Prop({
    type: String,
    enum: ['new', 'contacted', 'follow_up', 'discussion', 'converted', 'closed'],
    default: 'new',
  })
  status: LeadStatus;

  @Prop({
    type: [
      {
        author: { type: String, required: true },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    default: [],
  })
  notes: {
    author: string;
    text: string;
    createdAt: Date;
  }[];

  @Prop({ trim: true })
  assignedTo?: string;

  @Prop()
  lastContactedAt?: Date;
}

export const CompanyLeadSchema = SchemaFactory.createForClass(CompanyLead);
