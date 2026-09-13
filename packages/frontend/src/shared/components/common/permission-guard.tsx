import React from 'react';
import { useAuth } from '../../../api/hooks/use-auth';

interface PermissionGuardProps {
  permission?: string;
  permissions?: string[];
  role?: string;
  roles?: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  role,
  roles,
  children,
  fallback = null,
}) => {
  const { user } = useAuth();

  if (!user) return <>{fallback}</>;

  if (role && user.role !== role) return <>{fallback}</>;
  if (roles && !roles.includes(user.role)) return <>{fallback}</>;

  return <>{children}</>;
};
