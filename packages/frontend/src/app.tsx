import React, { useEffect } from 'react';
import { AppRoutes } from './app-routes';
import { useAuth } from './api/hooks/use-auth';
import { ErrorBoundary } from './shared/components/common/error-boundary';
import { LoadingSpinner } from './shared/components/common/loading-spinner';
import { Toaster } from 'react-hot-toast';

export const App: React.FC = () => {
  const { initAuth, isLoading } = useAuth();

  useEffect(() => {
    initAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <AppRoutes />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            duration: 3000,
            style: {
              background: '#10B981',
              color: '#fff',
            },
          },
          error: {
            duration: 4000,
            style: {
              background: '#EF4444',
              color: '#fff',
            },
          },
        }}
      />
    </ErrorBoundary>
  );
};
