import React from 'react';
import { Link } from 'react-router-dom';
import { DashboardHeader } from '../components/dashboard-header';
import { Users, Calendar, CheckSquare, TrendingUp, ArrowRight, UserCheck, Briefcase, Award } from 'lucide-react';
import { LandingStatsEditor } from '../../../shared/components/common/landing-stats-editor';

export const ManagerDashboardPage: React.FC = () => {
  const stats = [
    { label: 'Active Interns in Training', value: '48', icon: Users, change: '+12%', color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' },
    { label: 'Live Projects Active', value: '14', icon: CheckSquare, change: '+3 this week', color: 'text-violet-600 bg-violet-50 dark:bg-violet-900/20' },
    { label: 'Upcoming Interviews', value: '9', icon: Calendar, change: 'Today', color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20' },
    { label: 'Ready for Placement', value: '26', icon: Award, change: 'Score > 80%', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' },
  ];

  const pendingInterviews = [
    { id: '1', intern: 'Rahul Sharma', company: 'TechCorp India', role: 'Full Stack Developer', time: '11:00 AM Today', status: 'Scheduled' },
    { id: '2', intern: 'Priya Patel', company: 'CloudWave Systems', role: 'Frontend React Dev', time: '02:30 PM Today', status: 'Scheduled' },
    { id: '3', intern: 'Aman Verma', company: 'Nexus FinTech', role: 'Backend Node.js Dev', time: '04:00 PM Tomorrow', status: 'Confirmed' },
  ];

  const activeBatches = [
    { name: 'Full-Stack 45-Day Sprint (Batch 12)', internsCount: 18, progress: 68, sprint: 'Sprint 3/4', daysRemaining: 14 },
    { name: 'Data Engineering & Analytics (Batch 04)', internsCount: 15, progress: 42, sprint: 'Sprint 2/4', daysRemaining: 26 },
    { name: 'DevOps & Cloud Workflows (Batch 08)', internsCount: 15, progress: 85, sprint: 'Sprint 4/4', daysRemaining: 6 },
  ];

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Operations & Training Management"
        subtitle="Track intern preparation sprints, live project milestones, and company interview pipelines."
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700/60">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-3">{stat.value}</p>
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 inline-block font-medium">{stat.change}</span>
            </div>
          );
        })}
      </div>

      {/* Landing Page Metrics Manager */}
      <LandingStatsEditor />

      {/* Operations Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Active Preparation Batches */}
        <div className="lg:col-span-7 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700/60 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">Active Training Sprints</h3>
            <Link to="/manager/projects" className="text-xs font-medium text-primary hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {activeBatches.map((batch, i) => (
              <div key={i} className="p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-750">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{batch.name}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {batch.internsCount} Enrolled Interns • {batch.sprint}
                    </p>
                  </div>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400">
                    {batch.daysRemaining} days left
                  </span>
                </div>

                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Curriculum Progress</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{batch.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${batch.progress}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* HR & Company Interview Pipeline */}
        <div className="lg:col-span-5 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700/60 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">Partner Interview Queue</h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600">
              Live Feed
            </span>
          </div>

          <div className="space-y-3">
            {pendingInterviews.map((item) => (
              <div key={item.id} className="p-3 rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50/40 dark:bg-gray-750 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">{item.intern}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {item.company} • {item.role}
                  </p>
                  <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-mono mt-1 block">
                    ⏰ {item.time}
                  </span>
                </div>
                <span className="text-xs px-2.5 py-1 rounded bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium">
                  {item.status}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <Link
              to="/manager/team"
              className="w-full py-2 px-3 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 hover:border-primary text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-primary flex items-center justify-center gap-1.5 transition-colors"
            >
              <UserCheck className="w-4 h-4" />
              Manage Team & Allocations
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
