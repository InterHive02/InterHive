import { apiClient } from '../client';

export interface InternProfile {
  personalInfo: {
    firstName: string;
    lastName: string;
    dateOfBirth?: string;
    gender?: string;
    nationality?: string;
    profilePhoto?: string;
  };
  contact: {
    email: string;
    phone?: string;
    alternatePhone?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      country?: string;
      zipCode?: string;
    };
  };
  academicInfo: {
    currentEducation: {
      institution: string;
      degree: string;
      field: string;
      startDate: string;
      endDate?: string;
      isCurrent: boolean;
      grade?: string;
    };
    cgpa?: number;
    graduationYear?: number;
  };
  professionalInfo: {
    experience?: any[];
    skills?: any[];
    certifications?: any[];
    resume?: string;
    portfolio?: string;
    github?: string;
    linkedin?: string;
  };
  preferences: {
    preferredDomains: string[];
    preferredLocation: string[];
    preferredWorkType: string[];
    expectedStipend: {
      min: number;
      max: number;
    };
    availability: {
      startDate: string;
      duration: number;
    };
  };
}

export interface InternApplication {
  programId: string;
  coverLetter?: string;
}

export const internApi = {
  // Profile
  createProfile: (data: InternProfile) =>
    apiClient.post('/interns/profile', data),

  getProfile: () =>
    apiClient.get<InternProfile>('/interns/profile'),

  updateProfile: (data: Partial<InternProfile>) =>
    apiClient.put('/interns/profile', data),

  // Readiness
  getReadiness: () =>
    apiClient.get<{
      overall: number;
      breakdown: Record<string, number>;
      history: any[];
      lastUpdated: string;
    }>('/interns/readiness'),

  // Applications
  apply: (data: InternApplication) =>
    apiClient.post('/interns/applications', data),

  getApplications: (status?: string) =>
    apiClient.get<InternApplication[]>('/interns/applications', { params: { status } }),

  getApplication: (applicationId: string) =>
    apiClient.get<InternApplication>(`/interns/applications/${applicationId}`),

  withdrawApplication: (applicationId: string) =>
    apiClient.post(`/interns/applications/${applicationId}/withdraw`),

  // Opportunities
  getOpportunities: (page: number = 1, limit: number = 10) =>
    apiClient.get<{ opportunities: any[]; meta: any }>('/interns/opportunities', {
      params: { page, limit },
    }),

  // Onboarding
  onboard: (programId: string) =>
    apiClient.post('/interns/onboard', { programId }),

  // Resume
  uploadResume: (file: File) =>
    apiClient.upload('/interns/upload-resume', file, 'resume'),

  deleteResume: () =>
    apiClient.delete('/interns/resume'),

  // Admin
  getAll: (params: { page: number; limit: number; status?: string; search?: string }) =>
    apiClient.get<{ data: any[]; meta: any }>('/interns/all', { params }),

  getById: (id: string) =>
    apiClient.get(`/interns/${id}`),

  updateStatus: (id: string, status: string) =>
    apiClient.post(`/interns/${id}/status`, { status }),

  recalculateReadiness: (id: string) =>
    apiClient.post(`/interns/${id}/readiness/recalculate`),

  getStats: () =>
    apiClient.get('/interns/stats/overview'),
};
