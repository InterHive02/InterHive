import { apiClient } from '../client';

export interface UpdateUserProfileDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  position?: string;
  department?: string;
  dateOfBirth?: Date | string;
  gender?: string;
  profilePhoto?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  } | string;
  skills?: string[];
  bio?: string;
  emergencyContact?: {
    name?: string;
    relationship?: string;
    phone?: string;
    email?: string;
  };
}

export interface UserQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  department?: string;
  isActive?: boolean;
}

export const userApi = {
  getMyProfile: () => apiClient.get<{ success: boolean; data: any }>('/users/me/profile'),
  updateMyProfile: (data: UpdateUserProfileDto) => apiClient.put<{ success: boolean; data: any; message: string }>('/users/me/profile', data),

  // Admin operations
  getAll: (params?: UserQueryParams) =>
    apiClient.get<{ data: any[]; meta?: any }>('/users', { params }),

  getById: (id: string) =>
    apiClient.get<any>(`/users/${id}`),

  create: (data: {
    email: string;
    firstName: string;
    lastName: string;
    role?: string;
    phone?: string;
    department?: string;
    password?: string;
  }) => apiClient.post('/users', data),

  update: (id: string, data: any) =>
    apiClient.put(`/users/${id}`, data),

  delete: (id: string) =>
    apiClient.delete(`/users/${id}`),

  activate: (id: string) =>
    apiClient.post(`/users/${id}/activate`),

  deactivate: (id: string) =>
    apiClient.post(`/users/${id}/deactivate`),

  updateRole: (id: string, role: string) =>
    apiClient.post(`/users/${id}/role`, { role }),

  getStats: () =>
    apiClient.get('/users/stats/overview'),
};

