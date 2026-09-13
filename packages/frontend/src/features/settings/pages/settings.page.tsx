import React from 'react';
import { useAuth } from '../../../api/hooks/use-auth';
import { useTheme } from '../../../core/providers/theme.provider';
import { Moon, Sun, Bell, Shield, Key } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { mode, toggleTheme } = useTheme();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Account Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Manage your profile, theme, and security preferences</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700/60 p-6 space-y-6">
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Appearance</h3>
          <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-750">
            <div className="flex items-center gap-3">
              {mode === 'dark' ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Dark Mode</p>
                <p className="text-xs text-gray-500">Toggle dark / light appearance</p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className="px-3.5 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary/90"
            >
              Switch to {mode === 'dark' ? 'Light' : 'Dark'}
            </button>
          </div>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-700 pt-6">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Security</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-750">
              <div className="flex items-center gap-3">
                <Key className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Password</p>
                  <p className="text-xs text-gray-500">Last changed recently</p>
                </div>
              </div>
              <button className="px-3.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-white">
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
