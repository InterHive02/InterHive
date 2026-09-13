import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { InternStatus, Skill, Education, Experience } from '@interhive/shared';

export type InternProfileDocument = InternProfile & Document;

@Schema({ timestamps: true })
export class InternProfile {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  })
  userId: Types.ObjectId;

  @Prop({
    type: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      dateOfBirth: { type: Date },
      gender: { type: String },
      nationality: { type: String },
      profilePhoto: { type: String },
    },
  })
  personalInfo: {
    firstName: string;
    lastName: string;
    dateOfBirth?: Date;
    gender?: string;
    nationality?: string;
    profilePhoto?: string;
  };

  @Prop({
    type: {
      email: { type: String, required: true },
      phone: { type: String },
      alternatePhone: { type: String },
      address: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        country: { type: String },
        zipCode: { type: String },
      },
      socialMedia: {
        linkedin: { type: String },
        github: { type: String },
        twitter: { type: String },
        portfolio: { type: String },
      },
    },
  })
  contact: {
    email: string;
    phone?: string;
    alternatePhone?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      country?: string;
      zipCode?: string;
    };
    socialMedia?: {
      linkedin?: string;
      github?: string;
      twitter?: string;
      portfolio?: string;
    };
  };

  @Prop({
    type: {
      currentEducation: {
        institution: { type: String },
        degree: { type: String },
        field: { type: String },
        startDate: { type: Date },
        endDate: { type: Date },
        isCurrent: { type: Boolean },
        grade: { type: String },
      },
      previousEducation: [{
        institution: { type: String },
        degree: { type: String },
        field: { type: String },
        startDate: { type: Date },
        endDate: { type: Date },
        grade: { type: String },
      }],
      cgpa: { type: Number },
      graduationYear: { type: Number },
    },
  })
  academicInfo: {
    currentEducation: {
      institution: string;
      degree: string;
      field: string;
      startDate: Date;
      endDate?: Date;
      isCurrent: boolean;
      grade?: string;
    };
    previousEducation?: {
      institution: string;
      degree: string;
      field: string;
      startDate: Date;
      endDate: Date;
      grade?: string;
    }[];
    cgpa?: number;
    graduationYear?: number;
  };

  @Prop({
    type: {
      experience: [{
        company: { type: String },
        position: { type: String },
        startDate: { type: Date },
        endDate: { type: Date },
        current: { type: Boolean },
        description: { type: String },
        skills: [{ type: String }],
        achievements: [{ type: String }],
      }],
      skills: [{
        id: { type: String },
        name: { type: String },
        category: { type: String },
        level: { type: String },
        yearsOfExperience: { type: Number },
        isVerified: { type: Boolean },
      }],
      certifications: [{
        id: { type: String },
        name: { type: String },
        issuer: { type: String },
        issuedDate: { type: Date },
        expiryDate: { type: Date },
        credentialId: { type: String },
        credentialUrl: { type: String },
        isVerified: { type: Boolean },
      }],
      resume: { type: String },
      portfolio: { type: String },
      github: { type: String },
      linkedin: { type: String },
    },
  })
  professionalInfo: {
    experience: {
      company: string;
      position: string;
      startDate: Date;
      endDate?: Date;
      current: boolean;
      description?: string;
      skills?: string[];
      achievements?: string[];
    }[];
    skills: {
      id: string;
      name: string;
      category: string;
      level: string;
      yearsOfExperience?: number;
      isVerified?: boolean;
    }[];
    certifications?: {
      id: string;
      name: string;
      issuer: string;
      issuedDate: Date;
      expiryDate?: Date;
      credentialId?: string;
      credentialUrl?: string;
      isVerified?: boolean;
    }[];
    resume?: string;
    portfolio?: string;
    github?: string;
    linkedin?: string;
  };

  @Prop({
    type: {
      preferredDomains: [{ type: String }],
      preferredLocation: [{ type: String }],
      preferredWorkType: [{ type: String }],
      expectedStipend: {
        min: { type: Number },
        max: { type: Number },
      },
      availability: {
        startDate: { type: Date },
        duration: { type: Number },
      },
    },
  })
  preferences: {
    preferredDomains: string[];
    preferredLocation: string[];
    preferredWorkType: ('remote' | 'hybrid' | 'onsite')[];
    expectedStipend: {
      min: number;
      max: number;
    };
    availability: {
      startDate: Date;
      duration: number;
    };
  };

  @Prop({
    type: String,
    enum: ['registered', 'assessed', 'training', 'project', 'ready', 'placed', 'completed', 'dropped'],
    default: 'registered',
  })
  status: InternStatus;
}

export const InternProfileSchema = SchemaFactory.createForClass(InternProfile);