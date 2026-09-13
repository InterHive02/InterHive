import React from 'react';
import { Bell, Check, Trash2, Calendar, Award, MessageSquare } from 'lucide-react';
import { useNotification } from '../../../api/hooks/use-notification';

export const NotificationsPage: React.FC = () => {
  const { useNotifications, markAsRead, markAllAsRead, clearAll } = useNotification();
  const { data: notificationsData, isLoading } = useNotifications();

  const notifications = Array.isArray(notificationsData)
    ? notificationsData
    : (notificationsData as any)?.data || [
        { id: '1', title: 'Interview Scheduled', message: 'Nexus FinTech scheduled a technical interview for tomorrow at 2:00 PM.', createdAt: new Date().toISOString(), read: false, type: 'interview' },
        { id: '2', title: 'Project Milestone Approved', message: 'Your pull request for Sprint 2 was reviewed and approved by mentor.', createdAt: new Date(Date.now() - 3600000).toISOString(), read: true, type: 'project' },
        { id: '3', title: 'Assessment Results Available', message: 'You scored 92% on the React & TypeScript practical assessment.', createdAt: new Date(Date.now() - 86400000).toISOString(), read: true, type: 'assessment' },
      ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Stay updated on your training, projects, and interviews</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => markAllAsRead?.()}
            className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50"
          >
            Mark all read
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {notifications.map((item: any) => (
          <div
            key={item.id}
            className={`p-4 rounded-xl border transition-all ${
              !item.read
                ? 'bg-indigo-50/40 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-800/50'
                : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700/60'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-3.5">
                <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-primary self-start">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{item.title}</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">{item.message}</p>
                  <span className="text-[11px] text-gray-400 font-mono mt-2 block">
                    {new Date(item.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
              {!item.read && (
                <button
                  onClick={() => markAsRead?.(item.id)}
                  className="text-xs text-primary font-medium hover:underline shrink-0"
                >
                  Mark read
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
