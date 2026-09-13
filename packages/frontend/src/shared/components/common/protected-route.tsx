import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { LoadingSpinner } from './loading-spinner';

interface ProtectedRouteProps {
  children?: React.ReactNode;
  allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const location = useLocation();
  const hasLocalToken = typeof window !== 'undefined' && !!localStorage.getItem('accessToken');

  if (!hasLocalToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles) {
    const localUserStr = localStorage.getItem('user');
    const localUser = localUserStr ? JSON.parse(localUserStr) : null;
    const userRole = localUser?.role || 'intern';

    // Super Administrator has universal access across all modules
    if (userRole !== 'admin' && !allowedRoles.includes(userRole)) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};
