import { useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi, LoginData, RegisterData, ForgotPasswordData, ResetPasswordData } from '../endpoints/auth.api';
import { toast } from 'react-hot-toast';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('accessToken');

  const clearAllSessionData = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('hasAppliedPpo') || key.startsWith('ih_')) {
          localStorage.removeItem(key);
        }
      });
      sessionStorage.clear();
    }
    queryClient.clear();
  }, [queryClient]);

  const getRoleDashboard = (userData: any) => {
    if (!userData) return '/dashboard';
    switch (userData.role) {
      case 'admin':
        return '/admin/dashboard';
      case 'hr':
        return '/hr/dashboard';
      case 'manager':
        return '/manager/dashboard';
      case 'company':
        return '/company/dashboard';
      default:
        return '/dashboard';
    }
  };

  // Logout Handler
  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (e) {
      // Ignore API logout error
    }
    clearAllSessionData();
    toast.success('Logged out successfully');
    navigate('/login', { replace: true });
  };

  // Logout Mutation wrapper
  const logoutMutation = useMutation({
    mutationFn: handleLogout,
  });

  // Get current user
  const {
    data: user,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) return null;
      try {
        const response = await authApi.getProfile();
        return response.data?.user || response.data;
      } catch {
        clearAllSessionData();
        return null;
      }
    },
    enabled: hasToken,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  // Login
  const loginMutation = useMutation({
    mutationFn: async (data: LoginData) => {
      clearAllSessionData();
      return authApi.login(data);
    },
    onSuccess: (response: any) => {
      queryClient.clear();
      const authData = response.data || response;
      const { user: authUser, accessToken, refreshToken } = authData;
      if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
      }
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
      if (authUser) {
        localStorage.setItem('user', JSON.stringify(authUser));
        queryClient.setQueryData(['auth', 'me'], authUser);
      }
      toast.success('Login successful!');
      const targetDashboard = getRoleDashboard(authUser);
      navigate(targetDashboard, { replace: true });
    },
    onError: (error: any) => {
      clearAllSessionData();
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(message);
    },
  });

  // Register
  const registerMutation = useMutation({
    mutationFn: (data: RegisterData) => authApi.register(data),
    onSuccess: () => {
      toast.success('Registration successful! Please verify your email.');
      navigate('/login');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
    },
  });

  // Forgot Password
  const forgotPasswordMutation = useMutation({
    mutationFn: (data: ForgotPasswordData) => authApi.forgotPassword(data),
    onSuccess: () => {
      toast.success('Password reset email sent! Please check your inbox.');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to send reset email.';
      toast.error(message);
    },
  });

  // Reset Password
  const resetPasswordMutation = useMutation({
    mutationFn: (data: ResetPasswordData) => authApi.resetPassword(data),
    onSuccess: () => {
      toast.success('Password reset successful! Please login with your new password.');
      navigate('/login');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to reset password.';
      toast.error(message);
    },
  });

  // Verify Email
  const verifyEmailMutation = useMutation({
    mutationFn: (token: string) => authApi.verifyEmail(token),
    onSuccess: () => {
      toast.success('Email verified successfully!');
      navigate('/dashboard');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to verify email.';
      toast.error(message);
    },
  });

  const initAuth = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    initAuth,
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isLoading,
    register: registerMutation.mutate,
    registerAsync: registerMutation.mutateAsync,
    isRegistering: registerMutation.isLoading,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isLoading,
    forgotPassword: forgotPasswordMutation.mutate,
    isForgotPassword: forgotPasswordMutation.isLoading,
    resetPassword: resetPasswordMutation.mutate,
    isResettingPassword: resetPasswordMutation.isLoading,
    verifyEmail: verifyEmailMutation.mutate,
    isVerifyingEmail: verifyEmailMutation.isLoading,
    clearSession: clearAllSessionData,
    refetch,
  };
};
