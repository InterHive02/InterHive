import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PartnerDocument = Partner & Document;

@Schema({ timestamps: true })
export class Partner {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: false, trim: true })
  logo?: string;

  @Prop({ required: false, trim: true })
  website?: string;

  @Prop({ required: false, trim: true, default: 'Placement Partner' })
  partnershipTier: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  order: number;
}

export const PartnerSchema = SchemaFactory.createForClass(Partner);
