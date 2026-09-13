import {
  BaseEntity,
  ContactInfo,
  Education,
  Experience,
  Skill,
  UserRole,
  UserStatus,
  UUID,
  URLString,
} from './common.types';

export interface InternProfile extends BaseEntity {
  userId: UUID;
  personalInfo: {
    firstName: string;
    lastName: string;
    dateOfBirth?: Date;
    gender?: string;
    nationality?: string;
    profilePhoto?: string;
  };
  contact: ContactInfo;
  academicInfo: {
    currentEducation: Education;
    previousEducation?: Education[];
    cgpa?: number;
    graduationYear?: number;
  };
  professionalInfo: {
    experience: Experience[];
    skills: Skill[];
    certifications: Certification[];
    resume?: string;
    portfolio?: string;
    github?: string;
    linkedin?: string;
  };
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
      duration: number; // in months
    };
  };
  readinessScore: ReadinessScore;
  status: InternStatus;
  applications: InternApplication[];
  trainingEnrollments: TrainingEnrollment[];
  projects: ProjectParticipation[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ReadinessScore {
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
  history: ReadinessScoreHistory[];
}

export interface ReadinessScoreHistory {
  score: number;
  breakdown: ReadinessScore['breakdown'];
  date: Date;
  event: string;
}

export enum InternStatus {
  REGISTERED = 'registered',
  ASSESSED = 'assessed',
  TRAINING = 'training',
  PROJECT = 'project',
  READY = 'ready',
  PLACED = 'placed',
  COMPLETED = 'completed',
  DROPPED = 'dropped',
}

export interface InternApplication {
  id: UUID;
  programId: UUID;
  programName: string;
  status: ApplicationStatus;
  appliedAt: Date;
  assessmentScore?: number;
  interviewDate?: Date;
  offerDetails?: OfferDetails;
}

export enum ApplicationStatus {
  PENDING = 'pending',
  UNDER_REVIEW = 'under_review',
  ASSESSMENT = 'assessment',
  INTERVIEW = 'interview',
  OFFERED = 'offered',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  WITHDRAWN = 'withdrawn',
}

export interface OfferDetails {
  companyId: UUID;
  position: string;
  stipend: {
    amount: number;
    currency: string;
    period: 'monthly' | 'hourly' | 'stipend';
  };
  startDate: Date;
  duration: number;
  location: string;
  workType: 'remote' | 'hybrid' | 'onsite';
}

export interface Certification {
  id: UUID;
  name: string;
  issuer: string;
  issuedDate: Date;
  expiryDate?: Date;
  credentialId?: string;
  credentialUrl?: URLString;
  isVerified: boolean;
}

export interface TrainingEnrollment {
  programId: UUID;
  enrollmentDate: Date;
  progress: number; // 0-100
  completionStatus: 'not_started' | 'in_progress' | 'completed' | 'dropped';
  completionDate?: Date;
  modules: TrainingModuleProgress[];
}

export interface TrainingModuleProgress {
  moduleId: UUID;
  status: 'locked' | 'in_progress' | 'completed';
  progress: number; // 0-100
  score?: number;
  startedAt?: Date;
  completedAt?: Date;
}

export interface ProjectParticipation {
  projectId: UUID;
  role: string;
  startDate: Date;
  endDate?: Date;
  status: 'active' | 'completed' | 'dropped';
  contributions: ProjectContribution[];
  evaluation?: InternProjectEvaluation;
}

export interface ProjectContribution {
  id: UUID;
  taskId: UUID;
  description: string;
  status: 'pending' | 'in_progress' | 'review' | 'completed';
  submittedAt?: Date;
  feedback?: string;
}

export interface InternProjectEvaluation {
  technicalSkills: number;
  communication: number;
  teamwork: number;
  problemSolving: number;
  punctuality: number;
  overall: number;
  comments: string;
  evaluatorId: UUID;
  evaluationDate: Date;
}