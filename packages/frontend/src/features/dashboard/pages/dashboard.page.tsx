import React from 'react';
import { useAuth } from '../../../api/hooks/use-auth';
import { InternDashboardPage } from './intern-dashboard.page';
import { CompanyDashboardPage } from './company-dashboard.page';
import { ManagerDashboardPage } from './manager-dashboard.page';
import { AdminDashboardPage } from './admin-dashboard.page';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  switch (user?.role) {
    case 'admin':
      return <AdminDashboardPage />;
    case 'manager':
    case 'hr':
      return <ManagerDashboardPage />;
    case 'company':
      return <CompanyDashboardPage />;
    case 'intern':
    default:
      return <InternDashboardPage />;
  }
};
