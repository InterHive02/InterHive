import React from 'react';
import { Award, Plus } from 'lucide-react';

export const AdminAssessmentsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Assessment Management</h1>
          <p className="text-sm text-gray-500">Configure skill quizzes, evaluations, and grading rubrics</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700/60 p-8 text-center">
        <Award className="w-10 h-10 text-indigo-500 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">Skill Benchmark Assessments Active</h3>
        <p className="text-xs text-gray-500 max-w-md mx-auto mt-1">Full-stack, Frontend, Backend, and DevOps skill assessments are active for interns.</p>
      </div>
    </div>
  );
};
