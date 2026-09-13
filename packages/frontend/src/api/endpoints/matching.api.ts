import { apiClient } from '../client';

export interface MatchRequest {
  internId?: string;
  companyId?: string;
  requirementId?: string;
  minScore?: number;
  limit?: number;
  location?: string;
}

export interface Match {
  id: string;
  internId: string;
  companyId: string;
  requirementId: string;
  matchScore: number;
  breakdown: {
    skillMatch: number;
    readinessMatch: number;
    experienceMatch: number;
    preferenceMatch: number;
  };
  status: 'pending' | 'accepted' | 'rejected' | 'interview_scheduled' | 'interview_completed' | 'offer_made' | 'offer_accepted' | 'offer_rejected' | 'hired' | 'expired';
  interview?: {
    scheduledDate: string;
    type: string;
    meetingLink: string;
    status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  };
  offer?: {
    amount: number;
    currency: string;
    period: string;
    startDate: string;
    duration: number;
    position: string;
    benefits: string[];
    status: 'pending' | 'accepted' | 'rejected' | 'expired';
  };
}

export const matchingApi = {
  findMatches: (data: MatchRequest) =>
    apiClient.post<Match[]>('/matching/find-matches', data),

  getMyMatches: (status?: string, page: number = 1, limit: number = 10) =>
    apiClient.get<{ data: Match[]; meta: any }>('/matching/my-matches', { params: { status, page, limit } }),

  getMatch: (id: string) =>
    apiClient.get<Match>(`/matching/${id}`),

  acceptMatch: (id: string) =>
    apiClient.post(`/matching/${id}/accept`),

  rejectMatch: (id: string) =>
    apiClient.post(`/matching/${id}/reject`),

  scheduleInterview: (id: string, data: { interviewDate: string; interviewType: string; meetingLink?: string }) =>
    apiClient.post(`/matching/${id}/schedule-interview`, data),

  makeOffer: (id: string, data: { amount: number; currency: string; period: string; startDate: string; duration: number; position: string; benefits: string[] }) =>
    apiClient.post(`/matching/${id}/offer`, data),

  hireIntern: (id: string) =>
    apiClient.post(`/matching/${id}/hire`),

  getStats: () =>
    apiClient.get('/matching/stats/overview'),

  batchMatch: (requirementId: string, internIds: string[]) =>
    apiClient.post('/matching/batch-match', { requirementId, internIds }),
};
