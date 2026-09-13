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

export const userApi = {
  getMyProfile: () => apiClient.get<{ success: boolean; data: any }>('/users/me/profile'),
  updateMyProfile: (data: UpdateUserProfileDto) => apiClient.put<{ success: boolean; data: any; message: string }>('/users/me/profile', data),
};
