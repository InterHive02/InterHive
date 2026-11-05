import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { PaymentPlanConfig, PricingHistoryEntry } from '@interhive/shared';

export type ProgramPricingDocument = ProgramPricing & Document;

@Schema({ timestamps: true, collection: 'program_pricing' })
export class ProgramPricing {
  @Prop({ type: String, required: true, unique: true, index: true })
  programKey: string;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  duration: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: Number, required: true })
  originalPrice: number;

  @Prop({ type: Number, required: true })
  promotionalPrice: number;

  @Prop({ type: String, default: 'INR' })
  currency: string;

  @Prop({ type: Boolean, default: true, index: true })
  isActive: boolean;

  @Prop({ type: Date })
  enrollmentStartDate?: Date;

  @Prop({ type: Date })
  enrollmentEndDate?: Date;

  @Prop({ type: Number, default: 18 })
  taxPercentage: number;

  @Prop({ type: Boolean, default: false })
  taxIncluded: boolean;

  @Prop({ type: [String], default: [] })
  features: string[];

  @Prop({ type: String, default: '' })
  eligibilityBatch: string;

  @Prop({ type: [Object], default: [] })
  paymentPlans: PaymentPlanConfig[];

  @Prop({ type: Number, default: 1 })
  pricingVersion: number;

  @Prop({ type: [Object], default: [] })
  history: PricingHistoryEntry[];
}

export const ProgramPricingSchema = SchemaFactory.createForClass(ProgramPricing);
ProgramPricingSchema.index({ programKey: 1, isActive: 1 });
