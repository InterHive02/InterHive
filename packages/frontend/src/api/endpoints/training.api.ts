import { apiClient } from '../client';

export interface TrainingProgram {
  title: string;
  description?: string;
  category?: string;
  tags: string[];
  duration: {
    min: number;
    max: number;
  };
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  modules: TrainingModule[];
  eligibility: {
    requiredSkills: {
      id: string;
      name: string;
      category: string;
    }[];
    minReadinessScore: number;
    startDate?: string;
    endDate?: string;
  };
}

export interface TrainingModule {
  title: string;
  description?: string;
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
}

export const trainingApi = {
  // Programs
  create: (data: TrainingProgram) =>
    apiClient.post('/training', data),

  getAll: (params: { page: number; limit: number; status?: string; category?: string; search?: string }) =>
    apiClient.get<{ data: TrainingProgram[]; meta: any }>('/training', { params }),

  getById: (id: string) =>
    apiClient.get<TrainingProgram>(`/training/${id}`),

  update: (id: string, data: Partial<TrainingProgram>) =>
    apiClient.put(`/training/${id}`, data),

  delete: (id: string) =>
    apiClient.delete(`/training/${id}`),

  publish: (id: string) =>
    apiClient.post(`/training/${id}/publish`),

  // Enrollment
  getAvailable: () =>
    apiClient.get<TrainingProgram[]>('/training/available'),

  enroll: (programId: string, data?: { source?: string; referralCode?: string }) =>
    apiClient.post(`/training/${programId}/enroll`, data || {}),

  getMyEnrollments: () =>
    apiClient.get('/training/my-enrollments'),

  getEnrollment: (enrollmentId: string) =>
    apiClient.get(`/training/enrollments/${enrollmentId}`),

  updateProgress: (enrollmentId: string, moduleId: string, progress: number) =>
    apiClient.post(`/training/enrollments/${enrollmentId}/progress`, { moduleId, progress }),

  completeEnrollment: (enrollmentId: string) =>
    apiClient.post(`/training/enrollments/${enrollmentId}/complete`),

  withdrawEnrollment: (enrollmentId: string) =>
    apiClient.post(`/training/enrollments/${enrollmentId}/withdraw`),

  // Admin
  getAllEnrollments: (params: { page: number; limit: number; status?: string; programId?: string }) =>
    apiClient.get('/training/enrollments/all', { params }),

  getStats: () =>
    apiClient.get('/training/stats/overview'),
};
