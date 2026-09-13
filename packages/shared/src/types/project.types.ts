import { BaseEntity, Skill, UUID, FileUpload as ProjectAttachment } from './common.types';
import { InternProfile } from './intern.types';

export interface Project extends BaseEntity {
  id: UUID;
  companyId: UUID;
  title: string;
  description: string;
  category: string[];
  requiredSkills: Skill[];
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
  tasks: ProjectTask[];
  deliverables: ProjectDeliverable[];
  resources: ProjectResource[];
  mentors: UUID[];
  status: ProjectStatus;
  phase: ProjectPhase;
  progress: number; // 0-100
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectTask {
  id: UUID;
  title: string;
  description: string;
  assignedTo?: UUID[];
  status: TaskStatus;
  priority: 'low' | 'medium' | 'high' | 'critical';
  storyPoints: number;
  startDate: Date;
  endDate: Date;
  dependencies: UUID[];
  subtasks: ProjectSubtask[];
  comments: TaskComment[];
  attachments: ProjectAttachment[];
}

export enum TaskStatus {
  TO_DO = 'to_do',
  IN_PROGRESS = 'in_progress',
  REVIEW = 'review',
  COMPLETED = 'completed',
  BLOCKED = 'blocked',
}

export interface ProjectSubtask {
  id: UUID;
  title: string;
  status: TaskStatus;
  assignedTo?: UUID;
}

export interface TaskComment {
  id: UUID;
  authorId: UUID;
  content: string;
  attachments?: ProjectAttachment[];
  createdAt: Date;
  updatedAt: Date;
  replies?: TaskComment[];
}

export interface ProjectDeliverable {
  id: UUID;
  name: string;
  description: string;
  type: 'document' | 'code' | 'design' | 'presentation' | 'other';
  format: string;
  expectedBy: Date;
  submittedBy?: UUID;
  submittedAt?: Date;
  reviewStatus: 'pending' | 'under_review' | 'approved' | 'rejected';
  feedback?: string;
}

export interface ProjectResource {
  id: UUID;
  name: string;
  type: 'documentation' | 'tool' | 'api' | 'dataset' | 'template';
  url: string;
  description: string;
  accessLevel: 'public' | 'team' | 'restricted';
}

export enum ProjectStatus {
  PLANNING = 'planning',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  PAUSED = 'paused',
  CANCELLED = 'cancelled',
}

export enum ProjectPhase {
  INITIATION = 'initiation',
  PLANNING = 'planning',
  EXECUTION = 'execution',
  MONITORING = 'monitoring',
  CLOSURE = 'closure',
}

export interface ProjectEvaluation {
  projectId: UUID;
  evaluatorId: UUID;
  quality: number; // 0-10
  innovation: number;
  teamwork: number;
  documentation: number;
  presentation: number;
  overall: number;
  strengths: string[];
  improvements: string[];
  feedback: string;
  evaluatedAt: Date;
}