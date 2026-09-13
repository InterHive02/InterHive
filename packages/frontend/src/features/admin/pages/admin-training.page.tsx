import React from 'react';
import { BookOpen, Plus } from 'lucide-react';

export const AdminTrainingPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Training Programs Admin</h1>
          <p className="text-sm text-gray-500">Manage 30-day, 45-day, and 60-day industrial training tracks</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700/60 p-8 text-center">
        <BookOpen className="w-10 h-10 text-indigo-500 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">Active Curriculum Tracks</h3>
        <p className="text-xs text-gray-500 max-w-md mx-auto mt-1">3 Tracks active: 45-Day Full Stack Accelerator, Data Engineering Track, and Cloud DevOps Cohort.</p>
      </div>
    </div>
  );
};
