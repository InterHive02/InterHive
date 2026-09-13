import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ChatDocument = Chat & Document;

@Schema({ timestamps: true })
export class Chat {
  @Prop({
    type: [Types.ObjectId],
    ref: 'User',
    required: true,
  })
  participants: Types.ObjectId[];

  @Prop({
    type: String,
  })
  name: string;

  @Prop({
    type: Boolean,
    default: false,
  })
  isGroupChat: boolean;

  @Prop({
    type: String,
  })
  avatar: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  createdBy: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Message',
  })
  lastMessage: Types.ObjectId;

  @Prop({
    type: Boolean,
    default: true,
  })
  isActive: boolean;

  @Prop({
    type: {
      pinned: { type: Boolean, default: false },
      muted: { type: Boolean, default: false },
      notifications: { type: Boolean, default: true },
    },
  })
  settings: {
    pinned: boolean;
    muted: boolean;
    notifications: boolean;
  };
}

export const ChatSchema = SchemaFactory.createForClass(Chat);