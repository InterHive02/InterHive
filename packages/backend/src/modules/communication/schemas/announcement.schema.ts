import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AnnouncementDocument = Announcement & Document;

@Schema({ timestamps: true })
export class Announcement {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({
    type: String,
    enum: ['general', 'urgent', 'event', 'update'],
    default: 'general',
  })
  type: string;

  @Prop({
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  })
  priority: string;

  @Prop({ default: false })
  isPinned: boolean;

  @Prop({
    type: {
      firstName: String,
      lastName: String,
      profilePhoto: String,
    },
    default: { firstName: 'InterHive', lastName: 'Operations' },
  })
  createdBy: {
    firstName: string;
    lastName: string;
    profilePhoto?: string;
  };

  @Prop({ type: [String], default: [] })
  readBy: string[];

  @Prop({
    type: [
      {
        name: String,
        url: String,
      },
    ],
    default: [],
  })
  attachments: { name: string; url: string }[];

  @Prop()
  expiresAt?: Date;
}

export const AnnouncementSchema = SchemaFactory.createForClass(Announcement);
