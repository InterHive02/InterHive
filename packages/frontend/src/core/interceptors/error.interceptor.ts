import { AxiosError } from 'axios';
import { toast } from 'react-hot-toast';

export interface ErrorResponse {
  success: boolean;
  message: string;
  statusCode: number;
  error?: any;
  timestamp: string;
  path?: string;
  correlationId?: string;
}

export const handleApiError = (error: AxiosError<ErrorResponse>): string => {
  if (!error.response) {
    // Network error
    toast.error('Network error. Please check your connection.');
    return 'Network error. Please check your connection.';
  }

  const { status, data } = error.response;

  // Handle specific status codes
  switch (status) {
    case 400:
      toast.error(data?.message || 'Bad request. Please check your input.');
      return data?.message || 'Bad request. Please check your input.';
    case 401:
      toast.error(data?.message || 'You need to be logged in to access this resource.');
      return data?.message || 'You need to be logged in to access this resource.';
    case 403:
      toast.error(data?.message || 'You do not have permission to access this resource.');
      return data?.message || 'You do not have permission to access this resource.';
    case 404:
      toast.error(data?.message || 'Resource not found.');
      return data?.message || 'Resource not found.';
    case 409:
      toast.error(data?.message || 'Resource already exists or conflict occurred.');
      return data?.message || 'Resource already exists or conflict occurred.';
    case 422:
      toast.error(data?.message || 'Validation error. Please check your input.');
      return data?.message || 'Validation error. Please check your input.';
    case 429:
      toast.error('Too many requests. Please try again later.');
      return 'Too many requests. Please try again later.';
    case 500:
      toast.error('Internal server error. Please try again later.');
      return 'Internal server error. Please try again later.';
    case 502:
      toast.error('Bad gateway. The server is temporarily unavailable.');
      return 'Bad gateway. The server is temporarily unavailable.';
    case 503:
      toast.error('Service unavailable. Please try again later.');
      return 'Service unavailable. Please try again later.';
    default:
      const message = data?.message || 'An unexpected error occurred. Please try again.';
      toast.error(message);
      return message;
  }
};

export const handleValidationErrors = (errors: Record<string, string[]>): Record<string, string> => {
  const formattedErrors: Record<string, string> = {};
  for (const [field, messages] of Object.entries(errors)) {
    formattedErrors[field] = messages[0] || 'Invalid value';
  }
  return formattedErrors;
};

export const extractErrorMessage = (error: any): string => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  if (error?.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

export const isNetworkError = (error: any): boolean => {
  return !error.response || error.message === 'Network Error';
};

export const isAuthenticationError = (error: any): boolean => {
  return error?.response?.status === 401;
};

export const isAuthorizationError = (error: any): boolean => {
  return error?.response?.status === 403;
};

export const isNotFoundError = (error: any): boolean => {
  return error?.response?.status === 404;
};

export const isValidationError = (error: any): boolean => {
  return error?.response?.status === 422;
};

export const isConflictError = (error: any): boolean => {
  return error?.response?.status === 409;
};

export const isRateLimitError = (error: any): boolean => {
  return error?.response?.status === 429;
};

export const isServerError = (error: any): boolean => {
  return error?.response?.status >= 500;
};

export const createErrorLogger = (context: string) => {
  return (error: any, additionalData?: Record<string, any>) => {
    console.error(`[${context}] Error:`, {
      message: error?.message,
      response: error?.response?.data,
      status: error?.response?.status,
      config: {
        url: error?.config?.url,
        method: error?.config?.method,
        data: error?.config?.data,
      },
      ...additionalData,
    });
  };
};
