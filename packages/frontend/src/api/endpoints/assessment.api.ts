import { apiClient } from '../client';

export interface Assessment {
  title: string;
  description?: string;
  type: string;
  category: string[];
  skillsAssessed: {
    id: string;
    name: string;
    category: string;
    level: string;
  }[];
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  duration: number;
  passingScore: number;
  questions: AssessmentQuestion[];
}

export interface AssessmentQuestion {
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
}

export interface AssessmentSubmission {
  resultId: string;
  answers: {
    questionId: string;
    answer: any;
    codeSubmission?: {
      language: string;
      code: string;
    };
  }[];
}

export const assessmentApi = {
  // Admin
  create: (data: Assessment) =>
    apiClient.post('/assessments', data),

  getAll: (params: { page: number; limit: number; type?: string; category?: string; status?: string }) =>
    apiClient.get<{ data: Assessment[]; meta: any }>('/assessments', { params }),

  getById: (id: string) =>
    apiClient.get<Assessment>(`/assessments/${id}`),

  update: (id: string, data: Partial<Assessment>) =>
    apiClient.put(`/assessments/${id}`, data),

  delete: (id: string) =>
    apiClient.delete(`/assessments/${id}`),

  publish: (id: string) =>
    apiClient.post(`/assessments/${id}/publish`),

  // Taking
  start: (id: string) =>
    apiClient.post<{ resultId: string; assessment: Assessment; timeLimit: number }>(`/assessments/${id}/start`),

  submit: (id: string, data: AssessmentSubmission) =>
    apiClient.post<{ result: any; score: number; percentage: number; passed: boolean }>(
      `/assessments/${id}/submit`,
      data
    ),

  getResult: (id: string) =>
    apiClient.get(`/assessments/${id}/result`),

  getMyResults: () =>
    apiClient.get('/assessments/my-results'),

  // Admin evaluation
  evaluate: (assessmentId: string, resultId: string, feedback: any) =>
    apiClient.post(`/assessments/${assessmentId}/evaluate`, { resultId, feedback }),

  getUserResults: (userId: string) =>
    apiClient.get(`/assessments/results/${userId}`),

  getStats: () =>
    apiClient.get('/assessments/stats/overview'),
};
