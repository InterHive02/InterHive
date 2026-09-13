import React, { useState, useEffect, useMemo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { useAuth } from '../../../api/hooks/use-auth';
import { useNotification } from '../../../api/hooks/use-notification';
import { useIntern } from '../../../api/hooks/use-intern';
import { ChangePasswordModal } from '../../../features/auth/components/change-password-modal';

export const MainLayout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user: authUser } = useAuth();
  const { useUnreadCount } = useNotification();
  const { data: unreadCount } = useUnreadCount();
  const location = useLocation();

  // Fetch intern profile to get updated name/photo
  const { useProfile } = useIntern();
  const { data: internProfile } = useProfile();

  // Active user profile from authUser or localStorage fallback
  const localUserStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
  const localUser = localUserStr ? JSON.parse(localUserStr) : null;
  const baseUser = authUser || localUser;

  // Merge profile data over auth data so sidebar/header show updated names
  const activeUser = useMemo(() => {
    if (!baseUser) return baseUser;
    const profileFirstName = internProfile?.personalInfo?.firstName;
    const profileLastName = internProfile?.personalInfo?.lastName;
    const profilePhoto = internProfile?.personalInfo?.profilePhoto;
    return {
      ...baseUser,
      ...(profileFirstName ? { firstName: profileFirstName } : {}),
      ...(profileLastName ? { lastName: profileLastName } : {}),
      ...(profilePhoto ? { profilePhoto } : {}),
    };
  }, [baseUser, internProfile]);

  // First-login password change state
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState<boolean>(
    Boolean(activeUser?.mustChangePassword),
  );

  useEffect(() => {
    if (activeUser?.mustChangePassword) {
      setIsPasswordModalOpen(true);
    }
  }, [activeUser?.mustChangePassword]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarCollapsed(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] dark:bg-[#0B0D18] text-slate-800 dark:text-slate-100 transition-colors">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        user={activeUser}
      />

      <div
        className={`transition-all duration-300 ${
          isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
        }`}
      >
        <Header
          onToggleSidebar={toggleSidebar}
          onToggleMobile={toggleMobileMenu}
          user={activeUser}
          unreadCount={unreadCount || 0}
        />

        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto min-h-[calc(100vh-140px)]">
          <Outlet />
        </main>
      </div>

      {/* Forced First-Login Password Change Modal */}
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onPasswordChanged={() => setIsPasswordModalOpen(false)}
      />
    </div>
  );
};
