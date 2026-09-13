import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema({ timestamps: true })
export class Message {
  @Prop({
    type: Types.ObjectId,
    ref: 'Chat',
    required: true,
  })
  chatId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  senderId: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
  })
  content: string;

  @Prop({
    type: String,
    enum: ['text', 'image', 'file', 'audio', 'video'],
    default: 'text',
  })
  type: 'text' | 'image' | 'file' | 'audio' | 'video';

  @Prop({
    type: [{
      name: { type: String },
      url: { type: String },
      type: { type: String },
      size: { type: Number },
    }],
  })
  attachments: {
    name: string;
    url: string;
    type: string;
    size: number;
  }[];

  @Prop({
    type: [Types.ObjectId],
    ref: 'User',
  })
  readBy: Types.ObjectId[];

  @Prop({
    type: Boolean,
    default: false,
  })
  isEdited: boolean;

  @Prop({
    type: Date,
  })
  editedAt: Date;

  @Prop({
    type: Boolean,
    default: false,
  })
  isDeleted: boolean;

  @Prop({
    type: Types.ObjectId,
    ref: 'Message',
  })
  replyTo: Types.ObjectId;
}

export const MessageSchema = SchemaFactory.createForClass(Message);