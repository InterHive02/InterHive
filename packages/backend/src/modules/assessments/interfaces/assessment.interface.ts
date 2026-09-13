import { Document, Types } from 'mongoose';
import { AssessmentType } from '@interhive/shared';

export interface ISkillAssessment extends Document {
  title: string;
  description?: string;
  type: AssessmentType;
  category: string[];
  skillsAssessed: {
    id: string;
    name: string;
    category: string;
    level: string;
  }[];
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  duration: number;
  totalScore: number;
  passingScore: number;
  questions: Types.ObjectId[];
  status: 'draft' | 'published' | 'active' | 'archived';
  createdBy: Types.ObjectId;
  maxAttempts: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAssessmentQuestion extends Document {
  assessmentId: Types.ObjectId;
  type: 'multiple_choice' | 'multiple_select' | 'coding' | 'essay' | 'practical';
  difficulty: 'easy' | 'medium' | 'hard';
  category?: string;
  text: string;
  options?: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
  correctAnswer?: string | string[];
  explanation?: string;
  points: number;
  codeSnippet?: string;
  expectedOutput?: string;
  constraints?: string[];
}

export interface IAssessmentResult extends Document {
  userId: Types.ObjectId;
  assessmentId: Types.ObjectId;
  startedAt: Date;
  completedAt?: Date;
  timeSpent: number;
  answers: {
    questionId: Types.ObjectId;
    answer: any;
    isCorrect?: boolean;
    score?: number;
  }[];
  score: number;
  percentage: number;
  grade?: 'A' | 'B' | 'C' | 'D' | 'F';
  passed: boolean;
  status: 'in_progress' | 'submitted' | 'completed' | 'evaluated' | 'expired';
  feedback?: {
    overall: string;
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    detailedFeedback: {
      questionId: Types.ObjectId;
      feedback: string;
      suggestions: string[];
    }[];
  };
}