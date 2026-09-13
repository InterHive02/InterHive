import React from 'react';
import { Users, UserCheck } from 'lucide-react';

export const TeamManagementPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Team & Cohort Management</h1>
        <p className="text-sm text-gray-500">Assign mentors, monitor intern progress, and organize sprint groups</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700/60 p-8 text-center">
        <Users className="w-10 h-10 text-indigo-500 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">Cohort Team Allocations</h3>
        <p className="text-xs text-gray-500 max-w-md mx-auto mt-1">Manage project groups, team leads, and mentor assignments.</p>
      </div>
    </div>
  );
};
