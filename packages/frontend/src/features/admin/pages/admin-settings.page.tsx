import React from 'react';
import { Shield, Server, Database, Key } from 'lucide-react';
import { LandingStatsEditor } from '../../../shared/components/common/landing-stats-editor';

export const AdminSettingsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin System Settings</h1>
        <p className="text-sm text-gray-500">Security policies, Redis caching, MongoDB configuration, and API keys</p>
      </div>

      {/* Landing Page Metrics Manager */}
      <LandingStatsEditor />

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700/60 p-6 space-y-4">
        <div className="flex items-center justify-between p-3.5 bg-gray-50 dark:bg-gray-750 rounded-lg">
          <div className="flex items-center gap-3">
            <Server className="w-5 h-5 text-indigo-500" />
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Backend NestJS Cluster</p>
              <p className="text-xs text-gray-500">Node.js runtime active on port 3000</p>
            </div>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 font-medium">Running</span>
        </div>

        <div className="flex items-center justify-between p-3.5 bg-gray-50 dark:bg-gray-750 rounded-lg">
          <div className="flex items-center gap-3">
            <Database className="w-5 h-5 text-emerald-500" />
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">MongoDB & Redis Storage</p>
              <p className="text-xs text-gray-500">Connection pools healthy and synchronized</p>
            </div>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 font-medium">Connected</span>
        </div>
      </div>
    </div>
  );
};
