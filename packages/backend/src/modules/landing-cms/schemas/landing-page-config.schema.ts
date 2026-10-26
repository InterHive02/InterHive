import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LandingPageConfigDocument = LandingPageConfig & Document;

@Schema({ timestamps: true, strict: false })
export class LandingPageConfig {
  @Prop({ type: Number, default: 1 })
  version: number;

  @Prop({ type: Boolean, default: false })
  isPublished: boolean;

  @Prop({ type: String, default: 'draft' }) // 'draft' | 'published'
  type: string;

  @Prop({ type: Date })
  publishedAt?: Date;

  @Prop({ type: String })
  publishedBy?: string;

  @Prop({ type: String })
  lastEditedBy?: string;

  @Prop({ type: Object, required: true })
  data: any;
}

export const LandingPageConfigSchema = SchemaFactory.createForClass(LandingPageConfig);
LandingPageConfigSchema.index({ type: 1, isPublished: 1 });
