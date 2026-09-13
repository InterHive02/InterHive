import React from 'react';
import {
  TrendingUp,
  Award,
  BookOpen,
  ClipboardCheck,
  Calendar
} from 'lucide-react';

interface ReadinessScoreCardProps {
  score: number;
  breakdown: Record<string, number>;
  trend?: number;
  skillsCompleted?: number;
  totalSkills?: number;
  activeTasksCount?: number;
  upcomingDeadlinesCount?: number;
}

export const ReadinessScoreCard: React.FC<ReadinessScoreCardProps> = ({
  score = 0,
  breakdown = {},
  trend = 0,
  skillsCompleted = 0,
  totalSkills = 0,
  activeTasksCount = 0,
  upcomingDeadlinesCount = 0,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      
      {/* Card 1: Industry Readiness Score */}
      <div className="bg-white dark:bg-[#1A1D33] rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-100 dark:border-slate-800/80 flex flex-col justify-between transition-colors">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Industry Readiness Score
            </h4>
            
            <div className="mt-3 flex items-baseline gap-1.5">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                {score}
              </span>
              <span className="text-xs font-semibold text-slate-400">/ 100</span>
              <span className="inline-flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400 ml-1.5">
                <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                {trend}%
              </span>
            </div>

            <p className="text-xs font-bold text-red-500 mt-1">
              Needs Improvement
            </p>
          </div>

          <div className="p-3 bg-purple-100 dark:bg-purple-950/60 rounded-2xl text-purple-600 dark:text-purple-400 shrink-0">
            <Award className="w-6 h-6" />
          </div>
        </div>

        {/* Segmented Progress Bar */}
        <div className="mt-4 pt-2">
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((seg) => {
              const activeSegs = Math.round((score / 100) * 8);
              return (
                <div
                  key={seg}
                  className={`h-1.5 flex-1 rounded-full transition-colors ${
                    seg <= activeSegs
                      ? 'bg-purple-600'
                      : 'bg-slate-100 dark:bg-slate-800'
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Card 2: Skills Completed */}
      <div className="bg-white dark:bg-[#1A1D33] rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-100 dark:border-slate-800/80 flex flex-col justify-between transition-colors">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Skills Completed
            </h4>
            
            <div className="mt-3 flex items-baseline gap-1.5">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                {skillsCompleted}
              </span>
              <span className="text-xs font-semibold text-slate-400">of {totalSkills}</span>
            </div>

            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
              of {totalSkills}
            </p>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Keep learning!
            </p>
          </div>

          <div className="p-3 bg-emerald-100 dark:bg-emerald-950/60 rounded-2xl text-emerald-600 dark:text-emerald-400 shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Card 3: Active Tasks */}
      <div className="bg-white dark:bg-[#1A1D33] rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-100 dark:border-slate-800/80 flex flex-col justify-between transition-colors">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Active Tasks
            </h4>
            
            <div className="mt-3">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                {activeTasksCount}
              </span>
            </div>

            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
              Tasks pending
            </p>
            <p className="text-xs font-bold text-amber-600 dark:text-amber-400">
              Stay consistent!
            </p>
          </div>

          <div className="p-3 bg-amber-100 dark:bg-amber-950/60 rounded-2xl text-amber-600 dark:text-amber-400 shrink-0">
            <ClipboardCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Card 4: Upcoming Deadlines */}
      <div className="bg-white dark:bg-[#1A1D33] rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-100 dark:border-slate-800/80 flex flex-col justify-between transition-colors">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Upcoming Deadlines
            </h4>
            
            <div className="mt-3">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                {upcomingDeadlinesCount}
              </span>
            </div>

            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
              No upcoming deadlines
            </p>
            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              Great! You're all caught up.
            </p>
          </div>

          <div className="p-3 bg-teal-100 dark:bg-teal-950/60 rounded-2xl text-teal-600 dark:text-teal-400 shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
        </div>
      </div>

    </div>
  );
};
