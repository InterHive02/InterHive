import React from 'react';
import { CheckSquare } from 'lucide-react';

export const TeamProjectsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Active Team Projects</h1>
        <p className="text-sm text-gray-500">Track industrial live-project submissions, PRs, and milestones</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700/60 p-8 text-center">
        <CheckSquare className="w-10 h-10 text-indigo-500 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">Live Project Tracking Active</h3>
        <p className="text-xs text-gray-500 max-w-md mx-auto mt-1">Review pull requests, code reviews, and milestone deliverables.</p>
      </div>
    </div>
  );
};
