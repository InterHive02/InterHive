import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PricingAuditLogDocument = PricingAuditLog & Document;

@Schema({ timestamps: true, collection: 'pricing_audit_logs' })
export class PricingAuditLog {
  @Prop({ type: String, required: true, index: true })
  action: string; // 'CREATE_PRICING', 'UPDATE_PRICING', 'CREATE_COUPON', 'UPDATE_COUPON', 'CREATE_CAMPAIGN', 'APPROVE_REFUND'

  @Prop({ type: String, required: true, index: true })
  performedBy: string; // admin userId or email

  @Prop({ type: String, required: true })
  entityType: string; // 'PRICING', 'COUPON', 'CAMPAIGN', 'REFUND', 'ORDER'

  @Prop({ type: String, index: true })
  entityId?: string;

  @Prop({ type: Object })
  previousState?: any;

  @Prop({ type: Object })
  newState?: any;

  @Prop({ type: String })
  notes?: string;

  @Prop({ type: String })
  ipAddress?: string;
}

export const PricingAuditLogSchema = SchemaFactory.createForClass(PricingAuditLog);
PricingAuditLogSchema.index({ createdAt: -1 });
