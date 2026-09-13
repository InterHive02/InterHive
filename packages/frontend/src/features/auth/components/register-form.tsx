import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Mail, Lock, User, KeyRound, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../../../api/hooks/use-auth';
import { registerSchema, RegisterFormData } from '../validations/auth.validation';
import { authApi } from '../../../api/endpoints/auth.api';
import { toast } from 'react-hot-toast';
import { GoogleAuthModal } from './google-auth-modal';
import { signInWithFirebaseGoogle } from '../../../core/config/firebase.config';

export const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const { register: registerUser, isRegistering } = useAuth();

  const [authMode, setAuthMode] = useState<'password' | 'otp'>('password');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState<'intern' | 'company'>('intern');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  // OTP State for Gmail Registration
  const [otpEmail, setOtpEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    setError,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'intern',
    },
  });

  const handleRoleChange = (selectedRole: 'intern' | 'company') => {
    setRole(selectedRole);
    setValue('role', selectedRole);
  };

  // Standard Email/Password Register Submit
  const onSubmit = async (data: RegisterFormData) => {
    setOtpError(null);
    try {
      const { confirmPassword, ...registerPayload } = data;
      await registerUser(registerPayload as any);
      toast.success('Registration successful! Please sign in.');
      navigate('/login', { state: { email: data.email } });
    } catch (error: any) {
      const errMsg = error.response?.data?.message || 'Registration failed. Please try again.';
      if (errMsg.toLowerCase().includes('already exists') || error.response?.status === 409) {
        setError('email', { message: 'This email is already registered. Please sign in instead.' });
        toast.error('Account already exists with this email! Redirecting to Sign In...');
        setTimeout(() => {
          navigate('/login', { state: { email: data.email } });
        }, 1500);
      } else if (errMsg.toLowerCase().includes('otp') || errMsg.toLowerCase().includes('verification') || error.status === 500) {
        setOtpError('Use another method to register');
      } else {
        setError('root', { message: errMsg });
      }
    }
  };

  // Handle Send Gmail OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError(null);
    if (!otpEmail || !otpEmail.includes('@')) {
      toast.error('Please enter a valid Gmail / Email address.');
      return;
    }
    setIsSendingOtp(true);
    try {
      await authApi.sendOtp(otpEmail);
      setOtpSent(true);
      toast.success(`Verification code sent to ${otpEmail}! Check your inbox.`);
    } catch (err: any) {
      setOtpError('Use another method to register');
      toast.error('OTP dispatch failed. Please use standard password registration.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Handle Verify Gmail OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError(null);
    if (!otpCode || otpCode.trim().length !== 6) {
      toast.error('Please enter the full 6-digit code.');
      return;
    }
    setIsVerifyingOtp(true);
    try {
      const response = await authApi.verifyOtp(otpEmail, otpCode.trim());
      const payload = response.data || response;
      const { user, accessToken, refreshToken } = payload;
      if (accessToken) localStorage.setItem('accessToken', accessToken);
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
      if (user) localStorage.setItem('user', JSON.stringify(user));
      toast.success('Gmail Verified & Account Created! Logging in...');
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setOtpError('Use another method to register');
      toast.error(err.response?.data?.message || 'Invalid or expired OTP code.');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // Firebase Google Sign-Up Handler
  const handleGoogleSignUp = async () => {
    if (localStorage.getItem('accessToken')) {
      navigate('/dashboard', { replace: true });
      return;
    }

    setIsGoogleLoading(true);
    try {
      const result = await signInWithFirebaseGoogle();
      if (result?.user?.email) {
        const response = await authApi.googleLogin({
          email: result.user.email,
          name: result.user.displayName || result.user.email.split('@')[0],
          picture: result.user.photoURL || undefined,
        });

        const payload = (response as any)?.data?.data ?? (response as any)?.data ?? response;
        const { user, accessToken, refreshToken } = payload;

        if (accessToken) localStorage.setItem('accessToken', accessToken);
        if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
        if (user) localStorage.setItem('user', JSON.stringify(user));

        toast.success(`Google Sign-Up Successful! Welcome, ${user?.firstName || 'User'}!`);
        navigate('/dashboard', { replace: true });
      }
    } catch (err: any) {
      if (err?.code === 'auth/popup-closed-by-user') {
        toast.error('Google Sign-Up canceled.');
      } else {
        console.warn('Firebase popup error, opening modal fallback:', err);
        setIsGoogleModalOpen(true);
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="w-full space-y-5">
      <GoogleAuthModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        title="Sign Up with Google"
      />

      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Create Account
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-slate-500 font-medium">
          Join InterHive and start your journey to industry readiness
        </p>
      </div>

      {/* Google Sign Up Button */}
      <div>
        <button
          type="button"
          onClick={handleGoogleSignUp}
          disabled={isGoogleLoading}
          className="w-full py-3 px-4 bg-white hover:bg-slate-50 text-slate-700 font-bold border border-slate-200 rounded-2xl shadow-xs flex items-center justify-center gap-3 transition-all hover:shadow-md disabled:opacity-50 text-sm cursor-pointer"
        >
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Sign up with Google</span>
        </button>
      </div>

      {/* Divider */}
      <div className="relative flex items-center justify-center my-2">
        <div className="border-t border-slate-200 w-full" />
        <span className="bg-white px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider absolute">
          OR REGISTER WITH EMAIL
        </span>
      </div>

      {/* Registration Mode Toggle Tabs */}
      <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100/80 rounded-xl text-xs font-bold my-3">
        <button
          type="button"
          onClick={() => setAuthMode('password')}
          className={`py-2 rounded-lg transition-all ${
            authMode === 'password'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Password Form
        </button>
        <button
          type="button"
          onClick={() => setAuthMode('otp')}
          className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            authMode === 'otp'
              ? 'bg-white text-blue-600 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <KeyRound className="w-3.5 h-3.5" />
          <span>Gmail OTP Verification</span>
        </button>
      </div>

      {/* Mode 1: Standard Password Registration Form */}
      {authMode === 'password' && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {errors.root && (
            <div className="p-3 text-xs sm:text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl font-medium">
              {errors.root.message}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                First Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  {...register('firstName')}
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all shadow-2xs"
                  placeholder="John"
                />
              </div>
              {errors.firstName && (
                <p className="mt-1 text-[11px] text-red-600 font-medium">{errors.firstName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Last Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  {...register('lastName')}
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all shadow-2xs"
                  placeholder="Doe"
                />
              </div>
              {errors.lastName && (
                <p className="mt-1 text-[11px] text-red-600 font-medium">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                {...register('email')}
                type="email"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all shadow-2xs"
                placeholder="you@example.com"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-[11px] text-red-600 font-medium">{errors.email.message}</p>
            )}
          </div>

          <input {...register('role')} type="hidden" value="intern" />

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all shadow-2xs"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-[11px] text-red-600 font-medium">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                {...register('confirmPassword')}
                type={showConfirmPassword ? 'text' : 'password'}
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all shadow-2xs"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-[11px] text-red-600 font-medium">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isRegistering}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm mt-2 cursor-pointer"
          >
            {isRegistering ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating account...
              </span>
            ) : (
              'Create Account'
            )}
          </button>
        </form>
      )}

      {/* Mode 2: Gmail OTP Verification System */}
      {authMode === 'otp' && (
        <div className="space-y-4">
          {otpError && (
            <div className="p-3.5 bg-amber-50/90 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-0.5 font-medium shadow-2xs">
              <div className="font-extrabold text-amber-950 text-xs uppercase tracking-wide">
                Use another method to register
              </div>
              <div className="text-amber-800 font-semibold">
                This method is not available right now.
              </div>
            </div>
          )}

          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Gmail / Work Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={otpEmail}
                    onChange={(e) => setOtpEmail(e.target.value)}
                    required
                    placeholder="you@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSendingOtp}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-md hover:opacity-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <KeyRound className="w-4 h-4" />
                <span>{isSendingOtp ? 'Sending 6-Digit Code...' : 'Send 6-Digit Code to Gmail'}</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4 animate-in fade-in">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
                <span>Enter 6-digit verification code sent to <strong>{otpEmail}</strong></span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  6-Digit Verification Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="123456"
                  required
                  className="w-full tracking-[12px] text-center text-2xl font-black py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500/40 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isVerifyingOtp}
                className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold rounded-xl shadow-md hover:opacity-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <span>{isVerifyingOtp ? 'Verifying OTP...' : 'Verify OTP & Register'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setOtpSent(false)}
                className="w-full text-xs font-bold text-slate-500 hover:text-slate-700 text-center block pt-1"
              >
                ← Change Email Address
              </button>
            </form>
          )}
        </div>
      )}

      <p className="text-xs text-center text-slate-500 font-medium">
        Already have an account?{' '}
        <Link to="/login" className="font-bold text-blue-600 hover:text-blue-700">
          Sign in
        </Link>
      </p>
    </div>
  );
};
