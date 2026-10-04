import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RegisterForm } from '../components/register-form';
import { LoginForm } from '../components/login-form';
import { Logo } from '../../../shared/components/common/logo';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'signup' | 'signin'>('signup');

  const hasLocalToken =
    typeof window !== 'undefined' && !!localStorage.getItem('accessToken');

  useEffect(() => {
    if (hasLocalToken) {
      navigate('/dashboard', { replace: true });
    }
  }, [hasLocalToken, navigate]);

  return (
    <div className="min-h-screen bg-[#F4F8FC] text-slate-800 font-sans relative flex flex-col justify-between overflow-x-hidden">

      {/* ── Ambient gradient glow ── */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-300/40 via-indigo-200/25 to-transparent blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-300/20 via-transparent to-transparent blur-3xl" />
      </div>

      {/* ── Header ── */}
      <header className="px-5 py-5 max-w-7xl mx-auto w-full flex items-center justify-between shrink-0">
        <Logo size="md" showSubtitle subtitle="From Intern to Industry" />
        <Link
          to="/"
          className="text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
        >
          ← Back to Home
        </Link>
      </header>

      {/* ── Two-column layout ── */}
      <main className="flex-1 flex items-start justify-center px-4 py-6 relative z-10">
        <div className="w-full max-w-5xl flex flex-col lg:flex-row items-center lg:items-stretch gap-8 lg:gap-12">

          {/* ── LEFT: Pitch panel ── */}
          <div className="hidden lg:flex flex-col justify-center flex-1 pr-6">
            {/* Badge */}
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-blue-100 text-blue-700 mb-6 w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse inline-block" />
              PPO Track · Now Open
            </span>

            <h1 className="text-4xl xl:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
              Start Your Journey<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                From Intern
              </span>{' '}
              to Industry
            </h1>

            <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8 max-w-sm">
              Join hundreds of students already on the InterHive PPO Track —
              real training, real companies, real career opportunities.
            </p>

            {/* Feature bullets */}
            <div className="space-y-4">
              {[
                { emoji: '🎓', title: '2-Month Structured Training', desc: 'Industry-standard curriculum built with top engineers' },
                { emoji: '🏢', title: '4-Month Company Internship', desc: 'Work on live projects with vetted partner companies' },
                { emoji: '🏆', title: 'PPO Opportunity', desc: 'Top performers receive Pre-Placement Offers' },
              ].map(f => (
                <div key={f.title} className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center shrink-0 text-lg">
                    {f.emoji}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{f.title}</p>
                    <p className="text-xs text-slate-500 font-medium">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Proof bar */}
            <div className="mt-8 pt-6 border-t border-slate-200 flex items-center gap-6">
              {[
                { num: '500+', label: 'Students placed' },
                { num: '50+', label: 'Partner companies' },
                { num: '4.9★', label: 'Student rating' },
              ].map(s => (
                <div key={s.label}>
                  <p className="text-xl font-black text-slate-900">{s.num}</p>
                  <p className="text-[11px] text-slate-400 font-semibold">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Auth card ── */}
          <div className="w-full lg:w-[420px] shrink-0">
            <div className="bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-3xl shadow-2xl shadow-blue-500/5 overflow-hidden">

              {/* Tab switcher */}
              <div className="flex border-b border-slate-100">
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className={`flex-1 py-4 text-sm font-bold transition-all cursor-pointer ${
                    mode === 'signup'
                      ? 'text-blue-600 bg-blue-50/60 border-b-2 border-blue-600'
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Create Account
                </button>
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className={`flex-1 py-4 text-sm font-bold transition-all cursor-pointer ${
                    mode === 'signin'
                      ? 'text-blue-600 bg-blue-50/60 border-b-2 border-blue-600'
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Sign In
                </button>
              </div>

              {/* Form body */}
              <div className="p-6 sm:p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />

                {mode === 'signup' ? (
                  <RegisterForm />
                ) : (
                  <LoginForm />
                )}
              </div>
            </div>

            {/* Footer note */}
            <p className="text-center text-[11px] text-slate-400 font-medium mt-4">
              Need help?{' '}
              <a
                href="mailto:interhive.info@gmail.com"
                className="text-blue-600 hover:underline font-bold"
              >
                interhive.info@gmail.com
              </a>
            </p>
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="py-5 px-6 text-center text-xs text-slate-400 border-t border-slate-200/60 bg-white/40 shrink-0">
        © {new Date().getFullYear()} InterHive Inc. All rights reserved. &nbsp;·&nbsp;
        <Link to="/privacy" className="hover:text-blue-600 transition-colors">Privacy</Link>
        &nbsp;·&nbsp;
        <Link to="/terms" className="hover:text-blue-600 transition-colors">Terms</Link>
      </footer>
    </div>
  );
};
