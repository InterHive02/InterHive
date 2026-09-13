export const ROUTES = {
  // Auth
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',

  // Dashboard
  DASHBOARD: '/dashboard',
  ADMIN_DASHBOARD: '/admin/dashboard',
  HR_DASHBOARD: '/hr/dashboard',
  MANAGER_DASHBOARD: '/manager/dashboard',
  COMPANY_DASHBOARD: '/company/dashboard',

  // Profile
  PROFILE: '/profile',
  PROFILE_EDIT: '/profile/edit',

  // Assessments
  ASSESSMENTS: '/assessments',
  ASSESSMENT_TAKE: '/assessments/:id/take',
  ASSESSMENT_RESULTS: '/assessments/:id/results',

  // Training
  TRAINING: '/training',
  TRAINING_DETAILS: '/training/:id',

  // Projects
  PROJECTS: '/projects',
  PROJECT_DETAILS: '/projects/:id',

  // Attendance
  ATTENDANCE: '/attendance',

  // Matching
  OPPORTUNITIES: '/opportunities',
  MATCH_DETAILS: '/opportunities/:id',

  // Communication
  COMMUNICATION: '/communication',

  // Notifications
  NOTIFICATIONS: '/notifications',

  // Settings
  SETTINGS: '/settings',

  // Admin
  ADMIN_INTERNS: '/admin/interns',
  ADMIN_COMPANIES: '/admin/companies',
  ADMIN_ASSESSMENTS: '/admin/assessments',
  ADMIN_TRAINING: '/admin/training',
  ADMIN_ANALYTICS: '/admin/analytics',
  ADMIN_SETTINGS: '/admin/settings',

  // Company
  COMPANY_REQUIREMENTS: '/company/requirements',
  COMPANY_MATCHES: '/company/matches',

  // Manager
  MANAGER_TEAM: '/manager/team',
  MANAGER_PROJECTS: '/manager/projects',
} as const;

export type RoutePath = typeof ROUTES[keyof typeof ROUTES];

export const PUBLIC_ROUTES: RoutePath[] = [
  ROUTES.LOGIN,
  ROUTES.REGISTER,
  ROUTES.FORGOT_PASSWORD,
  ROUTES.RESET_PASSWORD,
  ROUTES.VERIFY_EMAIL,
];

export const PROTECTED_ROUTES: RoutePath[] = [
  ROUTES.DASHBOARD,
  ROUTES.PROFILE,
  ROUTES.PROFILE_EDIT,
  ROUTES.ASSESSMENTS,
  ROUTES.TRAINING,
  ROUTES.PROJECTS,
  ROUTES.ATTENDANCE,
  ROUTES.OPPORTUNITIES,
  ROUTES.COMMUNICATION,
  ROUTES.NOTIFICATIONS,
  ROUTES.SETTINGS,
];

export const ADMIN_ROUTES: RoutePath[] = [
  ROUTES.ADMIN_DASHBOARD,
  ROUTES.ADMIN_INTERNS,
  ROUTES.ADMIN_COMPANIES,
  ROUTES.ADMIN_ASSESSMENTS,
  ROUTES.ADMIN_TRAINING,
  ROUTES.ADMIN_ANALYTICS,
  ROUTES.ADMIN_SETTINGS,
];

export const HR_ROUTES: RoutePath[] = [
  ROUTES.HR_DASHBOARD,
  ROUTES.ADMIN_INTERNS,
  ROUTES.ADMIN_COMPANIES,
  ROUTES.ADMIN_ASSESSMENTS,
  ROUTES.ADMIN_TRAINING,
  ROUTES.ADMIN_ANALYTICS,
];

export const MANAGER_ROUTES: RoutePath[] = [
  ROUTES.MANAGER_DASHBOARD,
  ROUTES.MANAGER_TEAM,
  ROUTES.MANAGER_PROJECTS,
];

export const COMPANY_ROUTES: RoutePath[] = [
  ROUTES.COMPANY_DASHBOARD,
  ROUTES.COMPANY_REQUIREMENTS,
  ROUTES.COMPANY_MATCHES,
];

export const getDefaultRoute = (role: string): RoutePath => {
  switch (role) {
    case 'admin':
      return ROUTES.ADMIN_DASHBOARD;
    case 'hr':
      return ROUTES.HR_DASHBOARD;
    case 'manager':
      return ROUTES.MANAGER_DASHBOARD;
    case 'company':
      return ROUTES.COMPANY_DASHBOARD;
    default:
      return ROUTES.DASHBOARD;
  }
};
