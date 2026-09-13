import { UserRole } from '@interhive/shared';

export interface RouteConfig {
  path: string;
  label: string;
  icon?: string;
  roles?: UserRole[];
  children?: RouteConfig[];
  requiresAuth?: boolean;
  hideInNav?: boolean;
  badge?: number | string;
}

// Role-specific navigation definitions matching reference visual specifications
export const ROLE_NAVIGATION: Record<UserRole, RouteConfig[]> = {
  // 1. Super Administrator Central (media_1789204056633.jpg)
  admin: [
    { path: '/admin/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { path: '/profile', label: 'Profile', icon: 'User' },
    { path: '/admin/interns', label: 'Manage Interns', icon: 'Users' },
    { path: '/admin/applications', label: 'Applications', icon: 'FileText' },
    { path: '/admin/companies', label: 'Manage Companies', icon: 'Building2' },
    { path: '/admin/leads', label: 'Company Leads', icon: 'Building' },
    { path: '/admin/assessments', label: 'Assessments', icon: 'FileQuestion' },
    { path: '/admin/training', label: 'Training', icon: 'BookOpen' },
    { path: '/admin/analytics', label: 'Analytics', icon: 'BarChart3' },
    { path: '/communication', label: 'Messages', icon: 'MessageSquare', badge: 4 },
    { path: '/admin/settings', label: 'Settings', icon: 'Settings' },
  ],

  // 2. HR Operations & Talent Pipeline
  hr: [
    { path: '/hr/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { path: '/profile', label: 'Profile', icon: 'User' },
    { path: '/hr/applications', label: 'Applications', icon: 'FileText' },
    { path: '/hr/leads', label: 'Company Leads', icon: 'Building2' },
    { path: '/hr/interns', label: 'Manage Interns', icon: 'Users' },
    { path: '/hr/companies', label: 'Partner Companies', icon: 'Building' },
    { path: '/hr/assessments', label: 'Assessments', icon: 'ClipboardCheck' },
    { path: '/hr/training', label: 'Training Sprints', icon: 'GraduationCap' },
    { path: '/hr/analytics', label: 'Analytics', icon: 'BarChart3' },
    { path: '/communication', label: 'Messages', icon: 'MessageSquare', badge: 4 },
    { path: '/settings', label: 'Settings', icon: 'Settings' },
  ],

  // 3. Operations & Training Management (media_1789204058378.png)
  manager: [
    { path: '/manager/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { path: '/profile', label: 'Profile', icon: 'User' },
    { path: '/projects', label: 'Projects', icon: 'FolderKanban' },
    { path: '/attendance', label: 'Attendance', icon: 'Clock' },
    { path: '/communication', label: 'Messages', icon: 'MessageSquare', badge: 4 },
    { path: '/settings', label: 'Settings', icon: 'Settings' },
    { path: '/manager/team', label: 'My Team', icon: 'Users' },
    { path: '/manager/projects', label: 'Team Projects', icon: 'Briefcase' },
  ],

  // 4. Partner Company Portal (media_1789204060076.png)
  company: [
    { path: '/company/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { path: '/profile', label: 'Profile', icon: 'User' },
    { path: '/communication', label: 'Messages', icon: 'MessageSquare', badge: 4 },
    { path: '/company/requirements', label: 'Requirements', icon: 'FileText' },
    { path: '/company/matches', label: 'Matches', icon: 'Users' },
    { path: '/company/interviews', label: 'Interviews', icon: 'Calendar' },
    { path: '/company/hires', label: 'Hires', icon: 'Award' },
    { path: '/settings', label: 'Settings', icon: 'Settings' },
  ],

  // 5. Intern Learning & Project Workspace
  intern: [
    { path: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { path: '/profile', label: 'Profile', icon: 'User' },
    { path: '/assessments', label: 'Assessments', icon: 'Award' },
    { path: '/training', label: 'Training', icon: 'BookOpen' },
    { path: '/projects', label: 'Projects', icon: 'FolderKanban' },
    { path: '/attendance', label: 'Attendance', icon: 'Clock' },
    { path: '/opportunities', label: 'Opportunities', icon: 'Target' },
    { path: '/communication', label: 'Messages', icon: 'MessageSquare', badge: 4 },
    { path: '/settings', label: 'Settings', icon: 'Settings' },
  ],

  // Mentor / Evaluator roles
  mentor: [
    { path: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { path: '/profile', label: 'Profile', icon: 'User' },
    { path: '/projects', label: 'Projects', icon: 'Briefcase' },
    { path: '/training', label: 'Training', icon: 'BookOpen' },
    { path: '/communication', label: 'Messages', icon: 'MessageSquare', badge: 4 },
    { path: '/settings', label: 'Settings', icon: 'Settings' },
  ],
  evaluator: [
    { path: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { path: '/profile', label: 'Profile', icon: 'User' },
    { path: '/assessments', label: 'Assessments', icon: 'ClipboardCheck' },
    { path: '/communication', label: 'Messages', icon: 'MessageSquare', badge: 4 },
    { path: '/settings', label: 'Settings', icon: 'Settings' },
  ],
};

// Global route registry
export const ROUTES: RouteConfig[] = [
  // Dashboard roots
  { path: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard', roles: ['intern', 'mentor', 'evaluator'] },
  { path: '/admin/dashboard', label: 'Dashboard', icon: 'LayoutDashboard', roles: ['admin'] },
  { path: '/hr/dashboard', label: 'Dashboard', icon: 'LayoutDashboard', roles: ['hr'] },
  { path: '/manager/dashboard', label: 'Dashboard', icon: 'LayoutDashboard', roles: ['manager'] },
  { path: '/company/dashboard', label: 'Dashboard', icon: 'LayoutDashboard', roles: ['company'] },

  // Profile
  { path: '/profile', label: 'Profile', icon: 'User', roles: ['intern', 'company', 'manager', 'hr', 'admin'] },

  // Intern features
  { path: '/assessments', label: 'Assessments', icon: 'Award', roles: ['intern'] },
  { path: '/training', label: 'Training', icon: 'BookOpen', roles: ['intern'] },
  { path: '/projects', label: 'Projects', icon: 'FolderKanban', roles: ['intern', 'manager', 'hr', 'admin'] },
  { path: '/attendance', label: 'Attendance', icon: 'Clock', roles: ['intern', 'manager', 'hr', 'admin'] },
  { path: '/opportunities', label: 'Opportunities', icon: 'Target', roles: ['intern'] },
  { path: '/communication', label: 'Messages', icon: 'MessageSquare', roles: ['intern', 'company', 'manager', 'hr', 'admin'] },
  { path: '/settings', label: 'Settings', icon: 'Settings', roles: ['intern', 'company', 'manager', 'hr', 'admin'] },

  // Admin & HR
  { path: '/admin/applications', label: 'Applications', icon: 'FileText', roles: ['admin'] },
  { path: '/admin/leads', label: 'Company Leads', icon: 'Building', roles: ['admin'] },
  { path: '/admin/interns', label: 'Manage Interns', icon: 'Users', roles: ['admin'] },
  { path: '/admin/companies', label: 'Manage Companies', icon: 'Building2', roles: ['admin'] },
  { path: '/admin/assessments', label: 'Assessments', icon: 'FileQuestion', roles: ['admin'] },
  { path: '/admin/training', label: 'Training', icon: 'BookOpen', roles: ['admin'] },
  { path: '/admin/analytics', label: 'Analytics', icon: 'BarChart3', roles: ['admin'] },
  { path: '/admin/settings', label: 'Settings', icon: 'Settings', roles: ['admin'] },

  { path: '/hr/applications', label: 'Applications', icon: 'FileText', roles: ['hr'] },
  { path: '/hr/leads', label: 'Company Leads', icon: 'Building2', roles: ['hr'] },
  { path: '/hr/interns', label: 'Manage Interns', icon: 'Users', roles: ['hr'] },
  { path: '/hr/companies', label: 'Partner Companies', icon: 'Building', roles: ['hr'] },
  { path: '/hr/assessments', label: 'Assessments', icon: 'ClipboardCheck', roles: ['hr'] },
  { path: '/hr/training', label: 'Training Sprints', icon: 'GraduationCap', roles: ['hr'] },
  { path: '/hr/analytics', label: 'Analytics', icon: 'BarChart3', roles: ['hr'] },

  // Manager
  { path: '/manager/team', label: 'My Team', icon: 'Users', roles: ['manager'] },
  { path: '/manager/projects', label: 'Team Projects', icon: 'Briefcase', roles: ['manager'] },

  // Company
  { path: '/company/requirements', label: 'Requirements', icon: 'FileText', roles: ['company', 'admin'] },
  { path: '/company/matches', label: 'Matches', icon: 'Users', roles: ['company', 'admin'] },
  { path: '/company/interviews', label: 'Interviews', icon: 'Calendar', roles: ['company', 'admin'] },
  { path: '/company/hires', label: 'Hires', icon: 'Award', roles: ['company', 'admin'] },
];

// Auth routes (no auth required)
export const AUTH_ROUTES = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
];

// Public routes (accessible without auth)
export const PUBLIC_ROUTES = [
  '/',
  '/health',
  ...AUTH_ROUTES,
];

// Get parent routes for navigation based on user role
export const getNavRoutes = (role: UserRole): RouteConfig[] => {
  return ROLE_NAVIGATION[role] || ROLE_NAVIGATION.intern;
};

// Get routes for a specific role
export const getRoutesForRole = (role: UserRole): RouteConfig[] => {
  return getNavRoutes(role);
};

// Get route by path
export const getRouteByPath = (path: string): RouteConfig | undefined => {
  const cleanPath = path.split('?')[0];
  return ROUTES.find(r => r.path === cleanPath || r.path === path);
};

// Check if route requires authentication
export const requiresAuth = (path: string): boolean => {
  return !PUBLIC_ROUTES.includes(path);
};

// Check if route is accessible for role
export const isRouteAccessible = (path: string, role: UserRole): boolean => {
  if (role === 'admin') return true;
  const route = getRouteByPath(path);
  if (!route) return false;
  if (!route.roles) return true;
  return route.roles.includes(role);
};
