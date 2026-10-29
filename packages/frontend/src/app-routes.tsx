import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './api/hooks/use-auth';
import { ProtectedRoute } from './shared/components/common/protected-route';
import { PermissionGuard } from './shared/components/common/permission-guard';

import { LoadingSpinner } from './shared/components/common/loading-spinner';

// Layouts
import { MainLayout } from './shared/components/layout/main-layout';
import { AuthLayout } from './shared/components/layout/auth-layout';
import { AdminLayout } from './shared/components/layout/admin-layout';

// Helper for typed lazy loading of named exports
const lazyLoad = <T extends Record<string, any>, K extends keyof T>(
  loader: () => Promise<T>,
  exportName: K
) => React.lazy(() => loader().then((module) => ({ default: module[exportName] })));

// Pages - Auth (Lazy)
const LoginPage = lazyLoad(() => import('./features/auth/pages/login.page'), 'LoginPage');
const RegisterPage = lazyLoad(() => import('./features/auth/pages/register.page'), 'RegisterPage');
const ForgotPasswordPage = lazyLoad(() => import('./features/auth/pages/forgot-password.page'), 'ForgotPasswordPage');
const ResetPasswordPage = lazyLoad(() => import('./features/auth/pages/reset-password.page'), 'ResetPasswordPage');
const VerifyEmailPage = lazyLoad(() => import('./features/auth/pages/verify-email.page'), 'VerifyEmailPage');
const SsoCallbackPage = lazyLoad(() => import('./features/auth/pages/sso-callback.page'), 'SsoCallbackPage');

// Pages - Landing & Public
import { LandingPage } from './features/landing/pages/landing.page';
const AboutPage = lazyLoad(() => import('./features/landing/pages/about.page'), 'AboutPage');
const ForInternsPage = lazyLoad(() => import('./features/landing/pages/for-interns.page'), 'ForInternsPage');
const ForCompaniesPage = lazyLoad(() => import('./features/landing/pages/for-companies.page'), 'ForCompaniesPage');
const ProgramsPage = lazyLoad(() => import('./features/landing/pages/programs.page'), 'ProgramsPage');
const ContactPage = lazyLoad(() => import('./features/landing/pages/contact.page'), 'ContactPage');
const CertificatePage = lazyLoad(() => import('./features/dashboard/pages/certificate.page'), 'CertificatePage');
const PrivacyPage = lazyLoad(() => import('./features/legal/pages/privacy.page'), 'PrivacyPage');
const TermsPage = lazyLoad(() => import('./features/legal/pages/terms.page'), 'TermsPage');
const CookiePolicyPage = lazyLoad(() => import('./features/legal/pages/cookies.page'), 'CookiePolicyPage');
const RefundPolicyPage = lazyLoad(() => import('./features/legal/pages/refund.page'), 'RefundPolicyPage');

// Pages - Dashboard (Lazy)
const DashboardPage = lazyLoad(() => import('./features/dashboard/pages/dashboard.page'), 'DashboardPage');
const InternDashboardPage = lazyLoad(() => import('./features/dashboard/pages/intern-dashboard.page'), 'InternDashboardPage');
const CompanyDashboardPage = lazyLoad(() => import('./features/dashboard/pages/company-dashboard.page'), 'CompanyDashboardPage');
const ManagerDashboardPage = lazyLoad(() => import('./features/dashboard/pages/manager-dashboard.page'), 'ManagerDashboardPage');
const AdminDashboardPage = lazyLoad(() => import('./features/admin/pages/admin-dashboard.page'), 'AdminDashboardPage');
const HrDashboardPage = lazyLoad(() => import('./features/dashboard/pages/hr-dashboard.page'), 'HrDashboardPage');
const HrApplicationsPage = lazyLoad(() => import('./features/admin/pages/hr-applications.page'), 'HrApplicationsPage');
const HrLeadsPage = lazyLoad(() => import('./features/admin/pages/hr-leads.page'), 'HrLeadsPage');

// Pages - Features (Lazy)
const ProfilePage = lazyLoad(() => import('./features/profile/pages/profile.page'), 'ProfilePage');
const EditProfilePage = lazyLoad(() => import('./features/profile/pages/edit-profile.page'), 'EditProfilePage');
const AssessmentsPage = lazyLoad(() => import('./features/assessments/pages/assessments.page'), 'AssessmentsPage');
const TakeAssessmentPage = lazyLoad(() => import('./features/assessments/pages/take-assessment.page'), 'TakeAssessmentPage');
const AssessmentResultsPage = lazyLoad(() => import('./features/assessments/pages/assessment-results.page'), 'AssessmentResultsPage');
const TrainingPage = lazyLoad(() => import('./features/training/pages/training.page'), 'TrainingPage');
const TrainingDetailsPage = lazyLoad(() => import('./features/training/pages/training-details.page'), 'TrainingDetailsPage');
const ProjectsPage = lazyLoad(() => import('./features/projects/pages/projects.page'), 'ProjectsPage');
const ProjectDetailsPage = lazyLoad(() => import('./features/projects/pages/project-details.page'), 'ProjectDetailsPage');
const AttendancePage = lazyLoad(() => import('./features/attendance/pages/attendance.page'), 'AttendancePage');
const OpportunitiesPage = lazyLoad(() => import('./features/matching/pages/opportunities.page'), 'OpportunitiesPage');
const MatchDetailsPage = lazyLoad(() => import('./features/matching/pages/match-details.page'), 'MatchDetailsPage');
const CommunicationPage = lazyLoad(() => import('./features/communication/pages/communication.page'), 'CommunicationPage');
const NotificationsPage = lazyLoad(() => import('./features/notifications/pages/notifications.page'), 'NotificationsPage');
const SettingsPage = lazyLoad(() => import('./features/settings/pages/settings.page'), 'SettingsPage');

