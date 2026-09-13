import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, SchemaTypes } from 'mongoose';
import { AttendanceStatus } from '@interhive/shared';

export type AttendanceDocument = Attendance & Document;

@Schema({ timestamps: true })
export class Attendance {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  userId: Types.ObjectId;

  @Prop({
    type: Date,
    required: true,
    default: () => new Date().setHours(0, 0, 0, 0),
  })
  date: Date;

  @Prop({
    type: {
      time: { type: Date },
      location: {
        latitude: { type: Number },
        longitude: { type: Number },
        address: { type: String },
      },
      ip: { type: String },
      deviceInfo: { type: String },
      screenshot: { type: String },
      notes: { type: String },
    },
  })
  checkIn: {
    time: Date;
    location?: {
      latitude?: number;
      longitude?: number;
      address?: string;
    };
    ip?: string;
    deviceInfo?: string;
    screenshot?: string;
    notes?: string;
  };

  @Prop({
    type: {
      time: { type: Date },
      location: {
        latitude: { type: Number },
        longitude: { type: Number },
        address: { type: String },
      },
      ip: { type: String },
      deviceInfo: { type: String },
      screenshot: { type: String },
      notes: { type: String },
    },
  })
  checkOut: {
    time: Date;
    location?: {
      latitude?: number;
      longitude?: number;
      address?: string;
    };
    ip?: string;
    deviceInfo?: string;
    screenshot?: string;
    notes?: string;
  };

  @Prop({
    type: {
      start: { type: Date },
      end: { type: Date },
      duration: { type: Number },
    },
  })
  lunchBreak: {
    start: Date;
    end: Date;
    duration: number;
  };

  @Prop({
    type: {
      scheduled: { type: Number, default: 8 },
      actual: { type: Number, default: 0 },
      overtime: { type: Number, default: 0 },
      breakTime: { type: Number, default: 0 },
      totalHours: { type: Number, default: 0 },
    },
  })
  workingHours: {
    scheduled: number;
    actual: number;
    overtime: number;
    breakTime: number;
    totalHours: number;
  };

  @Prop({
    type: String,
    enum: ['present', 'absent', 'late', 'half_day', 'on_leave', 'holiday'],
    default: 'absent',
  })
  status: AttendanceStatus;

  @Prop({
    type: {
      isLate: { type: Boolean, default: false },
      minutes: { type: Number },
      reason: { type: String },
    },
  })
  lateLogin: {
    isLate: boolean;
    minutes: number;
    reason?: string;
  };

  @Prop({
    type: {
      isEarly: { type: Boolean, default: false },
      minutes: { type: Number },
      reason: { type: String },
    },
  })
  earlyLogout: {
    isEarly: boolean;
    minutes: number;
    reason?: string;
  };

  @Prop({
    type: {
      isCorrected: { type: Boolean, default: false },
      correctedBy: { type: Types.ObjectId, ref: 'User' },
      reason: { type: String },
      corrections: [{
        field: { type: String },
        oldValue: { type: SchemaTypes.Mixed },
        newValue: { type: SchemaTypes.Mixed },
        correctedAt: { type: Date },
      }],
      correctedAt: { type: Date },
    },
  })
  manualCorrection: {
    isCorrected: boolean;
    correctedBy?: Types.ObjectId;
    reason?: string;
    corrections?: {
      field: string;
      oldValue: any;
      newValue: any;
      correctedAt: Date;
    }[];
    correctedAt?: Date;
  };

  @Prop({
    type: {
      status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
      approvedBy: { type: Types.ObjectId, ref: 'User' },
      approvedAt: { type: Date },
      comments: { type: String },
    },
  })
  approval: {
    status: 'pending' | 'approved' | 'rejected';
    approvedBy?: Types.ObjectId;
    approvedAt?: Date;
    comments?: string;
  };

  @Prop({
    type: String,
  })
  notes: string;

  @Prop({
    type: [{
      name: { type: String },
      url: { type: String },
      type: { type: String },
    }],
  })
  attachments: {
    name: string;
    url: string;
    type: string;
  }[];
}

export const AttendanceSchema = SchemaFactory.createForClass(Attendance);