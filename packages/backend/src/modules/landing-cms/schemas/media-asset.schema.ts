import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MediaAssetDocument = MediaAsset & Document;

@Schema({ timestamps: true })
export class MediaAsset {
  @Prop({ type: String, required: true })
  filename: string;

  @Prop({ type: String, required: true })
  originalName: string;

  @Prop({ type: String, required: true })
  url: string;

  @Prop({ type: String, required: true })
  mimeType: string;

  @Prop({ type: Number, required: true })
  size: number;

  @Prop({ type: String, default: '' })
  altText: string;

  @Prop({ type: String })
  uploadedBy?: string;
}

export const MediaAssetSchema = SchemaFactory.createForClass(MediaAsset);
MediaAssetSchema.index({ createdAt: -1 });
