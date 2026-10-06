import React from 'react';
import { useAuth } from '../../../api/hooks/use-auth';
import { InternDashboardPage } from './intern-dashboard.page';
import { FreeStudentDashboardPage } from './free-student-dashboard.page';
import { CompanyDashboardPage } from './company-dashboard.page';
import { ManagerDashboardPage } from './manager-dashboard.page';
import { AdminDashboardPage } from './admin-dashboard.page';
import { HrDashboardPage } from './hr-dashboard.page';
import { LoadingSpinner } from '../../../shared/components/common/loading-spinner';

export const DashboardPage: React.FC = () => {
  const { user, isLoading } = useAuth();

  // Prevent premature dashboard mounting while authentication is loading
  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F8FC]">
        <LoadingSpinner label="Loading dashboard..." />
      </div>
    );
  }

  switch (user.role) {
    case 'admin':
      return <AdminDashboardPage />;
    case 'hr':
      return <HrDashboardPage />;
    case 'manager':
      return <ManagerDashboardPage />;
    case 'company':
      return <CompanyDashboardPage />;
    case 'student':
      return <FreeStudentDashboardPage />;
    case 'intern': {
      const isPremium = (user as any)?.accessLevel === 'PREMIUM' || user?.email === 'intern@interhive.in';
      if (isPremium) {
        return <InternDashboardPage />;
      }
      return <FreeStudentDashboardPage />;
    }
    default: {
      const isPremium = (user as any)?.accessLevel === 'PREMIUM';
      if (isPremium) {
        return <InternDashboardPage />;
      }
      return <FreeStudentDashboardPage />;
    }
  }
};

