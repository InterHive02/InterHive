import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './api/hooks/use-auth';
import { ProtectedRoute } from './shared/components/common/protected-route';
import { PermissionGuard } from './shared/components/common/permission-guard';

// Layouts
import { MainLayout } from './shared/components/layout/main-layout';
import { AuthLayout } from './shared/components/layout/auth-layout';
import { AdminLayout } from './shared/components/layout/admin-layout';

// Pages - Auth
import { LoginPage } from './features/auth/pages/login.page';
import { RegisterPage } from './features/auth/pages/register.page';
import { ForgotPasswordPage } from './features/auth/pages/forgot-password.page';
import { ResetPasswordPage } from './features/auth/pages/reset-password.page';
import { VerifyEmailPage } from './features/auth/pages/verify-email.page';
import { SsoCallbackPage } from './features/auth/pages/sso-callback.page';

// Pages - Landing
import { LandingPage } from './features/landing/pages/landing.page';

// Pages - Dashboard
import { DashboardPage } from './features/dashboard/pages/dashboard.page';
import { InternDashboardPage } from './features/dashboard/pages/intern-dashboard.page';
import { CompanyDashboardPage } from './features/dashboard/pages/company-dashboard.page';
import { ManagerDashboardPage } from './features/dashboard/pages/manager-dashboard.page';
import { AdminDashboardPage } from './features/dashboard/pages/admin-dashboard.page';

// Pages - Features
import { ProfilePage } from './features/profile/pages/profile.page';
import { EditProfilePage } from './features/profile/pages/edit-profile.page';
import { AssessmentsPage } from './features/assessments/pages/assessments.page';
import { TakeAssessmentPage } from './features/assessments/pages/take-assessment.page';
import { AssessmentResultsPage } from './features/assessments/pages/assessment-results.page';
import { TrainingPage } from './features/training/pages/training.page';
import { TrainingDetailsPage } from './features/training/pages/training-details.page';
import { ProjectsPage } from './features/projects/pages/projects.page';
import { ProjectDetailsPage } from './features/projects/pages/project-details.page';
import { AttendancePage } from './features/attendance/pages/attendance.page';
import { OpportunitiesPage } from './features/matching/pages/opportunities.page';
import { MatchDetailsPage } from './features/matching/pages/match-details.page';
import { CommunicationPage } from './features/communication/pages/communication.page';
import { NotificationsPage } from './features/notifications/pages/notifications.page';
import { SettingsPage } from './features/settings/pages/settings.page';

// Pages - Admin
import { AdminInternsPage } from './features/admin/pages/admin-interns.page';
import { AdminCompaniesPage } from './features/admin/pages/admin-companies.page';
import { AdminAssessmentsPage } from './features/admin/pages/admin-assessments.page';
import { AdminTrainingPage } from './features/admin/pages/admin-training.page';
import { AdminAnalyticsPage } from './features/admin/pages/admin-analytics.page';
import { AdminSettingsPage } from './features/admin/pages/admin-settings.page';

// Pages - Company
import { CompanyRequirementsPage } from './features/companies/pages/company-requirements.page';
import { CompanyMatchesPage } from './features/companies/pages/company-matches.page';

// Pages - Manager
import { TeamManagementPage } from './features/manager/pages/team-management.page';
import { TeamProjectsPage } from './features/manager/pages/team-projects.page';

// NotFound
import { NotFoundPage } from './pages/not-found.page';

export const AppRoutes: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  const getDashboardRoute = () => {
    if (!user) return '/dashboard';
    switch (user.role) {
      case 'admin':
        return '/admin/dashboard';
      case 'hr':
        return '/hr/dashboard';
      case 'manager':
        return '/manager/dashboard';
      case 'company':
        return '/company/dashboard';
      default:
        return '/dashboard';
    }
  };

  return (
    <Routes>
      {/* Public Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
      </Route>

      {/* Clerk SSO Callback Route */}
      <Route path="/sso-callback" element={<SsoCallbackPage />} />

      {/* Protected Routes */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        
        {/* Intern Routes */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/edit" element={<EditProfilePage />} />
        <Route path="/assessments" element={<AssessmentsPage />} />
        <Route path="/assessments/:id/take" element={<TakeAssessmentPage />} />
        <Route path="/assessments/:id/results" element={<AssessmentResultsPage />} />
        <Route path="/training" element={<TrainingPage />} />
        <Route path="/training/:id" element={<TrainingDetailsPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:id" element={<ProjectDetailsPage />} />
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/opportunities" element={<OpportunitiesPage />} />
        <Route path="/opportunities/:id" element={<MatchDetailsPage />} />
        <Route path="/communication" element={<CommunicationPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* Admin Routes */}
      <Route
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/interns" element={<AdminInternsPage />} />
        <Route path="/admin/companies" element={<AdminCompaniesPage />} />
        <Route path="/admin/assessments" element={<AdminAssessmentsPage />} />
        <Route path="/admin/training" element={<AdminTrainingPage />} />
        <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
        <Route path="/admin/settings" element={<AdminSettingsPage />} />
      </Route>

      {/* HR Routes */}
      <Route
        element={
          <ProtectedRoute allowedRoles={['admin', 'hr']}>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/hr/dashboard" element={<ManagerDashboardPage />} />
        <Route path="/hr/interns" element={<AdminInternsPage />} />
        <Route path="/hr/companies" element={<AdminCompaniesPage />} />
        <Route path="/hr/assessments" element={<AdminAssessmentsPage />} />
        <Route path="/hr/training" element={<AdminTrainingPage />} />
        <Route path="/hr/analytics" element={<AdminAnalyticsPage />} />
      </Route>

      {/* Manager Routes */}
      <Route
        element={
          <ProtectedRoute allowedRoles={['admin', 'hr', 'manager']}>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/manager/dashboard" element={<ManagerDashboardPage />} />
        <Route path="/manager/team" element={<TeamManagementPage />} />
        <Route path="/manager/projects" element={<TeamProjectsPage />} />
      </Route>

      {/* Company Routes */}
      <Route
        element={
          <ProtectedRoute allowedRoles={['company']}>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/company/dashboard" element={<CompanyDashboardPage />} />
        <Route path="/company/requirements" element={<CompanyRequirementsPage />} />
        <Route path="/company/matches" element={<CompanyMatchesPage />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
