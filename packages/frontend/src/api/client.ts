import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { toast } from 'react-hot-toast';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
  metadata?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
    hasNext?: boolean;
    hasPrev?: boolean;
  };
}

class ApiClient {
  private client: AxiosInstance;
  private static instance: ApiClient;

  private constructor() {
    const defaultBaseUrl = import.meta.env.PROD
      ? 'https://interhive-backend.onrender.com/api/v1'
      : '/api/v1';

    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || defaultBaseUrl,
      timeout: 60000, // 60 seconds to allow for Render free-tier cold starts
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
    this.warmUp();
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  // Pre-warm backend on page load so it is awake by the time user takes an action
  public warmUp(): void {
    if (typeof window !== 'undefined') {
      const apiBase = import.meta.env.PROD
        ? 'https://interhive-backend.onrender.com/api/v1'
        : '/api/v1';
      fetch(`${apiBase}/health`, { method: 'GET', mode: 'cors' }).catch(() => {});
    }
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
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
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        const isPublicPage = ['/', '/login', '/register', '/forgot-password', '/reset-password', '/verify-email'].some(
          (path) => path === '/' ? window.location.pathname === '/' : window.location.pathname.startsWith(path)
        );
        const isAuthEndpoint = originalRequest?.url?.includes('/auth/me') ||
                               originalRequest?.url?.includes('/auth/login') ||
                               originalRequest?.url?.includes('/auth/register');

        // Automatic retry for cloud cold-starts or network blips (Render free-tier spin-up)
        const isNetworkOrTimeout = !error.response && (
          error.code === 'ECONNABORTED' ||
          error.message?.toLowerCase().includes('network') ||
          error.message?.toLowerCase().includes('timeout') ||
          !!error.request
        );

        if (isNetworkOrTimeout && originalRequest && !originalRequest._retryNetwork) {
          originalRequest._retryNetwork = true;
          console.warn('Backend waking up or network blip detected, retrying request in 2.5s...', originalRequest.url);
          await new Promise((resolve) => setTimeout(resolve, 2500));
          return this.client(originalRequest);
        }

        // Handle 401 - Unauthorized
        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
          if (originalRequest.url?.includes('/auth/refresh') || isAuthEndpoint) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            return Promise.reject(error);
          }

          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) {
              localStorage.removeItem('accessToken');
              localStorage.removeItem('user');
              return Promise.reject(error);
            }
            const response = await this.client.post('/auth/refresh', { refreshToken });
            const { accessToken, refreshToken: newRefreshToken } = response.data.data;

            localStorage.setItem('accessToken', accessToken);
            if (newRefreshToken) {
              localStorage.setItem('refreshToken', newRefreshToken);
            }

            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return this.client(originalRequest);
          } catch (refreshError) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            return Promise.reject(refreshError);
          }
        }

        // Handle other errors
        if (error.response) {
          const message = error.response.data?.message || 'An error occurred';
          if (typeof message === 'string' && message.startsWith('Cannot ')) {
            console.warn('API endpoint not found:', message);
          } else {
            toast.error(message);
          }
        } else if (error.request) {
          // If already retried and still no response from server
          toast.error('Server is waking up or network is slow. Please try again in a moment.');
        } else {
          toast.error('An unexpected error occurred');
        }

        return Promise.reject(error);
      }
    );
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.client.get(url, config);
    return response.data;
  }

  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.client.post(url, data, config);
    return response.data;
  }

  public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.client.put(url, data, config);
    return response.data;
  }

  public async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.client.patch(url, data, config);
    return response.data;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.client.delete(url, config);
    return response.data;
  }

  public async upload<T>(url: string, file: File, fieldName: string = 'file'): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append(fieldName, file);

    const response: AxiosResponse<ApiResponse<T>> = await this.client.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  public async uploadMultiple<T>(url: string, files: File[], fieldName: string = 'files'): Promise<ApiResponse<T>> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append(fieldName, file);
    });

    const response: AxiosResponse<ApiResponse<T>> = await this.client.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
}

export const apiClient = ApiClient.getInstance();
