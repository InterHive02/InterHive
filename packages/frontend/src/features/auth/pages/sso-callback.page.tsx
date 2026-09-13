import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const SsoCallbackPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/dashboard', { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      <p className="text-sm font-semibold text-slate-300">Completing Sign-In...</p>
    </div>
  );
};
