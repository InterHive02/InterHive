import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RegisterForm } from '../components/register-form';
import { Logo } from '../../../shared/components/common/logo';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const hasLocalToken = typeof window !== 'undefined' && !!localStorage.getItem('accessToken');

  useEffect(() => {
    if (hasLocalToken) {
      navigate('/dashboard', { replace: true });
    }
  }, [hasLocalToken, navigate]);

  return (
    <div className="min-h-screen bg-[#F4F8FC] text-slate-800 font-sans relative flex flex-col justify-between overflow-x-hidden">
      
      {/* Background Ambient Glows & Curves */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-200/50 via-purple-100/30 to-transparent blur-3xl pointer-events-none -z-10"></div>

      {/* Top Header */}
      <header className="px-6 py-6 max-w-7xl mx-auto w-full flex items-center justify-between">
        <Logo size="md" showSubtitle subtitle="From Intern to Industry" />

        <Link
          to="/"
          className="text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors"
        >
          ← Back to Home
        </Link>
      </header>

      {/* Main Register Card Section */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 relative z-10">
        <div className="w-full max-w-lg">
          <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-blue-500/5 relative overflow-hidden">
            
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none"></div>

            <RegisterForm />

          </div>

          <p className="text-center text-xs text-slate-500 mt-6">
            Need help? Contact support at{' '}
            <a href="mailto:interhive.info@gmail.com" className="font-bold text-blue-600 hover:underline">
              interhive.info@gmail.com
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
