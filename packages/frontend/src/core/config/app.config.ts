interface AppConfig {
  appName: string;
  appVersion: string;
  environment: 'development' | 'staging' | 'production';
  apiBaseUrl: string;
  wsBaseUrl: string;
  socketPath: string;
  features: {
    enableChat: boolean;
    enableVideoCall: boolean;
    enableAnalytics: boolean;
    enableSSO: boolean;
  };
  theme: {
    defaultTheme: 'light' | 'dark';
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
  };
  pagination: {
    defaultLimit: number;
    maxLimit: number;
  };
  upload: {
    maxFileSize: number;
    allowedTypes: string[];
    maxFiles: number;
  };
  assessment: {
    maxAttempts: number;
    defaultDuration: number;
    passingScore: number;
  };
}

export const APP_CONFIG: AppConfig = {
  appName: import.meta.env.VITE_APP_NAME || 'InterHive',
  appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? 'https://interhive-backend.onrender.com/api/v1' : 'http://localhost:3000'),
  wsBaseUrl: import.meta.env.VITE_WS_BASE_URL || (import.meta.env.PROD ? 'wss://interhive-backend.onrender.com' : 'ws://localhost:3000'),
  socketPath: import.meta.env.VITE_SOCKET_PATH || '/socket.io',
  features: {
    enableChat: import.meta.env.VITE_ENABLE_CHAT === 'true',
    enableVideoCall: import.meta.env.VITE_ENABLE_VIDEO_CALL === 'true',
    enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    enableSSO: import.meta.env.VITE_ENABLE_SSO === 'true',
  },
  theme: {
    defaultTheme: (import.meta.env.VITE_DEFAULT_THEME as 'light' | 'dark') || 'light',
    primaryColor: import.meta.env.VITE_PRIMARY_COLOR || '#4F46E5',
    secondaryColor: import.meta.env.VITE_SECONDARY_COLOR || '#7C3AED',
    accentColor: import.meta.env.VITE_ACCENT_COLOR || '#10B981',
  },
  pagination: {
    defaultLimit: parseInt(import.meta.env.VITE_DEFAULT_LIMIT || '10', 10),
    maxLimit: parseInt(import.meta.env.VITE_MAX_LIMIT || '100', 10),
  },
  upload: {
    maxFileSize: parseInt(import.meta.env.VITE_MAX_FILE_SIZE || '5242880', 10),
    allowedTypes: (import.meta.env.VITE_ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/gif,application/pdf').split(','),
    maxFiles: parseInt(import.meta.env.VITE_MAX_FILES || '10', 10),
  },
  assessment: {
    maxAttempts: parseInt(import.meta.env.VITE_MAX_ATTEMPTS || '3', 10),
    defaultDuration: parseInt(import.meta.env.VITE_DEFAULT_DURATION || '60', 10),
    passingScore: parseInt(import.meta.env.VITE_PASSING_SCORE || '70', 10),
  },
};

export const getApiUrl = (path: string): string => {
  return `${APP_CONFIG.apiBaseUrl}/api/v1${path}`;
};

export const getWsUrl = (): string => {
  if (import.meta.env.PROD) {
    return 'https://interhive-backend.onrender.com';
  }
  return import.meta.env.VITE_WS_BASE_URL || 'http://localhost:3000';
};

export const isDevelopment = APP_CONFIG.environment === 'development';
export const isProduction = APP_CONFIG.environment === 'production';
export const isStaging = APP_CONFIG.environment === 'staging';
