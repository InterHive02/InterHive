import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../../api/hooks/use-auth';

export const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { verifyEmail, isVerifyingEmail } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      return;
    }
    verifyEmail(token)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'));
  }, [token]);

  return (
    <div className="w-full max-w-md text-center py-6 space-y-6">
      {status === 'loading' && (
        <div className="space-y-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Verifying your email...</h2>
          <p className="text-sm text-gray-500">Please wait a moment.</p>
        </div>
      )}

      {status === 'success' && (
        <div className="space-y-4">
          <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Email Verified!</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Your InterHive account is now fully verified.
          </p>
          <Link
            to="/login"
            className="inline-block px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-semibold transition-all"
          >
            Continue to Sign In
          </Link>
        </div>
      )}

      {status === 'error' && (
        <div className="space-y-4">
          <AlertCircle className="w-14 h-14 text-amber-500 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Verification Link Expired</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            This verification link is invalid or has expired.
          </p>
          <Link
            to="/login"
            className="inline-block px-6 py-2.5 bg-gray-900 dark:bg-gray-700 text-white rounded-lg text-sm font-semibold"
          >
            Return to Login
          </Link>
        </div>
      )}
    </div>
  );
};
