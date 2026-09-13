import { User } from '../../users/schemas/user.schema';

export interface AuthResponse {
  user: Omit<User, 'password'>;
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface RefreshTokenResponse {
  success: boolean;
  data: {
    accessToken: string;
    expiresIn: string;
  };
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: Omit<User, 'password'>;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: Omit<User, 'password'>;
    accessToken: string;
    expiresIn: string;
  };
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

export interface EmailVerificationResponse {
  success: boolean;
  message: string;
}