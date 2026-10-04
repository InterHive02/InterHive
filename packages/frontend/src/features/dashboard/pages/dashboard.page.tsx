import React from 'react';
import { useAuth } from '../../../api/hooks/use-auth';
import { InternDashboardPage } from './intern-dashboard.page';
import { FreeStudentDashboardPage } from './free-student-dashboard.page';
import { CompanyDashboardPage } from './company-dashboard.page';
import { ManagerDashboardPage } from './manager-dashboard.page';
import { AdminDashboardPage } from './admin-dashboard.page';
import { HrDashboardPage } from './hr-dashboard.page';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  switch (user?.role) {
    case 'admin':
      return <AdminDashboardPage />;
    case 'hr':
      return <HrDashboardPage />;
    case 'manager':
      return <ManagerDashboardPage />;
    case 'company':
      return <CompanyDashboardPage />;
    case 'intern':
    default: {
      // Check if user is officially selected/enrolled in the PPO Program (e.g. demo account or HR enrolled)
      const isPpoEnrolled =
        (user as any)?.isPpoEnrolled === true ||
        user?.email === 'intern@interhive.in' ||
        (typeof window !== 'undefined' && localStorage.getItem('isPpoEnrolled') === 'true');

      if (isPpoEnrolled) {
        return <InternDashboardPage />;
      }

      // Free registered students get the Free Student Dashboard showing the PPO program & application flow
      return <FreeStudentDashboardPage />;
    }
  }
};

