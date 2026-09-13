import { apiClient } from '../client';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  read: boolean;
  readAt?: string;
  data?: {
    icon?: string;
    action?: string;
    metadata?: any;
  };
  createdAt: string;
}

export const notificationApi = {
  // User
  getAll: (params: { page: number; limit: number; read?: boolean; type?: string }) =>
    apiClient.get<{ data: Notification[]; meta: any }>('/notifications', { params }),

  getUnreadCount: () =>
    apiClient.get<{ count: number }>('/notifications/unread-count'),

  getById: (id: string) =>
    apiClient.get<Notification>(`/notifications/${id}`),

  markAsRead: (id: string) =>
    apiClient.put(`/notifications/${id}/read`),

  markAllAsRead: () =>
    apiClient.put('/notifications/mark-all-read'),

  delete: (id: string) =>
    apiClient.delete(`/notifications/${id}`),

  deleteAll: () =>
    apiClient.delete('/notifications/all'),

  // Admin
  broadcast: (data: { title: string; message: string; type: string; roles?: string[] }) =>
    apiClient.post('/notifications/broadcast', data),

  getStats: () =>
    apiClient.get('/notifications/stats/overview'),
};
