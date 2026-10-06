import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LoginForm } from '../components/login-form';
import { Logo } from '../../../shared/components/common/logo';
import { useAuth } from '../../../api/hooks/use-auth';
import { LogOut, User } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[#F4F8FC] text-slate-800 font-sans relative flex flex-col justify-between overflow-x-hidden">
      
      {/* Background Ambient Glows & Curves */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-200/50 via-purple-100/30 to-transparent blur-3xl pointer-events-none -z-10"></div>

      {/* Top Simple Header */}
      <header className="px-6 py-6 max-w-7xl mx-auto w-full flex items-center justify-between">
        <Logo size="md" showSubtitle subtitle="From Intern to Industry" />

        <Link
          to="/"
          className="text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors"
        >
          ← Back to Home
        </Link>
      </header>

      {/* Main Login Card Section */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 relative z-10">
        <div className="w-full max-w-md">
          {isAuthenticated && user && (
            <div className="mb-4 p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 text-xs text-amber-900 shadow-xs flex items-center justify-between gap-3 animate-in fade-in">
              <div className="flex items-center gap-2 overflow-hidden">
                <User className="w-4 h-4 text-amber-600 shrink-0" />
                <div className="truncate">
                  <span className="font-bold">Active Session:</span> {user.email}
                </div>
              </div>
              <button
                type="button"
                onClick={() => logout()}
                className="px-3 py-1.5 rounded-xl bg-amber-200/70 hover:bg-amber-200 text-amber-900 font-bold shrink-0 transition-colors flex items-center gap-1.5 cursor-pointer text-[11px]"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Switch Account</span>
              </button>
            </div>
          )}

          <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-blue-500/5 relative overflow-hidden">
            
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>

            <LoginForm />

          </div>

          <p className="text-center text-xs text-slate-500 mt-6">
            Need help? Contact support at{' '}
            <a href="mailto:interhive.info@gmail.com" className="font-bold text-blue-600 hover:underline">
              interhive.info@gmail.com
            </a>{' '}
            or{' '}
            <a href="tel:+918278314925" className="font-bold text-blue-600 hover:underline">
              +91 82783 14925
            </a>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-6 text-center text-xs text-slate-500 border-t border-slate-200/60 bg-white/50">
        &copy; {new Date().getFullYear()} InterHive Inc. All rights reserved.
      </footer>

    </div>
  );
};
