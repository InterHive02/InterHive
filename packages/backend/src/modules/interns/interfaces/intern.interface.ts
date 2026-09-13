import { Document, Types } from 'mongoose';
import { InternStatus, Skill } from '@interhive/shared';

export interface IInternProfile extends Document {
  userId: Types.ObjectId;
  personalInfo: {
    firstName: string;
    lastName: string;
    dateOfBirth?: Date;
    gender?: string;
    nationality?: string;
    profilePhoto?: string;
  };
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
  };
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
  professionalInfo: {
    experience: {
      company: string;
      position: string;
      startDate: Date;
      endDate?: Date;
      current: boolean;
      description?: string;
      skills?: string[];
    }[];
    skills: Skill[];
    certifications?: {
      id: string;
      name: string;
      issuer: string;
      issuedDate: Date;
      expiryDate?: Date;
      credentialId?: string;
      credentialUrl?: string;
      isVerified: boolean;
    }[];
    resume?: string;
    portfolio?: string;
    github?: string;
    linkedin?: string;
  };
  preferences: {
    preferredDomains: string[];
    preferredLocation: string[];
    preferredWorkType: string[];
    expectedStipend: {
      min: number;
      max: number;
    };
    availability: {
      startDate: Date;
      duration: number;
    };
  };
  status: InternStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface IInternApplication extends Document {
  userId: Types.ObjectId;
  programId: Types.ObjectId;
  coverLetter?: string;
  status: string;
  assessmentScore?: number;
  interviewDate?: Date;
  offerDetails?: {
    companyId: Types.ObjectId;
    position: string;
    stipend: {
      amount: number;
      currency: string;
      period: string;
    };
    startDate: Date;
    duration: number;
    location: string;
    workType: string;
  };
  comments: {
    user: Types.ObjectId;
    text: string;
    createdAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IInternReadiness extends Document {
  userId: Types.ObjectId;
  overall: number;
  breakdown: {
    technicalSkills: number;
    projects: number;
    communication: number;
    problemSolving: number;
    industryWorkflow: number;
    teamCollaboration: number;
    leadership: number;
    adaptability: number;
  };
  lastUpdated: Date;
  history: {
    score: number;
    breakdown: {
      technicalSkills: number;
      projects: number;
      communication: number;
      problemSolving: number;
      industryWorkflow: number;
      teamCollaboration: number;
      leadership: number;
      adaptability: number;
    };
    date: Date;
    event: string;
  }[];
}