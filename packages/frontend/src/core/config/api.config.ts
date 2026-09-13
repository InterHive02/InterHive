import axios from 'axios';
import { getAccessToken, refreshAccessToken } from '../../api/auth.api';

export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
};

export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    verifyEmail: '/auth/verify-email',
    resendVerification: '/auth/resend-verification',
    me: '/auth/me',
  },
  interns: {
    profile: '/interns/profile',
    profileById: (id: string) => `/interns/profile/${id}`,
    readiness: '/interns/readiness',
    applications: '/interns/applications',
    application: (id: string) => `/interns/applications/${id}`,
    opportunities: '/interns/opportunities',
    onboard: '/interns/onboard',
    uploadResume: '/interns/upload-resume',
    deleteResume: '/interns/resume',
    all: '/interns/all',
    stats: '/interns/stats/overview',
  },
  companies: {
    base: '/companies',
    byId: (id: string) => `/companies/${id}`,
    requirements: (id: string) => `/companies/${id}/requirements`,
    requirement: (id: string) => `/companies/requirements/${id}`,
    matches: (id: string) => `/companies/${id}/matches`,
    onboard: (id: string) => `/companies/${id}/onboard`,
    stats: '/companies/stats/overview',
  },
  assessments: {
    base: '/assessments',
    byId: (id: string) => `/assessments/${id}`,
    start: (id: string) => `/assessments/${id}/start`,
    submit: (id: string) => `/assessments/${id}/submit`,
    result: (id: string) => `/assessments/${id}/result`,
    myResults: '/assessments/my-results',
    evaluate: (id: string) => `/assessments/${id}/evaluate`,
    stats: '/assessments/stats/overview',
  },
  training: {
    base: '/training',
    byId: (id: string) => `/training/${id}`,
    available: '/training/available',
    enroll: (id: string) => `/training/${id}/enroll`,
    myEnrollments: '/training/my-enrollments',
    enrollment: (id: string) => `/training/enrollments/${id}`,
    progress: (id: string) => `/training/enrollments/${id}/progress`,
    complete: (id: string) => `/training/enrollments/${id}/complete`,
    withdraw: (id: string) => `/training/enrollments/${id}/withdraw`,
    allEnrollments: '/training/enrollments/all',
    stats: '/training/stats/overview',
  },
  projects: {
    base: '/projects',
    byId: (id: string) => `/projects/${id}`,
    my: '/projects/my',
    assign: (id: string) => `/projects/${id}/assign`,
    start: (id: string) => `/projects/${id}/start`,
    complete: (id: string) => `/projects/${id}/complete`,
    tasks: (id: string) => `/projects/${id}/tasks`,
    task: (id: string) => `/projects/tasks/${id}`,
    taskStatus: (id: string) => `/projects/tasks/${id}/status`,
    uploads: (id: string) => `/projects/${id}/uploads`,
    upload: (id: string) => `/projects/uploads/${id}`,
    stats: '/projects/stats/overview',
  },
  attendance: {
    checkIn: '/attendance/check-in',
    checkOut: '/attendance/check-out',
    lunchStart: '/attendance/lunch/start',
    lunchEnd: '/attendance/lunch/end',
    today: '/attendance/today',
    history: '/attendance/history',
    stats: '/attendance/stats',
    all: '/attendance/all',
    department: (id: string) => `/attendance/department/${id}`,
    user: (id: string) => `/attendance/user/${id}`,
    correct: (id: string) => `/attendance/${id}/correct`,
    overview: '/attendance/stats/overview',
  },
  matching: {
    find: '/matching/find-matches',
    myMatches: '/matching/my-matches',
    match: (id: string) => `/matching/${id}`,
    accept: (id: string) => `/matching/${id}/accept`,
    reject: (id: string) => `/matching/${id}/reject`,
    scheduleInterview: (id: string) => `/matching/${id}/schedule-interview`,
    offer: (id: string) => `/matching/${id}/offer`,
    hire: (id: string) => `/matching/${id}/hire`,
    stats: '/matching/stats/overview',
    batchMatch: '/matching/batch-match',
  },
  notifications: {
    base: '/notifications',
    byId: (id: string) => `/notifications/${id}`,
    read: (id: string) => `/notifications/${id}/read`,
    markAllRead: '/notifications/mark-all-read',
    unreadCount: '/notifications/unread-count',
    broadcast: '/notifications/broadcast',
    stats: '/notifications/stats/overview',
  },
  analytics: {
    dashboard: '/analytics/dashboard',
    readiness: '/analytics/readiness',
    internReadiness: (id: string) => `/analytics/readiness/${id}`,
    companies: '/analytics/companies',
    company: (id: string) => `/analytics/companies/${id}`,
    projects: '/analytics/projects',
    matching: '/analytics/matching',
    trends: '/analytics/trends',
    exportReadiness: '/analytics/export/readiness',
    exportCompanies: '/analytics/export/companies',
    refreshCache: '/analytics/cache/refresh',
  },
  communication: {
    chats: '/communication/chats',
    chat: (id: string) => `/communication/chats/${id}`,
    messages: (id: string) => `/communication/chats/${id}/messages`,
    message: (id: string) => `/communication/messages/${id}`,
    messageRead: (id: string) => `/communication/messages/${id}/read`,
    participants: (id: string) => `/communication/chats/${id}/participants`,
    unreadCount: '/communication/unread-count',
    chatUnread: (id: string) => `/communication/chats/${id}/unread`,
    stats: '/communication/stats/overview',
  },
  uploads: {
    resume: '/interns/upload-resume',
    avatar: '/users/upload-avatar',
    projectFiles: (id: string) => `/projects/${id}/uploads`,
  },
};

// Axios instance with interceptors
export const apiClient = axios.create(API_CONFIG);

// Request interceptor for auth token
apiClient.interceptors.request.use(
  async (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token refresh
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshSubscribers.push((token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(apiClient(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { accessToken } = await refreshAccessToken();
        setAccessToken(accessToken);
        isRefreshing = false;
        onRefreshed(accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        // Clear auth and redirect to login
        clearAuth();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
