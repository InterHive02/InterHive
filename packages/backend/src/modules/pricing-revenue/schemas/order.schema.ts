import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { OrderStatus, PaymentPlanType } from '@interhive/shared';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true, collection: 'orders' })
export class Order {
  @Prop({ type: String, required: true, unique: true, index: true })
  orderNumber: string;

  @Prop({ type: String, required: true, index: true })
  studentId: string;

  @Prop({ type: String, required: true })
  studentName: string;

  @Prop({ type: String, required: true, index: true })
  studentEmail: string;

  @Prop({ type: String })
  studentPhone?: string;

  @Prop({ type: String, required: true, index: true })
  programKey: string;

  @Prop({ type: String, required: true })
  programTitle: string;

  @Prop({ type: Number, default: 1 })
  pricingVersion: number;

  @Prop({ type: String, enum: ['FULL', 'ANNUAL', 'INSTALLMENT'], default: 'FULL' })
  paymentPlan: PaymentPlanType;

  @Prop({ type: Number, required: true })
  originalPrice: number;

  @Prop({ type: Number, default: 0 })
  automaticDiscount: number;

  @Prop({ type: String })
  campaignId?: string;

  @Prop({ type: Number, default: 0 })
  couponDiscount: number;

  @Prop({ type: String, uppercase: true })
  couponCode?: string;

  @Prop({ type: Number, default: 0 })
  referralDiscount: number;

  @Prop({ type: String })
  referralCode?: string;

  @Prop({ type: Number, default: 0 })
  taxAmount: number;

  @Prop({ type: Number, required: true })
  finalPayableAmount: number;

  @Prop({ type: String, default: 'INR' })
  currency: string;

  @Prop({
    type: String,
    enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED', 'PARTIALLY_REFUNDED', 'CANCELLED'],
    default: 'PENDING',
    index: true,
  })
  status: OrderStatus;

  @Prop({ type: String, index: true })
  razorpayOrderId?: string;

  @Prop({ type: String })
  notes?: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
OrderSchema.index({ studentId: 1, status: 1 });
OrderSchema.index({ programKey: 1, status: 1 });
OrderSchema.index({ createdAt: -1 });
