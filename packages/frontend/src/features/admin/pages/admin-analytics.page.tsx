import React from 'react';
import { TrendingUp, Users, Building2, Award } from 'lucide-react';

export const AdminAnalyticsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Platform Analytics & Growth</h1>
        <p className="text-sm text-gray-500">Placement conversion rates, partner retention, and student progress metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700/60 p-6">
          <p className="text-xs text-gray-400 font-semibold">Placement Rate</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">87.4%</p>
          <span className="text-xs text-emerald-600 font-medium mt-1 inline-block">+4.2% this month</span>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700/60 p-6">
          <p className="text-xs text-gray-400 font-semibold">Avg Days to Hire</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">18 Days</p>
          <span className="text-xs text-indigo-600 font-medium mt-1 inline-block">Industry leading speed</span>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700/60 p-6">
          <p className="text-xs text-gray-400 font-semibold">Candidate Readiness Score</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">89/100</p>
          <span className="text-xs text-emerald-600 font-medium mt-1 inline-block">High satisfaction</span>
        </div>
      </div>
    </div>
  );
};
