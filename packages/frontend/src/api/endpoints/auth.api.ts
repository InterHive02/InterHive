import { apiClient } from '../client';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role?: string;
  employeeId?: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  newPassword: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    employeeId: string;
    isActive: boolean;
    isVerified: boolean;
    profilePhoto?: string;
  };
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

export const authApi = {
  login: (data: LoginData) =>
    apiClient.post<AuthResponse>('/auth/login', data),

  register: (data: RegisterData) =>
    apiClient.post<{ user: any }>('/auth/register', data),

  logout: () =>
    apiClient.post('/auth/logout'),

  refreshToken: (refreshToken: string) =>
    apiClient.post<{ accessToken: string; refreshToken?: string }>('/auth/refresh', { refreshToken }),

  forgotPassword: (data: ForgotPasswordData) =>
    apiClient.post('/auth/forgot-password', data),

  resetPassword: (data: ResetPasswordData) =>
    apiClient.post('/auth/reset-password', data),

  verifyEmail: (token: string) =>
    apiClient.post('/auth/verify-email', { token }),

  resendVerification: () =>
    apiClient.post('/auth/resend-verification'),

  getProfile: () =>
    apiClient.get<{ user: any }>('/auth/me'),

  getLoginActivity: () =>
    apiClient.get<{ loginHistory: any[] }>('/auth/login-activity'),

  validateToken: () =>
    apiClient.get<{ user: any }>('/auth/validate-token'),

  sendOtp: (email: string) =>
    apiClient.post<{ success: boolean; message: string }>('/auth/send-otp', { email }),

  verifyOtp: (email: string, code: string) =>
    apiClient.post<AuthResponse>('/auth/verify-otp', { email, code }),

  googleLogin: (data: { email: string; name?: string; googleId?: string; picture?: string }) =>
    apiClient.post<AuthResponse>('/auth/google', data),
};
