import { BaseEntity, ContactInfo, Address, UserRole, Skill, UUID, URLString } from './common.types';

export interface Company extends BaseEntity {
  userId: UUID;
  companyInfo: {
    name: string;
    legalName: string;
    registrationNumber: string;
    industry: string[];
    size: number;
    foundedYear: number;
    website: URLString;
    description: string;
    logo: string;
    coverImage?: string;
  };
  contact: {
    primaryContact: ContactInfo;
    hrContact: ContactInfo;
    technicalContact?: ContactInfo;
    address: Address;
  };
  requirements: CompanyRequirement[];
  hiring: HiringProcess[];
  collaborations: CompanyCollaboration[];
  ratings: CompanyRating[];
  status: CompanyStatus;
  subscription: CompanySubscription;
  createdAt: Date;
  updatedAt: Date;
}

export interface CompanyRequirement {
  id: UUID;
  position: string;
  department: string;
  count: number;
  skills: Skill[];
  experience: {
    min: number;
    max: number;
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
  location: string;
  duration: {
    min: number;
    max: number;
  };
  startDate: Date;
  applicationDeadline: Date;
  status: RequirementStatus;
}

export enum RequirementStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  CLOSED = 'closed',
  FILLED = 'filled',
  CANCELLED = 'cancelled',
}

export interface HiringProcess {
  id: UUID;
  requirementId: UUID;
  stage: 'screening' | 'assessment' | 'interview' | 'offer' | 'hired';
  candidates: UUID[];
  selected?: UUID[];
  timeline: {
    startedAt: Date;
    screeningDeadline?: Date;
    assessmentDeadline?: Date;
    interviewDeadline?: Date;
    offerDeadline?: Date;
  };
  status: 'active' | 'completed' | 'cancelled';
}

export interface CompanyCollaboration {
  id: UUID;
  type: 'training' | 'project' | 'hiring' | 'research';
  programId: UUID;
  status: 'pending' | 'active' | 'completed' | 'terminated';
  startDate: Date;
  endDate?: Date;
  terms: string;
  metrics: {
    internsHired: number;
    projectsCompleted: number;
    satisfactionScore: number;
  };
}

export interface CompanyRating {
  id: UUID;
  internId: UUID;
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
}

export enum CompanyStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  INACTIVE = 'inactive',
}

export interface CompanySubscription {
  plan: 'basic' | 'premium' | 'enterprise' | 'custom';
  tier: number;
  startDate: Date;
  endDate: Date;
  features: string[];
  price: number;
  currency: string;
  status: 'active' | 'expired' | 'cancelled';
  autoRenew: boolean;
}