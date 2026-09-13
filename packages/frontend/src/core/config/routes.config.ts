import { UserRole } from '@interhive/shared';

export interface RouteConfig {
  path: string;
  label: string;
  icon?: string;
  roles?: UserRole[];
  children?: RouteConfig[];
  requiresAuth?: boolean;
  hideInNav?: boolean;
}

export const ROUTES: RouteConfig[] = [
  {
    path: '/dashboard',
    label: 'Dashboard',
    icon: 'LayoutDashboard',
    roles: ['intern', 'company', 'manager', 'hr', 'admin'],
  },
  {
    path: '/profile',
    label: 'Profile',
    icon: 'User',
    roles: ['intern', 'company', 'manager', 'hr', 'admin'],
  },
  {
    path: '/assessments',
    label: 'Assessments',
    icon: 'ClipboardCheck',
    roles: ['intern'],
  },
  {
    path: '/training',
    label: 'Training',
    icon: 'GraduationCap',
    roles: ['intern'],
  },
  {
    path: '/projects',
    label: 'Projects',
    icon: 'Briefcase',
    roles: ['intern', 'manager', 'hr', 'admin'],
  },
  {
    path: '/attendance',
    label: 'Attendance',
    icon: 'Clock',
    roles: ['intern', 'manager', 'hr', 'admin'],
  },
  {
    path: '/opportunities',
    label: 'Opportunities',
    icon: 'Target',
    roles: ['intern'],
  },
  {
    path: '/communication',
    label: 'Messages',
    icon: 'MessageSquare',
    roles: ['intern', 'company', 'manager', 'hr', 'admin'],
  },
  {
    path: '/notifications',
    label: 'Notifications',
    icon: 'Bell',
    roles: ['intern', 'company', 'manager', 'hr', 'admin'],
    hideInNav: true,
  },
  {
    path: '/settings',
    label: 'Settings',
    icon: 'Settings',
    roles: ['intern', 'company', 'manager', 'hr', 'admin'],
  },
  // Company specific
  {
    path: '/company/requirements',
    label: 'Requirements',
    icon: 'FileText',
    roles: ['company'],
  },
  {
    path: '/company/matches',
    label: 'Matches',
    icon: 'Users',
    roles: ['company'],
  },
  // Admin specific
  {
    path: '/admin/dashboard',
    label: 'Admin Dashboard',
    icon: 'LayoutDashboard',
    roles: ['admin', 'hr'],
  },
  {
    path: '/admin/interns',
    label: 'Manage Interns',
    icon: 'Users',
    roles: ['admin', 'hr'],
  },
  {
    path: '/admin/companies',
    label: 'Manage Companies',
    icon: 'Building2',
    roles: ['admin', 'hr'],
  },
  {
    path: '/admin/assessments',
    label: 'Manage Assessments',
    icon: 'FileQuestion',
    roles: ['admin', 'hr'],
  },
  {
    path: '/admin/training',
    label: 'Manage Training',
    icon: 'BookOpen',
    roles: ['admin', 'hr'],
  },
  {
    path: '/admin/analytics',
    label: 'Analytics',
    icon: 'BarChart3',
    roles: ['admin', 'hr'],
  },
  // Manager specific
  {
    path: '/manager/team',
    label: 'My Team',
    icon: 'Users',
    roles: ['manager'],
  },
  {
    path: '/manager/projects',
    label: 'Team Projects',
    icon: 'Briefcase',
    roles: ['manager'],
  },
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

// Get routes for a specific role
export const getRoutesForRole = (role: UserRole): RouteConfig[] => {
  return ROUTES.filter(route => 
    !route.roles || route.roles.includes(role)
  );
};

// Get parent routes (not hidden in nav)
export const getNavRoutes = (role: UserRole): RouteConfig[] => {
  return getRoutesForRole(role).filter(route => !route.hideInNav);
};

// Get route by path
export const getRouteByPath = (path: string): RouteConfig | undefined => {
  const findRoute = (routes: RouteConfig[]): RouteConfig | undefined => {
    for (const route of routes) {
      if (route.path === path) return route;
      if (route.children) {
        const child = findRoute(route.children);
        if (child) return child;
      }
    }
    return undefined;
  };
  return findRoute(ROUTES);
};

// Check if route requires authentication
export const requiresAuth = (path: string): boolean => {
  return !PUBLIC_ROUTES.includes(path);
};

// Check if route is accessible for role
export const isRouteAccessible = (path: string, role: UserRole): boolean => {
  const route = getRouteByPath(path);
  if (!route) return false;
  if (!route.roles) return true;
  return route.roles.includes(role);
};
