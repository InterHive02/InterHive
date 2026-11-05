import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { DiscountType } from '@interhive/shared';

export type CouponDocument = Coupon & Document;

@Schema({ timestamps: true, collection: 'coupons' })
export class Coupon {
  @Prop({ type: String, required: true, unique: true, uppercase: true, trim: true, index: true })
  code: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, default: '' })
  description: string;

  @Prop({ type: String, enum: ['PERCENTAGE', 'FIXED'], default: 'PERCENTAGE' })
  discountType: DiscountType;

  @Prop({ type: Number, required: true })
  discountValue: number;

  @Prop({ type: Number, default: 0 })
  maxDiscountAmount: number;

  @Prop({ type: Number, default: 0 })
  minOrderValue: number;

  @Prop({ type: [String], default: [] })
  applicablePrograms: string[];

  @Prop({ type: Date, required: true })
  startDate: Date;

  @Prop({ type: Date, required: true, index: true })
  expiryDate: Date;

  @Prop({ type: Number, default: 100 })
  totalUsageLimit: number;

  @Prop({ type: Number, default: 0 })
  usedCount: number;

  @Prop({ type: Number, default: 1 })
  perUserLimit: number;

  @Prop({ type: Boolean, default: false })
  firstTimeOnly: boolean;

  @Prop({ type: Boolean, default: false })
  allowStacking: boolean;

  @Prop({ type: Boolean, default: true, index: true })
  isActive: boolean;

  @Prop({ type: Boolean, default: false })
  isPaused: boolean;
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);
CouponSchema.index({ code: 1, isActive: 1, expiryDate: 1 });
