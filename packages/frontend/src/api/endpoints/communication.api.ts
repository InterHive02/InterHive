import { apiClient } from '../client';

export const communicationApi = {
  getChats: (page = 1, limit = 50) =>
    apiClient.get('/communication/chats', { params: { page, limit } }),

  getMessages: (chatId: string, page = 1, limit = 50) =>
    apiClient.get(`/communication/chats/${chatId}/messages`, { params: { page, limit } }),

  sendMessage: (chatId: string, data: { content: string; type?: string; attachments?: any[] }) =>
    apiClient.post(`/communication/chats/${chatId}/messages`, data),

  getAnnouncements: () =>
    apiClient.get('/communication/announcements'),

  markAnnouncementAsRead: (id: string) =>
    apiClient.post(`/communication/announcements/${id}/read`),

  pinAnnouncement: (id: string, isPinned: boolean) =>
    apiClient.patch(`/communication/announcements/${id}/pin`, { isPinned }),

  createGroup: (data: { name: string; domain?: string; studentIds: string[] }) =>
    apiClient.post<{ success: boolean; message: string; data: any }>('/communication/groups', data),

  getStudents: (domain?: string) =>
    apiClient.get<{ success: boolean; data: any[] }>('/communication/students', { params: { domain } }),
};
