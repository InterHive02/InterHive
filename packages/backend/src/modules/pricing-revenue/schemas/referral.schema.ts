import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ReferralDocument = Referral & Document;

@Schema({ timestamps: true, collection: 'referrals' })
export class Referral {
  @Prop({ type: String, required: true, unique: true, index: true })
  studentId: string;

  @Prop({ type: String, required: true, unique: true, uppercase: true, index: true })
  referralCode: string;

  @Prop({ type: Number, default: 0 })
  walletBalance: number;

  @Prop({ type: Number, default: 0 })
  totalEarned: number;

  @Prop({ type: Number, default: 0 })
  referralsCount: number;

  @Prop({ type: Number, default: 300 })
  rewardPerReferral: number;

  @Prop({ type: Number, default: 500 })
  studentDiscountAmount: number;

  @Prop({ type: [Object], default: [] })
  history: Array<{
    id: string;
    referredStudentId: string;
    referredStudentName: string;
    rewardAmount: number;
    orderId: string;
    date: Date;
    status: 'CREDITED' | 'PENDING';
  }>;
}

export const ReferralSchema = SchemaFactory.createForClass(Referral);
ReferralSchema.index({ referralCode: 1 });
