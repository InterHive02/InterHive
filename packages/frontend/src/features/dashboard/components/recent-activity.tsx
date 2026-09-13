import React from 'react';
import { Award, FolderKanban, BookOpen, ClipboardCheck, ArrowRight, Inbox } from 'lucide-react';

interface RecentActivityProps {
  activities?: Array<{
    id: string;
    type: string;
    title: string;
    description?: string;
    timestamp: any;
  }>;
}

const safeText = (val: any): string => {
  if (val === null || val === undefined) return '';
  if (typeof val === 'string' || typeof val === 'number') return String(val);
  if (val instanceof Date) {
    return val.toLocaleDateString() + ' ' + val.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  if (typeof val === 'object') {
    if (val.message) return String(val.message);
    if (val.name) return String(val.name);
    if (val.toString && typeof val.toString === 'function' && val.toString() !== '[object Object]') {
      return val.toString();
    }
    return '';
  }
  return String(val);
};

export const RecentActivity: React.FC<RecentActivityProps> = ({ activities = [] }) => {
  const hasActivities = activities && activities.length > 0;

  return (
    <div className="bg-white dark:bg-[#1A1D33] rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800/80 flex flex-col justify-between transition-colors h-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
            Recent Activity
          </h3>
          {hasActivities && (
            <button className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
              <span>View All Activity</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Activity Feed or New Intern Empty State */}
        {!hasActivities ? (
          <div className="py-12 px-4 text-center flex flex-col items-center justify-center my-auto">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-500 dark:text-indigo-400 flex items-center justify-center mb-3 shadow-2xs">
              <Inbox className="w-6 h-6" />
            </div>
            <h5 className="text-xs font-extrabold text-slate-900 dark:text-white">
              You have not done anything yet
            </h5>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium max-w-xs mt-1 leading-relaxed">
              Complete an assessment, join a project, or enroll in a training course to see your recent activities here!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((act: any, idx: number) => {
              const IconComp = act.icon || Award;
              const titleText = safeText(act.title || act.action || 'Activity');
              const descText = safeText(act.description || act.details || '');
              const timeText = safeText(act.timestamp || act.createdAt || act.date || '');

              return (
                <div key={act.id || idx} className="flex items-start gap-3.5">
                  <div className={`p-2.5 rounded-xl shrink-0 ${act.color || 'bg-purple-100 text-purple-600'}`}>
                    <IconComp className="w-4 h-4" />
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <h5 className="text-xs font-extrabold text-slate-900 dark:text-white truncate">
                      {titleText}
                    </h5>
                    {descText && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate mt-0.5">
                        {descText}
                      </p>
                    )}
                    {timeText && (
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-1">
                        {timeText}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
