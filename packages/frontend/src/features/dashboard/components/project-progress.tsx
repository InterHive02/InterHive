import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderKanban } from 'lucide-react';

interface ProjectProgressProps {
  projects?: Array<{
    id: string;
    title: any;
    progress: number;
    status: string;
    deadline?: any;
  }>;
}

export const ProjectProgress: React.FC<ProjectProgressProps> = ({ projects = [] }) => {
  const navigate = useNavigate();

  const totalCount = projects.length;
  const completedCount = projects.filter(p => p.status === 'completed').length;
  const inProgressCount = projects.filter(p => p.status === 'in_progress' || p.status === 'active').length;
  const reviewCount = projects.filter(p => p.status === 'review').length;
  const notStartedCount = totalCount - (completedCount + inProgressCount + reviewCount);

  const overallProgressPercent = totalCount > 0 
    ? Math.round(projects.reduce((acc, p) => acc + (Number(p.progress) || 0), 0) / totalCount) 
    : 0;

  return (
    <div className="bg-white dark:bg-[#1A1D33] rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800/80 flex flex-col justify-between transition-colors h-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
            Project Progress
          </h3>
          <span className="text-xs font-semibold text-slate-400">
            {completedCount} / {totalCount} completed
          </span>
        </div>

        {/* Donut Chart & Status Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center my-4">
          
          {/* Radial Donut Progress Ring */}
          <div className="relative flex items-center justify-center">
            <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="48"
                className="text-slate-100 dark:text-slate-800"
                strokeWidth="12"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="60"
                cy="60"
                r="48"
                className="text-indigo-600 dark:text-indigo-400 transition-all duration-700 ease-out"
                strokeWidth="12"
                strokeDasharray={2 * Math.PI * 48}
                strokeDashoffset={2 * Math.PI * 48 * (1 - overallProgressPercent / 100)}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>

            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-slate-900 dark:text-white leading-tight">
                {overallProgressPercent}%
              </span>
              <span className="text-[10px] font-bold text-slate-400">
                {totalCount === 0 ? 'No Projects' : 'Overall Progress'}
              </span>
            </div>
          </div>

          {/* Status Breakdown Legend List */}
          <div className="space-y-3 text-xs font-semibold">
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                <span>Not Started</span>
              </div>
              <span className="font-bold text-slate-900 dark:text-white">{notStartedCount}</span>
            </div>

            <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span>In Progress</span>
              </div>
              <span className="font-bold text-slate-900 dark:text-white">{inProgressCount}</span>
            </div>

            <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Review</span>
              </div>
              <span className="font-bold text-slate-900 dark:text-white">{reviewCount}</span>
            </div>

            <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Completed</span>
              </div>
              <span className="font-bold text-slate-900 dark:text-white">{completedCount}</span>
            </div>
          </div>

        </div>
      </div>

      {/* Outlined Purple Button */}
      <div className="mt-6 pt-2">
        <button
          onClick={() => navigate('/projects')}
          className="w-full py-2.5 px-4 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold text-xs hover:bg-indigo-100 dark:hover:bg-indigo-950/80 transition-colors"
        >
          {totalCount === 0 ? 'Explore Projects & Tasks' : 'View All Projects'}
        </button>
      </div>
    </div>
  );
};
