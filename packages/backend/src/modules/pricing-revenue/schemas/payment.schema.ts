import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { PaymentStatus } from '@interhive/shared';

export type PaymentDocument = Payment & Document;

@Schema({ timestamps: true, collection: 'payments' })
export class Payment {
  @Prop({ type: Types.ObjectId, ref: 'Order', required: true, index: true })
  orderId: Types.ObjectId;

  @Prop({ type: String, required: true, index: true })
  studentId: string;

  @Prop({ type: Number, required: true })
  amount: number;

  @Prop({ type: String, default: 'INR' })
  currency: string;

  @Prop({ type: String, default: 'RAZORPAY' })
  gateway: string;

  @Prop({ type: String, required: true, unique: true, index: true })
  razorpayPaymentId: string;

  @Prop({ type: String, required: true, index: true })
  razorpayOrderId: string;

  @Prop({ type: String })
  razorpaySignature?: string;

  @Prop({
    type: String,
    enum: ['SUCCESS', 'FAILED', 'PENDING', 'REFUNDED'],
    default: 'PENDING',
    index: true,
  })
  status: PaymentStatus;

  @Prop({ type: String })
  method?: string;

  @Prop({ type: Date })
  verifiedAt?: Date;

  @Prop({ type: Object })
  rawWebhookData?: any;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
PaymentSchema.index({ studentId: 1, status: 1 });
PaymentSchema.index({ createdAt: -1 });
