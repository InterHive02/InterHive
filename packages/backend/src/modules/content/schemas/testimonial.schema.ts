import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TestimonialDocument = Testimonial & Document;

@Schema({ timestamps: true })
export class Testimonial {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  college: string;

  @Prop({ required: false, trim: true })
  branch?: string;

  @Prop({ required: true, trim: true })
  company: string;

  @Prop({ required: false, trim: true })
  role?: string;

  @Prop({ required: false, trim: true })
  package?: string;

  @Prop({ required: false, default: 5, min: 1, max: 5 })
  rating: number;

  @Prop({ required: true, trim: true })
  review: string;

  @Prop({ required: false, trim: true })
  avatar?: string;

  @Prop({ default: true })
  isPublished: boolean;

  @Prop({ default: 0 })
  order: number;
}

export const TestimonialSchema = SchemaFactory.createForClass(Testimonial);
