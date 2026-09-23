import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  Bell,
  Search,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Moon,
  Sun
} from 'lucide-react';
import { useTheme } from '../../../core/providers/theme.provider';
import { NotificationBell } from '../common/notification-bell';

interface HeaderProps {
  onToggleSidebar: () => void;
  onToggleMobile: () => void;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    profilePhoto?: string;
    role: string;
  };
  unreadCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  onToggleMobile,
  user,
  unreadCount,
}) => {
  const navigate = useNavigate();
  const { mode, toggleTheme } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getUserDisplayName = () => {
    if (user.firstName) return `${user.firstName} ${user.lastName || ''}`.trim();
    switch (user.role) {
      case 'admin':
        return 'Alex Admin';
      case 'hr':
        return 'Hannah HR';
      case 'manager':
        return 'Michael Manager';
      case 'company':
        return 'TechCorp Rep';
      case 'intern':
      default:
        return 'John Intern';
    }
  };

  const getUserInitials = () => {
    if (user.firstName) {
      return `${user.firstName[0]}${user.lastName ? user.lastName[0] : ''}`.toUpperCase();
    }
    switch (user.role) {
      case 'admin':
        return 'AA';
      case 'hr':
        return 'HH';
      case 'manager':
        return 'MM';
      case 'company':
        return 'TC';
      case 'intern':
      default:
        return 'JI';
    }
  };

  return (
    <header className="bg-white dark:bg-[#121526] border-b border-slate-200/80 dark:border-slate-800/80 sticky top-0 z-30 transition-colors">
      <div className="flex items-center justify-between px-4 lg:px-6 py-3">
        
        {/* Left Section: Menu Toggle + Search */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="hidden lg:block p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <button
            onClick={onToggleMobile}
            className="lg:hidden p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Header Search Bar */}
          <div className="hidden sm:flex items-center relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search anything..."
              className="pl-10 pr-4 py-2 bg-slate-100/80 dark:bg-[#1A1D33] border border-slate-200/60 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 w-48 sm:w-64 lg:w-80 transition-all shadow-inner"
            />
          </div>
        </div>

        {/* Right Section: Notifications + User Dropdown */}
        <div className="flex items-center gap-3">
          
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
            title={mode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {mode === 'dark' ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </button>

          {/* Notifications Bell */}
          <NotificationBell count={unreadCount ?? 3} />

          {/* User Profile Pill Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
            >
              {user.profilePhoto ? (
                <img
                  src={user.profilePhoto}
                  alt={getUserDisplayName()}
                  width={32}
                  height={32}
                  loading="lazy"
                  decoding="async"
                  className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-2xs">
                  {getUserInitials()}
                </div>
              )}
              
              <span className="hidden md:inline-block font-extrabold text-xs text-slate-800 dark:text-white">
                {getUserDisplayName()}
              </span>

              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#1A1D33] rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-800 py-1.5 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                  <p className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {getUserDisplayName()}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{user.email}</p>
                  <span className="inline-block px-2 py-0.5 mt-1.5 text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 rounded-md capitalize">
                    {user.role}
                  </span>
                </div>

                <Link
                  to="/profile"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/60 transition-colors"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  Profile
                </Link>

                <Link
                  to="/settings"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/60 transition-colors"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  Settings
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30 transition-colors border-t border-slate-100 dark:border-slate-800 mt-1"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
