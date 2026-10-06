import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { LoadingSpinner } from './loading-spinner';

interface ProtectedRouteProps {
  children?: React.ReactNode;
  allowedRoles?: string[];
  requiresPremium?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  requiresPremium,
}) => {
  const location = useLocation();
  const hasLocalToken = typeof window !== 'undefined' && !!localStorage.getItem('accessToken');

  if (!hasLocalToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const localUserStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
  const localUser = localUserStr ? JSON.parse(localUserStr) : null;
  const userRole = localUser?.role || 'student';
  const accessLevel = localUser?.accessLevel || (userRole === 'student' ? 'BASIC' : 'PREMIUM');

  if (requiresPremium && (userRole === 'student' || accessLevel === 'BASIC')) {
    return <Navigate to="/dashboard" replace />;
  }

  if (allowedRoles) {
    // Super Administrator has universal access across all modules
    if (userRole !== 'admin' && !allowedRoles.includes(userRole)) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};
