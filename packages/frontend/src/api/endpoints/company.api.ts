import { apiClient } from '../client';

export interface CompanyProfile {
  companyInfo: {
    name: string;
    legalName: string;
    registrationNumber: string;
    industry: string[];
    size?: number;
    foundedYear?: number;
    website?: string;
    description?: string;
    logo?: string;
  };
  contact: {
    primaryContact: {
      email: string;
      phone?: string;
      address?: {
        street?: string;
        city?: string;
        state?: string;
        country?: string;
        zipCode?: string;
      };
    };
    hrContact?: {
      email?: string;
      phone?: string;
    };
    technicalContact?: {
      email?: string;
      phone?: string;
    };
  };
}

export interface CompanyRequirement {
  position: string;
  department?: string;
  count: number;
  skills: {
    id: string;
    name: string;
    category: string;
    level: string;
  }[];
  experience: {
    min: number;
    max?: number;
  };
  education: {
    minDegree: string;
    preferredFields: string[];
  };
  responsibilities: string[];
  benefits: string[];
  stipend: {
    min: number;
    max: number;
    currency: string;
    period: 'monthly' | 'hourly' | 'stipend';
  };
  workType: 'remote' | 'hybrid' | 'onsite';
  location?: string;
  duration: {
    min: number;
    max: number;
  };
  startDate: string;
  applicationDeadline?: string;
}

export const companyApi = {
  // Profile
  create: (data: CompanyProfile) =>
    apiClient.post('/companies', data),

  getAll: (params: { page: number; limit: number; search?: string; industry?: string; status?: string }) =>
    apiClient.get<{ data: CompanyProfile[]; meta: any }>('/companies', { params }),

  getById: (id: string) =>
    apiClient.get<CompanyProfile>(`/companies/${id}`),

  update: (id: string, data: Partial<CompanyProfile>) =>
    apiClient.put(`/companies/${id}`, data),

  delete: (id: string) =>
    apiClient.delete(`/companies/${id}`),

  // Requirements
  createRequirement: (companyId: string, data: CompanyRequirement) =>
    apiClient.post(`/companies/${companyId}/requirements`, data),

  getRequirements: (companyId: string, status?: string) =>
    apiClient.get<CompanyRequirement[]>(`/companies/${companyId}/requirements`, { params: { status } }),

  updateRequirement: (requirementId: string, data: Partial<CompanyRequirement>) =>
    apiClient.put(`/companies/requirements/${requirementId}`, data),

  deleteRequirement: (requirementId: string) =>
    apiClient.delete(`/companies/requirements/${requirementId}`),

  // Matching
  getMatches: (companyId: string, requirementId?: string, limit?: number) =>
    apiClient.get(`/companies/${companyId}/matches`, { params: { requirementId, limit } }),

  // Onboarding
  onboard: (companyId: string) =>
    apiClient.post(`/companies/${companyId}/onboard`),

  // Stats
  getStats: () =>
    apiClient.get('/companies/stats/overview'),

  // Company Inquiry
  submitInquiry: (data: {
    companyName: string;
    contactPerson: string;
    email: string;
    phone: string;
    techStack?: string;
    internCount?: string;
    message?: string;
  }) => apiClient.post('/companies/inquiry', data),
};
