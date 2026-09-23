import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  Award,
  BookOpen,
  FolderKanban,
  Clock,
  Briefcase,
  MessageSquare,
  Settings,
  FileText,
  Users,
  Building2,
  Building,
  ClipboardCheck,
  GraduationCap,
  BarChart3,
  Target,
  Calendar,
  FileQuestion,
  LogOut,
  ChevronDown,
  X,
  Circle,
  Sun,
  Moon,
  ShieldAlert,
} from 'lucide-react';
import { getNavRoutes } from '../../../core/config/routes.config';
import { UserRole } from '@interhive/shared';
import { useTheme } from '../../../core/providers/theme.provider';
import { Logo } from '../common/logo';

interface SidebarProps {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  user: {
    id: string;
    role: UserRole;
    firstName: string;
    lastName: string;
    email: string;
    profilePhoto?: string;
  };
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  isMobileOpen,
  onCloseMobile,
  user,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mode, toggleTheme } = useTheme();
  const userRole: UserRole = user?.role || 'intern';
  const routes = getNavRoutes(userRole);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Safe and comprehensive Lucide icon mapper
  const getRouteIcon = (iconName?: string) => {
    switch (iconName?.toLowerCase()) {
      case 'dashboard':
      case 'layoutdashboard':
        return LayoutDashboard;
      case 'user':
      case 'profile':
        return User;
      case 'award':
      case 'hires':
        return Award;
      case 'assessments':
      case 'clipboardcheck':
        return ClipboardCheck;
      case 'bookopen':
      case 'training':
        return BookOpen;
      case 'graduationcap':
        return GraduationCap;
      case 'folderkanban':
      case 'projects':
        return FolderKanban;
      case 'clock':
      case 'attendance':
        return Clock;
      case 'briefcase':
      case 'teamprojects':
        return Briefcase;
      case 'target':
      case 'opportunities':
        return Target;
      case 'messagesquare':
      case 'communication':
      case 'messages':
        return MessageSquare;
      case 'settings':
        return Settings;
      case 'filetext':
      case 'requirements':
      case 'applications':
        return FileText;
      case 'users':
      case 'matches':
      case 'myteam':
      case 'manageinterns':
        return Users;
      case 'building2':
      case 'managecompanies':
      case 'companyleads':
        return Building2;
      case 'building':
        return Building;
      case 'filequestion':
        return FileQuestion;
      case 'barchart3':
      case 'analytics':
        return BarChart3;
      case 'calendar':
      case 'interviews':
        return Calendar;
      default:
        return Circle;
    }
  };

  // Role metadata and visual accents
  const getRoleMeta = () => {
    const fn = user?.firstName || '';
    const ln = user?.lastName || '';
    const name = fn ? `${fn} ${ln}`.trim() : '';
    const initials = (fn[0] || 'U') + (ln[0] || '');

    switch (userRole) {
      case 'admin':
        return {
          title: name || 'Super Administrator',
          subtitle: 'System Administrator',
          avatarText: initials || 'SA',
          avatarBg: 'bg-purple-600',
          activeBg: 'bg-purple-50 dark:bg-purple-600 text-purple-700 dark:text-white',
          activeIcon: 'text-purple-600 dark:text-white',
        };
      case 'hr':
        return {
          title: name || 'Hannah HR',
          subtitle: 'HR Operations',
          avatarText: initials || 'HH',
          avatarBg: 'bg-indigo-600',
          activeBg: 'bg-indigo-50 dark:bg-indigo-600 text-indigo-700 dark:text-white',
          activeIcon: 'text-indigo-600 dark:text-white',
        };
      case 'manager':
        return {
          title: name || 'Michael Manager',
          subtitle: 'Operations Manager',
          avatarText: initials || 'MM',
          avatarBg: 'bg-indigo-600',
          activeBg: 'bg-indigo-50 dark:bg-indigo-600 text-indigo-700 dark:text-white',
          activeIcon: 'text-indigo-600 dark:text-white',
        };
      case 'company':
        return {
          title: name || 'TechCorp Partner',
          subtitle: 'Corporate Recruiter',
          avatarText: initials || 'TC',
          avatarBg: 'bg-teal-600',
          activeBg: 'bg-teal-50 dark:bg-teal-600 text-teal-700 dark:text-white',
          activeIcon: 'text-teal-600 dark:text-white',
        };
      case 'intern':
      default:
        return {
          title: name || 'John Intern',
          subtitle: 'Software Engineering Intern',
          avatarText: initials || 'JI',
          avatarBg: 'bg-indigo-600',
          activeBg: 'bg-indigo-50 dark:bg-indigo-600 text-indigo-700 dark:text-white',
          activeIcon: 'text-indigo-600 dark:text-white',
        };
    }
  };

  const roleMeta = getRoleMeta();

  // Active check helper
  const isRouteActive = (routePath: string) => {
    const current = location.pathname;
    const cleanRoute = routePath.split('?')[0];

    // Exact match
    if (current === cleanRoute) return true;

    // Sub-route match (excluding root /dashboard)
    if (cleanRoute !== '/dashboard' && current.startsWith(`${cleanRoute}/`)) {
      return true;
    }

    return false;
  };

  const isExpanded = !isCollapsed || isMobileOpen;

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-[#121526] text-slate-800 dark:text-slate-100 transition-colors">
      
      {/* Brand Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800/80">
        <Logo size="md" showText={isExpanded} />
        {isMobileOpen && (
          <button
            onClick={onCloseMobile}
            aria-label="Close sidebar"
            data-testid="sidebar-close-btn"
            className="lg:hidden p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* User Avatar & Role Card */}
      {isExpanded && (
        <div data-testid="sidebar-profile-card" className="p-4 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-3">
            {user?.profilePhoto ? (
              <img
                src={user.profilePhoto}
                alt={roleMeta.title}
                width={40}
                height={40}
                loading="lazy"
                decoding="async"
                className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
              />
            ) : (
              <div
                className={`w-10 h-10 rounded-full ${roleMeta.avatarBg} text-white font-bold flex items-center justify-center text-sm shadow-xs shrink-0`}
              >
                {roleMeta.avatarText}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                {roleMeta.title}
              </p>
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-400 truncate">
                {roleMeta.subtitle}
              </p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
          </div>
        </div>
      )}

      {/* Role Navigation List */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {routes.map((route) => {
          const IconComponent = getRouteIcon(route.icon);
          const isActive = isRouteActive(route.path);

          return (
            <NavLink
              key={route.path + route.label}
              to={route.path}
              onClick={onCloseMobile}
              title={route.label}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-xs sm:text-sm min-h-[44px] transition-all ${
                isActive
                  ? `${roleMeta.activeBg} shadow-2xs font-bold`
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
              } ${!isExpanded ? 'justify-center px-2' : ''}`}
            >
              <IconComponent
                className={`w-4 h-4 shrink-0 ${
                  isActive ? roleMeta.activeIcon : 'text-slate-400 dark:text-slate-400'
                }`}
              />
              {isExpanded && <span className="truncate">{route.label}</span>}
              {isExpanded && route.badge && (
                <span
                  className={`ml-auto w-5 h-5 rounded-full ${roleMeta.avatarBg} text-white text-[10px] font-bold flex items-center justify-center`}
                >
                  {route.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Footer Actions */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          title="Toggle Dark / Light Theme"
          className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {mode === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 min-h-[44px] rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          {isExpanded && <span>Logout</span>}
        </button>
      </div>

    </div>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 h-full h-dvh bg-white dark:bg-[#121526] border-r border-slate-200/80 dark:border-slate-800/80 z-50 transition-all duration-300 ${
          isMobileOpen ? 'translate-x-0 w-64 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};
