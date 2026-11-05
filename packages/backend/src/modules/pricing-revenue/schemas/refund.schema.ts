import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { RefundStatus } from '@interhive/shared';

export type RefundDocument = Refund & Document;

@Schema({ timestamps: true, collection: 'refunds' })
export class Refund {
  @Prop({ type: String, required: true, unique: true, index: true })
  refundNumber: string;

  @Prop({ type: Types.ObjectId, ref: 'Order', required: true, index: true })
  orderId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Payment', index: true })
  paymentId?: Types.ObjectId;

  @Prop({ type: String, required: true, index: true })
  studentId: string;

  @Prop({ type: Number, required: true })
  amount: number;

  @Prop({ type: String, default: 'INR' })
  currency: string;

  @Prop({ type: String, required: true })
  reason: string;

  @Prop({
    type: String,
    enum: ['PENDING', 'PROCESSED', 'REJECTED'],
    default: 'PENDING',
    index: true,
  })
  status: RefundStatus;

  @Prop({ type: String })
  razorpayRefundId?: string;

  @Prop({ type: String })
  processedBy?: string;

  @Prop({ type: Date })
  processedAt?: Date;

  @Prop({ type: String })
  rejectionReason?: string;
}

export const RefundSchema = SchemaFactory.createForClass(Refund);
RefundSchema.index({ status: 1, createdAt: -1 });
