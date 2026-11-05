import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { CampaignType, DiscountType } from '@interhive/shared';

export type DiscountCampaignDocument = DiscountCampaign & Document;

@Schema({ timestamps: true, collection: 'discount_campaigns' })
export class DiscountCampaign {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, default: '' })
  description: string;

  @Prop({ type: String, enum: ['EARLY_BIRD', 'LAUNCH', 'COLLEGE_PARTNER', 'GROUP', 'FESTIVAL', 'CUSTOM'], default: 'CUSTOM' })
  campaignType: CampaignType;

  @Prop({ type: String, enum: ['PERCENTAGE', 'FIXED'], default: 'PERCENTAGE' })
  discountType: DiscountType;

  @Prop({ type: Number, required: true })
  discountValue: number;

  @Prop({ type: Number, default: 0 })
  maxDiscount: number;

  @Prop({ type: Number, default: 0 })
  minOrderValue: number;

  @Prop({ type: [String], default: [] })
  eligiblePrograms: string[];

  @Prop({ type: Date, required: true })
  startDate: Date;

  @Prop({ type: Date, required: true })
  endDate: Date;

  @Prop({ type: Number, default: 0 })
  budgetCap: number;

  @Prop({ type: Number, default: 0 })
  currentSpend: number;

  @Prop({ type: Boolean, default: true, index: true })
  isActive: boolean;
}

export const DiscountCampaignSchema = SchemaFactory.createForClass(DiscountCampaign);
DiscountCampaignSchema.index({ isActive: 1, startDate: 1, endDate: 1 });
