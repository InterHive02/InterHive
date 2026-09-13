import { Document, Types } from 'mongoose';
import { CompanyStatus, RequirementStatus } from '@interhive/shared';

export interface ICompany extends Document {
  companyInfo: {
    name: string;
    legalName: string;
    registrationNumber: string;
    industry: string[];
    size?: number;
    foundedYear?: number;
    website?: string;
    description?: string;
    logo?: string;
    coverImage?: string;
  };
  contact: {
    primaryContact: {
      email: string;
      phone?: string;
      address?: {
        street?: string;
        city?: string;
        state?: string;
        country?: string;
        zipCode?: string;
      };
    };
    hrContact?: {
      email?: string;
      phone?: string;
    };
    technicalContact?: {
      email?: string;
      phone?: string;
    };
  };
  status: CompanyStatus;
  subscription: {
    plan: 'basic' | 'premium' | 'enterprise' | 'custom';
    tier: number;
    startDate?: Date;
    endDate?: Date;
    features: string[];
    price: number;
    currency: string;
    status: 'active' | 'expired' | 'cancelled';
    autoRenew: boolean;
  };
  ratings: {
    userId: string;
    score: number;
    feedback: string;
    categories: {
      communication: number;
      technicalSkills: number;
      professionalism: number;
      punctuality: number;
      initiative: number;
    };
    createdAt: Date;
  }[];
}

export interface ICompanyRequirement extends Document {
  companyId: Types.ObjectId;
  position: string;
  department?: string;
  count: number;
  skills: {
    id: string;
    name: string;
    category: string;
    level: string;
  }[];
  experience: {
    min: number;
    max?: number;
  };
  education: {
    minDegree: string;
    preferredFields: string[];
  };
  responsibilities: string[];
  benefits: string[];
  stipend: {
    min: number;
    max: number;
    currency: string;
    period: 'monthly' | 'hourly' | 'stipend';
  };
  workType: 'remote' | 'hybrid' | 'onsite';
  location?: string;
  duration: {
    min: number;
    max: number;
  };
  startDate: Date;
  applicationDeadline?: Date;
  status: RequirementStatus;
}