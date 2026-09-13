import { Document, Types } from 'mongoose';
import { UserRole, UserStatus, Gender, EmploymentType } from '@interhive/shared';

export interface IUser extends Document {
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  department: Types.ObjectId;
  position: string;
  phone: string;
  address: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
  dateOfBirth: Date;
  gender: Gender;
  joiningDate: Date;
  employmentType: EmploymentType;
  manager: Types.ObjectId;
  profilePhoto: string;
  skills: string[];
  education: {
    degree: string;
    institution: string;
    year: number;
    grade?: string;
  }[];
  experience: {
    company: string;
    position: string;
    startDate: Date;
    endDate?: Date;
    current: boolean;
    description?: string;
  }[];
  emergencyContact: {
    name?: string;
    relationship?: string;
    phone?: string;
    email?: string;
  };
  bankDetails: {
    accountNumber?: string;
    bankName?: string;
    ifscCode?: string;
    accountHolder?: string;
  };
  documents: {
    name: string;
    type: string;
    url: string;
    uploadedAt: Date;
  }[];
  isActive: boolean;
  isVerified: boolean;
  lastLogin: Date;
  loginHistory: {
    timestamp: Date;
    ip: string;
    userAgent: string;
    location?: string;
  }[];
  resetPasswordToken: string;
  resetPasswordExpires: Date;
  preferences: {
    theme: 'light' | 'dark';
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
  };
  createdAt: Date;
  updatedAt: Date;

  // Methods
  comparePassword(password: string): Promise<boolean>;
}

export interface IUserProfile {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  position?: string;
  phone?: string;
  department?: string;
  manager?: string;
  profilePhoto?: string;
  skills: string[];
  isActive: boolean;
  isVerified: boolean;
}

export interface IUserStats {
  total: number;
  active: number;
  inactive: number;
  byRole: {
    _id: string;
    count: number;
  }[];
  byDepartment: {
    _id: string;
    count: number;
  }[];
  newUsersLast30Days: number;
}