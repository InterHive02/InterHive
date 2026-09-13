import { Document, Types } from 'mongoose';
import { AttendanceStatus } from '@interhive/shared';

export interface IAttendance extends Document {
  userId: Types.ObjectId;
  date: Date;
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
  lunchBreak: {
    start: Date;
    end: Date;
    duration: number;
  };
  workingHours: {
    scheduled: number;
    actual: number;
    overtime: number;
    breakTime: number;
    totalHours: number;
  };
  status: AttendanceStatus;
  lateLogin: {
    isLate: boolean;
    minutes: number;
    reason?: string;
  };
  earlyLogout: {
    isEarly: boolean;
    minutes: number;
    reason?: string;
  };
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
  approval: {
    status: 'pending' | 'approved' | 'rejected';
    approvedBy?: Types.ObjectId;
    approvedAt?: Date;
    comments?: string;
  };
  notes: string;
  attachments: {
    name: string;
    url: string;
    type: string;
  }[];
}