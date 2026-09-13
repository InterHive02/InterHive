import { apiClient } from '../client';

export interface AnalyticsQuery {
  page?: number;
  limit?: number;
  status?: string;
  type?: string;
  month?: number;
  year?: number;
  startDate?: string;
  endDate?: string;
  category?: string;
  department?: string;
}

export const analyticsApi = {
  getDashboard: (params: AnalyticsQuery) =>
    apiClient.get('/analytics/dashboard', { params }),

  getReadiness: (params: AnalyticsQuery) =>
    apiClient.get('/analytics/readiness', { params }),

  getInternReadiness: (internId: string) =>
    apiClient.get(`/analytics/readiness/${internId}`),

  getCompanies: (params: AnalyticsQuery) =>
    apiClient.get('/analytics/companies', { params }),

  getCompanyById: (companyId: string) =>
    apiClient.get(`/analytics/companies/${companyId}`),

  getProjects: (params: AnalyticsQuery) =>
    apiClient.get('/analytics/projects', { params }),

  getMatching: (params: AnalyticsQuery) =>
    apiClient.get('/analytics/matching', { params }),

  getTrends: (params: AnalyticsQuery) =>
    apiClient.get('/analytics/trends', { params }),

  exportReadiness: () =>
    apiClient.get('/analytics/export/readiness', { responseType: 'blob' }),

  exportCompanies: () =>
    apiClient.get('/analytics/export/companies', { responseType: 'blob' }),

  refreshCache: () =>
    apiClient.post('/analytics/cache/refresh'),

  getAdminDashboard: () =>
    apiClient.get<any>('/analytics/admin-dashboard'),

  getManagerDashboard: () =>
    apiClient.get<any>('/analytics/manager-dashboard'),

  getCompanyDashboard: () =>
    apiClient.get<any>('/analytics/company-dashboard'),

  updateActivityStatus: (id: string, status: string) =>
    apiClient.patch(`/analytics/activity/${id}`, { status }),

  runDiagnostics: () =>
    apiClient.post<any>('/analytics/diagnostics'),
};
