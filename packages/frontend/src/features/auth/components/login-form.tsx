import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useAuth } from '../../../api/hooks/use-auth';
import { loginSchema, LoginFormData } from '../validations/auth.validation';
import { SVGMascot } from './svg-mascot';

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const prefilledEmail = (location.state as any)?.email || '';

  const { login, isLoggingIn } = useAuth();
  
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: prefilledEmail,
    },
  });

  const emailValue = watch('email') || '';

  // Password Login Submit
  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
      navigate('/dashboard', { replace: true });
    } catch (error: any) {
      setError('root', {
        message: error.response?.data?.message || 'Login failed. Please check your credentials.',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Animated Mascot */}
      <SVGMascot
        isPasswordFocused={isPasswordFocused}
        showPassword={showPassword}
        emailLength={emailValue.length}
      />

      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Welcome Back
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-slate-500 font-medium">
          Sign in to continue your journey from intern to industry-ready
        </p>
      </div>

      {/* Direct Password Login Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {errors.root && (
          <div className="p-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl font-medium">
            {errors.root.message}
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              {...register('email')}
              id="email"
              type="email"
              autoComplete="email"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all shadow-2xs"
              placeholder="you@example.com"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs text-red-600 font-medium">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              {...register('password')}
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)}
              className="w-full pl-10 pr-10 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all shadow-2xs"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-red-600 font-medium">{errors.password.message}</p>
          )}
        </div>

        <div className="flex items-center justify-between text-xs font-medium">
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
            />
            <label htmlFor="remember-me" className="ml-2 text-slate-600 cursor-pointer">
              Remember me
            </label>
          </div>
          <Link
            to="/forgot-password"
            className="font-bold text-blue-600 hover:text-blue-700"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoggingIn}
          className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 transition-all disabled:opacity-50 text-sm cursor-pointer"
        >
          {isLoggingIn ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Signing in...</span>
            </div>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      {/* Controlled-Access Platform Footer Notice */}
      <div className="pt-4 border-t border-slate-100 text-center space-y-1">
        <p className="text-[11px] text-slate-400 font-medium">
          Controlled-Access Platform • Accounts are provisioned by HR
        </p>
        <Link to="/" className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-block">
          Want an internship? Submit application form →
        </Link>
      </div>
    </div>
  );
};
