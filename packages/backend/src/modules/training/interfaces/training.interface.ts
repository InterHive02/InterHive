import { Document, Types } from 'mongoose';

export interface ITrainingProgram extends Document {
  title: string;
  description?: string;
  category?: string;
  tags: string[];
  duration: {
    min: number;
    max: number;
  };
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  industry: {
    id: string;
    name: string;
    category: string;
  }[];
  eligibility: {
    requiredSkills: {
      id: string;
      name: string;
      category: string;
    }[];
    preferredSkills: {
      id: string;
      name: string;
      category: string;
    }[];
    minReadinessScore: number;
    startDate?: Date;
    endDate?: Date;
  };
  modules: Types.ObjectId[];
  totalModules: number;
  status: 'draft' | 'published' | 'archived';
  createdBy: Types.ObjectId;
  mentors: Types.ObjectId[];
  pricing: {
    type: 'free' | 'paid';
  };
}

export interface ITrainingModule extends Document {
  programId: Types.ObjectId;
  title: string;
  description?: string;
  order: number;
  type: 'video' | 'article' | 'quiz' | 'assignment' | 'project' | 'lab';
  duration: number;
  content: {
    videoUrl?: string;
    content?: string;
    resources?: {
      title: string;
      url: string;
      type: string;
    }[];
  };
  quiz?: {
    type: string;
    question: string;
    options: string[];
    correctAnswer: string;
    explanation?: string;
  }[];
  assignment?: {
    description: string;
    instructions: string[];
    submissionType: string;
    maxScore: number;
  };
  isRequired: boolean;
  prerequisites: Types.ObjectId[];
}

export interface ITrainingEnrollment extends Document {
  userId: Types.ObjectId;
  programId: Types.ObjectId;
  enrollmentDate: Date;
  completionDate?: Date;
  status: 'active' | 'completed' | 'withdrawn' | 'dropped';
  progress: number;
  currentModuleIndex: number;
  moduleProgress: {
    moduleId: Types.ObjectId;
    status: 'locked' | 'in_progress' | 'completed';
    progress: number;
    score?: number;
    startedAt?: Date;
    completedAt?: Date;
  }[];
  certification: {
    issued: boolean;
    issuedDate?: Date;
    certificateId?: string;
    verificationUrl?: string;
  };
  activityLog: {
    date: Date;
    type: string;
    message: string;
  }[];
}