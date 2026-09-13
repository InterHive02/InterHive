import { Document, Types } from 'mongoose';
import { ProjectStatus, TaskStatus } from '@interhive/shared';

export interface IProject extends Document {
  companyId: Types.ObjectId;
  title: string;
  description?: string;
  category: string[];
  requiredSkills: {
    id: string;
    name: string;
    category: string;
    level: string;
  }[];
  teamSize: {
    min: number;
    max: number;
  };
  duration: {
    weeks: number;
    startDate: Date;
    endDate: Date;
  };
  workType: 'remote' | 'hybrid' | 'onsite';
  tasks: Types.ObjectId[];
  assignedTo: Types.ObjectId[];
  mentors: Types.ObjectId[];
  status: ProjectStatus;
  phase: 'initiation' | 'planning' | 'execution' | 'monitoring' | 'closure';
  progress: number;
  startDate?: Date;
  completedDate?: Date;
  deliverables: {
    name: string;
    description: string;
    type: string;
    format: string;
    expectedBy: Date;
    submittedBy?: Types.ObjectId;
    submittedAt?: Date;
    reviewStatus: 'pending' | 'under_review' | 'approved' | 'rejected';
    feedback?: string;
  }[];
  resources: {
    name: string;
    type: string;
    url: string;
    description: string;
    accessLevel: 'public' | 'team' | 'restricted';
  }[];
}

export interface IProjectTask extends Document {
  projectId: Types.ObjectId;
  title: string;
  description?: string;
  assignedTo: Types.ObjectId[];
  status: TaskStatus;
  priority: 'low' | 'medium' | 'high' | 'critical';
  storyPoints?: number;
  startDate?: Date;
  endDate?: Date;
  dependencies: Types.ObjectId[];
  subtasks: {
    title: string;
    status: 'to_do' | 'in_progress' | 'completed';
    assignedTo?: Types.ObjectId;
  }[];
  comments: {
    authorId: Types.ObjectId;
    content: string;
    attachments?: {
      name: string;
      url: string;
      type: string;
    }[];
    createdAt: Date;
    updatedAt?: Date;
    replies?: {
      authorId: Types.ObjectId;
      content: string;
      createdAt: Date;
    }[];
  }[];
  attachments: {
    name: string;
    url: string;
    type: string;
    size: number;
  }[];
  history: {
    field: string;
    oldValue: any;
    newValue: any;
    changedBy: Types.ObjectId;
    changedAt: Date;
  }[];
}

export interface IProjectUpload extends Document {
  projectId: Types.ObjectId;
  taskId?: Types.ObjectId;
  uploadedBy: Types.ObjectId;
  fileName: string;
  fileSize: number;
  fileType: string;
  fileUrl: string;
  description?: string;
  uploadDate: Date;
  status: 'draft' | 'submitted' | 'reviewed' | 'approved' | 'rejected';
  feedback?: string;
  reviewedBy?: Types.ObjectId;
  reviewedAt?: Date;
}