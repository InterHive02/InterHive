export interface Project {
  id: string;
  companyId: string;
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
  tasks: ProjectTask[];
  assignedTo: string[];
  mentors: string[];
  status: 'planning' | 'in_progress' | 'completed' | 'paused' | 'cancelled';
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
    submittedBy?: string;
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
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectTask {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  assignedTo: string[];
  status: 'to_do' | 'in_progress' | 'review' | 'completed' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'critical';
  storyPoints?: number;
  startDate?: Date;
  endDate?: Date;
  dependencies: string[];
  subtasks: {
    title: string;
    status: 'to_do' | 'in_progress' | 'completed';
    assignedTo?: string;
  }[];
  comments: {
    authorId: string;
    content: string;
    attachments?: {
      name: string;
      url: string;
      type: string;
    }[];
    createdAt: Date;
    updatedAt?: Date;
    replies?: {
      authorId: string;
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
    changedBy: string;
    changedAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}
