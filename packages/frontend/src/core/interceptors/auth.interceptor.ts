import { apiClient } from '../config/api.config';

let refreshPromise: Promise<string> | null = null;

export const setupAuthInterceptors = () => {
  // Request interceptor
  apiClient.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor
  apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      const isAuthPage = ['/login', '/register', '/forgot-password', '/reset-password'].some(
        (path) => window.location.pathname.startsWith(path)
      );
      const isAuthEndpoint = originalRequest?.url?.includes('/auth/me') ||
                             originalRequest?.url?.includes('/auth/login') ||
                             originalRequest?.url?.includes('/auth/register');

      // If error is 401 and not a refresh request
      if (error.response?.status === 401 && !originalRequest._retry) {
        if (originalRequest.url?.includes('/auth/refresh') || isAuthEndpoint) {
          // Refresh token failed
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          if (!isAuthPage && !isAuthEndpoint) {
            window.location.href = '/login';
          }
          return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
          // Try to refresh token
          const newToken = await refreshAccessToken();
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          // Refresh failed
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          if (!isAuthPage) {
            window.location.href = '/login';
          }
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};

const refreshAccessToken = async (): Promise<string> => {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = new Promise((resolve, reject) => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      reject(new Error('No refresh token'));
      return;
    }

    apiClient
      .post('/auth/refresh', { refreshToken })
      .then((response) => {
        const { accessToken, refreshToken: newRefreshToken } = response.data.data;
        localStorage.setItem('accessToken', accessToken);
        if (newRefreshToken) {
          localStorage.setItem('refreshToken', newRefreshToken);
        }
        resolve(accessToken);
      })
      .catch(reject)
      .finally(() => {
        refreshPromise = null;
      });
  });

  return refreshPromise;
};

// Helper functions for token management
export const setAccessToken = (token: string) => {
  localStorage.setItem('accessToken', token);
};

export const getAccessToken = (): string | null => {
  return localStorage.getItem('accessToken');
};

export const setRefreshToken = (token: string) => {
  localStorage.setItem('refreshToken', token);
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem('refreshToken');
};

export const clearTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

export const setUser = (user: any) => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const getUser = (): any | null => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const clearUser = () => {
  localStorage.removeItem('user');
};

export const clearAuth = () => {
  clearTokens();
  clearUser();
};
