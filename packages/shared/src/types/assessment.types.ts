import { BaseEntity, Skill, SkillLevel, AssessmentType, UUID } from './common.types';
import { InternProfile } from './intern.types';

export interface Assessment extends BaseEntity {
  title: string;
  description: string;
  type: AssessmentType;
  category: string[];
  skillsAssessed: Skill[];
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  duration: number; // in minutes
  totalScore: number;
  passingScore: number;
  questions: AssessmentQuestion[];
  status: 'draft' | 'published' | 'active' | 'archived';
  createdBy: UUID;
  createdAt: Date;
  updatedAt: Date;
}

export interface AssessmentQuestion {
  id: UUID;
  type: 'multiple_choice' | 'multiple_select' | 'coding' | 'essay' | 'practical';
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  text: string;
  options?: AssessmentOption[];
  correctAnswer?: string | string[];
  explanation?: string;
  points: number;
  codeSnippet?: string;
  expectedOutput?: string;
  constraints?: string[];
}

export interface AssessmentOption {
  id: UUID;
  text: string;
  isCorrect: boolean;
}

export interface AssessmentSubmission {
  id: UUID;
  assessmentId: UUID;
  internId: UUID;
  startedAt: Date;
  completedAt?: Date;
  timeSpent: number; // in seconds
  answers: AssessmentAnswer[];
  score: number;
  percentage: number;
  status: 'in_progress' | 'submitted' | 'evaluated' | 'expired';
  feedback?: AssessmentFeedback;
}

export interface AssessmentAnswer {
  questionId: UUID;
  answer: string | string[] | any;
  isCorrect?: boolean;
  score?: number;
  feedback?: string;
  codeSubmission?: {
    language: string;
    code: string;
    output?: string;
    testResults?: TestResult[];
  };
}

export interface TestResult {
  testCase: string;
  passed: boolean;
  expected: string;
  actual: string;
  message?: string;
}

export interface AssessmentFeedback {
  overall: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  detailedFeedback: {
    questionId: UUID;
    feedback: string;
    suggestions: string[];
  }[];
}

export interface AssessmentResult {
  id: UUID;
  assessmentId: UUID;
  internId: UUID;
  score: number;
  percentage: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  status: 'pass' | 'fail';
  feedback: AssessmentFeedback;
  skillsAssessment: {
    skillId: UUID;
    level: SkillLevel;
    confidence: number;
    questionsCorrect: number;
    totalQuestions: number;
  }[];
  recommendations: {
    skillId: UUID;
    currentLevel: SkillLevel;
    recommendedLevel: SkillLevel;
    learningResources: string[];
  }[];
  createdAt: Date;
  updatedAt: Date;
}