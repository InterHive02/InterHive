import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, SchemaTypes } from 'mongoose';
import { NotificationCategory, NotificationPriority } from '@interhive/shared';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  userId: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
  })
  title: string;

  @Prop({
    type: String,
    required: true,
  })
  message: string;

  @Prop({
    type: String,
    enum: [
      'system',
      'assessment',
      'training',
      'project',
      'matching',
      'interview',
      'hiring',
      'message',
      'reminder',
    ],
    required: true,
  })
  type: NotificationCategory;

  @Prop({
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  })
  priority: NotificationPriority;

  @Prop({
    type: Boolean,
    default: false,
  })
  read: boolean;

  @Prop({
    type: Date,
  })
  readAt: Date;

  @Prop({
    type: {
      icon: { type: String },
      action: { type: String },
      metadata: { type: SchemaTypes.Mixed },
    },
  })
  data: {
    icon?: string;
    action?: string;
    metadata?: any;
  };

  @Prop({
    type: [{
      type: Types.ObjectId,
      ref: 'User',
    }],
  })
  recipients: Types.ObjectId[];

  @Prop({
    type: {
      email: { type: Boolean, default: false },
      push: { type: Boolean, default: false },
      sms: { type: Boolean, default: false },
    },
  })
  delivery: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };

  @Prop({
    type: Date,
  })
  expiresAt: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);