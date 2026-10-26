import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LandingPageRevisionDocument = LandingPageRevision & Document;

@Schema({ timestamps: true, strict: false })
export class LandingPageRevision {
  @Prop({ type: Number, required: true })
  version: number;

  @Prop({ type: String })
  notes?: string;

  @Prop({ type: String, required: true })
  publishedBy: string;

  @Prop({ type: Date, default: Date.now })
  publishedAt: Date;

  @Prop({ type: Object, required: true })
  config: any;
}

export const LandingPageRevisionSchema = SchemaFactory.createForClass(LandingPageRevision);
LandingPageRevisionSchema.index({ version: -1, createdAt: -1 });