// Pages - Admin (Lazy)
const AdminInternsPage = lazyLoad(() => import('./features/admin/pages/admin-interns.page'), 'AdminInternsPage');
const AdminCompaniesPage = lazyLoad(() => import('./features/admin/pages/admin-companies.page'), 'AdminCompaniesPage');
const AdminAssessmentsPage = lazyLoad(() => import('./features/admin/pages/admin-assessments.page'), 'AdminAssessmentsPage');
const AdminTrainingPage = lazyLoad(() => import('./features/admin/pages/admin-training.page'), 'AdminTrainingPage');
const AdminAnalyticsPage = lazyLoad(() => import('./features/admin/pages/admin-analytics.page'), 'AdminAnalyticsPage');
const AdminLandingCmsPage = lazyLoad(() => import('./features/admin/pages/admin-landing-cms.page'), 'AdminLandingCmsPage');
const AdminSettingsPage = lazyLoad(() => import('./features/admin/pages/admin-settings.page'), 'AdminSettingsPage');

// Pages - Company (Lazy)
const CompanyRequirementsPage = lazyLoad(() => import('./features/companies/pages/company-requirements.page'), 'CompanyRequirementsPage');
const CompanyMatchesPage = lazyLoad(() => import('./features/companies/pages/company-matches.page'), 'CompanyMatchesPage');

// Pages - Manager (Lazy)
const TeamManagementPage = lazyLoad(() => import('./features/manager/pages/team-management.page'), 'TeamManagementPage');
const TeamProjectsPage = lazyLoad(() => import('./features/manager/pages/team-projects.page'), 'TeamProjectsPage');
const TeamTasksPage = lazyLoad(() => import('./features/manager/pages/team-tasks.page'), 'TeamTasksPage');
const TeamEvaluationsPage = lazyLoad(() => import('./features/manager/pages/team-evaluations.page'), 'TeamEvaluationsPage');
const TeamAttendancePage = lazyLoad(() => import('./features/manager/pages/team-attendance.page'), 'TeamAttendancePage');

// NotFound (Lazy)
const NotFoundPage = lazyLoad(() => import('./pages/not-found.page'), 'NotFoundPage');

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
    <React.Suspense fallback={<LoadingSpinner fullScreen label="Loading InterHive..." />}>
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/for-interns" element={<ForInternsPage />} />
        <Route path="/for-companies" element={<ForCompaniesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/programs" element={<ProgramsPage />} />
        <Route path="/our-programs" element={<ProgramsPage />} />
        <Route path="/ppo-program" element={<ProgramsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/cookies" element={<CookiePolicyPage />} />
        <Route path="/refund" element={<RefundPolicyPage />} />

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

        {/* Protected Basic Routes */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/edit" element={<EditProfilePage />} />
          <Route path="/training" element={<TrainingPage />} />
          <Route path="/training/:id" element={<TrainingDetailsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        {/* Protected Premium Intern Routes */}
        <Route
          element={
            <ProtectedRoute requiresPremium>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/assessments" element={<AssessmentsPage />} />
          <Route path="/assessments/:id/take" element={<TakeAssessmentPage />} />
          <Route path="/assessments/:id/results" element={<AssessmentResultsPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/internship" element={<ProjectsPage />} />
          <Route path="/projects/create" element={<Navigate to="/projects" replace />} />
          <Route path="/projects/:id" element={<ProjectDetailsPage />} />
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="/opportunities" element={<OpportunitiesPage />} />
          <Route path="/opportunities/:id" element={<MatchDetailsPage />} />
          <Route path="/certificate" element={<CertificatePage />} />
          <Route path="/communication" element={<CommunicationPage />} />
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
          <Route path="/admin/applications" element={<HrApplicationsPage />} />
          <Route path="/admin/leads" element={<HrLeadsPage />} />
          <Route path="/admin/landing-cms" element={<AdminLandingCmsPage />} />
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
          <Route path="/hr/dashboard" element={<HrDashboardPage />} />
          <Route path="/hr/applications" element={<HrApplicationsPage />} />
          <Route path="/hr/leads" element={<HrLeadsPage />} />
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
          <Route path="/manager/tasks" element={<TeamTasksPage />} />
          <Route path="/manager/projects" element={<TeamProjectsPage />} />
          <Route path="/manager/evaluations" element={<TeamEvaluationsPage />} />
          <Route path="/manager/attendance" element={<TeamAttendancePage />} />
        </Route>

        {/* Company Routes */}
        <Route
          element={
            <ProtectedRoute allowedRoles={['company', 'admin']}>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/company/dashboard" element={<CompanyDashboardPage />} />
          <Route path="/company/requirements" element={<CompanyRequirementsPage />} />
          <Route path="/company/matches" element={<CompanyMatchesPage initialTab="matches" />} />
          <Route path="/company/interviews" element={<CompanyMatchesPage initialTab="interviews" />} />
          <Route path="/company/hires" element={<CompanyMatchesPage initialTab="hires" />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </React.Suspense>
  );
};
