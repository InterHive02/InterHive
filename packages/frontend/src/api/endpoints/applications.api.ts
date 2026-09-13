import { apiClient } from '../client';

export interface InternshipApplicationData {
  id?: string;
  _id?: string;
  fullName: string;
  email: string;
  phone: string;
  rollNumber: string;
  institution: string;
  degree: string;
  semester: string;
  skills: string[];
  areasOfInterest: string[];
  internshipPreference: 'remote' | 'hybrid' | 'onsite';
  previousExperience?: string;
  resumeUrl: string;
  linkedInUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  reasonForApplying: string;
  additionalInfo?: string;
  status:
    | 'new'
    | 'under_review'
    | 'shortlisted'
    | 'interview_scheduled'
    | 'interview_completed'
    | 'selected'
    | 'rejected';
  interview?: {
    date?: string;
    time?: string;
    mode?: 'online' | 'offline';
    linkOrLocation?: string;
    interviewer?: string;
    notes?: string;
    result?: 'pending' | 'passed' | 'failed';
  };
  notes?: {
    author: string;
    text: string;
    createdAt: string;
  }[];
  createdUserId?: any;
  accountCreated?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const applicationsApi = {
  submitApplication: (data: Partial<InternshipApplicationData>) =>
    apiClient.post<{ success: boolean; message: string; data: InternshipApplicationData }>(
      '/applications',
      data,
    ),

  getApplications: (params?: { page?: number; limit?: number; status?: string; search?: string }) =>
    apiClient.get<InternshipApplicationData[]>('/applications', { params }),

  getStats: () =>
    apiClient.get<{
      total: number;
      new: number;
      under_review: number;
      shortlisted: number;
      interview_scheduled: number;
      interview_completed: number;
      selected: number;
      rejected: number;
    }>('/applications/stats'),

  getApplicationById: (id: string) =>
    apiClient.get<InternshipApplicationData>(`/applications/${id}`),

  updateStatus: (id: string, status: string) =>
    apiClient.patch(`/applications/${id}/status`, { status }),

  scheduleInterview: (
    id: string,
    data: {
      date: string;
      time: string;
      mode?: 'online' | 'offline';
      linkOrLocation?: string;
      interviewer?: string;
      notes?: string;
    },
  ) => apiClient.post(`/applications/${id}/interview`, data),

  addNote: (id: string, text: string) =>
    apiClient.post(`/applications/${id}/notes`, { text }),

  getHrDashboard: () =>
    apiClient.get<{
      success: boolean;
      data: {
        stats: {
          activeInterns: number;
          liveProjects: number;
          upcomingInterviews: number;
          readyPlacement: number;
        };
        sprints: Array<{
          id: string;
          title: string;
          subtitle: string;
          daysLeft: number;
          progress: number;
          icon: 'rocket' | 'code';
          enrolledCount?: number;
        }>;
        interviews: Array<{
          id: string;
          candidateName: string;
          email?: string;
          phone?: string;
          institution?: string;
          degree?: string;
          skills?: string[];
          resumeUrl?: string;
          avatarText: string;
          companyName: string;
          roleTitle: string;
          interviewTime: string;
          interviewDate?: string;
          interviewMode?: string;
          linkOrLocation?: string;
          interviewer?: string;
          notes?: string;
          status: 'Scheduled' | 'Confirmed';
          isEmerald?: boolean;
          rawApplication?: any;
        }>;
        recentApplications: InternshipApplicationData[];
        recentLeads: any[];
      };
    }>('/applications/hr-dashboard'),

  createInternAccount: (id: string) =>
    apiClient.post<{
      success: boolean;
      message: string;
      data: {
        userId: string;
        employeeId: string;
        email: string;
        temporaryPassword: string;
        fullName: string;
      };
    }>(`/applications/${id}/create-account`),

  rejectApplication: (id: string, feedback?: string) =>
    apiClient.post<{
      success: boolean;
      message: string;
      data: InternshipApplicationData;
    }>(`/applications/${id}/reject`, { feedback }),
};
