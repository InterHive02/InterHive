import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import * as Icons from 'lucide-react';
import {
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
  Circle,
  Sun,
  Moon,
  Sparkles,
  User,
  Award,
  BookOpen,
  FolderKanban,
  Clock,
  Briefcase,
  MessageSquare,
  LayoutDashboard
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
  const routes = getNavRoutes(user.role);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getRouteIcon = (iconName?: string) => {
    switch (iconName?.toLowerCase()) {
      case 'dashboard':
      case 'layoutdashboard':
        return LayoutDashboard;
      case 'user':
      case 'profile':
        return User;
      case 'award':
      case 'assessments':
        return Award;
      case 'bookopen':
      case 'training':
        return BookOpen;
      case 'folderkanban':
      case 'projects':
        return FolderKanban;
      case 'clock':
      case 'attendance':
        return Clock;
      case 'briefcase':
      case 'opportunities':
        return Briefcase;
      case 'messagesquare':
      case 'communication':
      case 'messages':
        return MessageSquare;
      default:
        return (Icons as Record<string, any>)[iconName || 'Circle'] || Circle;
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-[#121526] text-slate-800 dark:text-slate-100 transition-colors">
      
      {/* Brand Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800/80">
        <Logo size="md" showText={!isCollapsed} />
        {!isCollapsed && (
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* User Avatar Card */}
      {!isCollapsed && (
        <div className="p-4 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-3">
            {user.profilePhoto ? (
              <img
                src={user.profilePhoto}
                alt={`${user.firstName} ${user.lastName}`}
                className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                {user.firstName ? user.firstName[0] : 'I'}{user.lastName ? user.lastName[0] : 'I'}
              </div>
            )}
            <div className="min-w-0">
              <p className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                {user.firstName || 'Ian'} {user.lastName || 'Intern'}
              </p>
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-400 capitalize truncate">
                {user.role || 'Intern'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {routes.map((route) => {
          const IconComponent = getRouteIcon(route.icon);
          const isActive = location.pathname === route.path;

          return (
            <NavLink
              key={route.path}
              to={route.path}
              className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                isActive
                  ? 'bg-indigo-50 dark:bg-[#20243E] text-indigo-600 dark:text-indigo-400 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
              } ${isCollapsed ? 'justify-center px-2' : ''}`}
            >
              <IconComponent className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-400'}`} />
              {!isCollapsed && <span>{route.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Upgrade to Pro Banner */}
      {!isCollapsed && (
        <div className="p-3 mx-3 mb-2 rounded-2xl bg-gradient-to-b from-indigo-50/80 to-purple-50/80 dark:from-[#1A1D33] dark:to-[#17192C] border border-indigo-100/80 dark:border-indigo-950/60 p-3.5">
          <div className="flex items-center gap-2 mb-1.5 text-indigo-600 dark:text-indigo-400">
            <div className="p-1 rounded-lg bg-indigo-100 dark:bg-indigo-900/40">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold">Upgrade to Pro</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3 leading-snug">
            Unlock advanced learning paths and certificates.
          </p>
          <button
            onClick={() => navigate('/settings')}
            className="w-full py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            Upgrade Now
          </button>
        </div>
      )}

      {/* Bottom Footer Actions */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          title="Toggle Dark / Light Theme"
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {mode === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          {!isCollapsed && <span>Logout</span>}
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
        className={`fixed top-0 left-0 h-full bg-white dark:bg-[#121526] border-r border-slate-200/80 dark:border-slate-800/80 z-50 transition-all duration-300 ${
          isMobileOpen ? 'w-64' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};
