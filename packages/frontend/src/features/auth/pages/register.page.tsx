import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Lock, Sparkles, CheckCircle2 } from 'lucide-react';
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
      
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-200/50 via-purple-100/30 to-transparent blur-3xl pointer-events-none -z-10"></div>

      {/* Header */}
      <header className="px-6 py-6 max-w-7xl mx-auto w-full flex items-center justify-between">
        <Logo size="md" showSubtitle subtitle="From Intern to Industry" />

        <Link
          to="/"
          className="text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors"
        >
          ← Back to Home
        </Link>
      </header>

      {/* Main Notice Card */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 relative z-10">
        <div className="w-full max-w-md">
          <div className="bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-blue-500/5 relative overflow-hidden text-center">
            
            <div className="w-16 h-16 mx-auto rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5 shadow-inner">
              <Lock className="w-8 h-8" />
            </div>

            <div className="inline-block px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-700 mb-3">
              Controlled-Access Platform
            </div>

            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Invite-Only Access
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              Public self-registration is disabled. InterHive accounts are created exclusively by the HR/Admin team after candidate evaluation and official selection.
            </p>

            <div className="my-6 p-4 rounded-2xl bg-slate-50 border border-slate-200/60 text-left text-xs text-slate-600 space-y-2">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" /> How to get access?
              </div>
              <p>1. Submit your application through our public internship portal.</p>
              <p>2. Complete the technical screening and interview process with HR.</p>
              <p>3. Once selected, your official credentials will be generated and delivered to your email.</p>
            </div>

            <div className="space-y-3">
              <Link
                to="/"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-extrabold text-sm text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:shadow-lg hover:shadow-indigo-500/25 transition-all"
              >
                <span>Apply for Internship</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/login"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs text-slate-700 hover:bg-slate-100 border border-slate-200 transition-all"
              >
                <span>Existing User? Login Here</span>
              </Link>
            </div>

          </div>

          <p className="text-center text-xs text-slate-500 mt-6">
            Need assistance? Reach out to{' '}
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
