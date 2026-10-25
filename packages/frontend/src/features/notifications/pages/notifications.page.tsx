import React, { useState } from 'react';
import { Bell, Check, Trash2, Calendar, Award, MessageSquare, Filter, CheckCircle2 } from 'lucide-react';
import { useNotification } from '../../../api/hooks/use-notification';
import { toast } from 'react-hot-toast';

export const NotificationsPage: React.FC = () => {
  const { useNotifications, markAsRead, markAllAsRead, deleteNotification, deleteAllNotifications } = useNotification();
  const { data: notificationsData, isLoading } = useNotifications({ page: 1, limit: 30 });
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'interview' | 'project'>('all');

  const defaultNotifications = [
    {
      id: '1',
      title: 'Interview Scheduled',
      message: 'Nexus FinTech scheduled a technical interview for tomorrow at 2:00 PM.',
      createdAt: new Date().toISOString(),
      read: false,
      type: 'interview',
    },
    {
      id: '2',
      title: 'Practice Sprint Deliverable Approved',
      message: 'Your pull request for Sprint 2 (Microservices Task Engine) was reviewed and approved by mentor.',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      read: true,
      type: 'project',
    },
    {
      id: '3',
      title: 'Diagnostic Assessment Results Available',
      message: 'You scored 92% on the Full-Stack Architecture diagnostic assessment benchmark.',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      read: true,
      type: 'assessment',
    },
    {
      id: '4',
      title: 'Platform System Notice',
      message: 'Industrial cohort training module 3 syllabus and repository tasks have been published.',
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      read: true,
      type: 'system',
    },
  ];

  const [localItems, setLocalItems] = useState(defaultNotifications);

  const notifications = Array.isArray(notificationsData)
    ? notificationsData
    : (notificationsData as any)?.data || localItems;

  const handleMarkRead = (id: string) => {
    setLocalItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    markAsRead?.(id);
    toast.success('Notification marked as read');
  };

  const handleMarkAllRead = () => {
    setLocalItems((prev) => prev.map((n) => ({ ...n, read: true })));
    markAllAsRead?.();
    toast.success('All notifications marked as read');
  };

  const handleDelete = (id: string) => {
    setLocalItems((prev) => prev.filter((n) => n.id !== id));
    deleteNotification?.(id);
    toast.success('Notification removed');
  };

  const filtered = notifications.filter((item: any) => {
    if (filterType === 'unread') return !item.read;
    if (filterType === 'interview') return item.type === 'interview';
    if (filterType === 'project') return item.type === 'project';
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notification Feed</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Real-time updates on your assessments, interviews, projects, and cohort announcements
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleMarkAllRead}
            className="px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-2xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Mark All Read
          </button>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setFilterType('all')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
            filterType === 'all'
              ? 'bg-primary text-white shadow-xs'
              : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300'
          }`}
        >
          All Updates ({notifications.length})
        </button>
        <button
          onClick={() => setFilterType('unread')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
            filterType === 'unread'
              ? 'bg-primary text-white shadow-xs'
              : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300'
          }`}
        >
          Unread ({notifications.filter((n: any) => !n.read).length})
        </button>
        <button
          onClick={() => setFilterType('interview')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
            filterType === 'interview'
              ? 'bg-primary text-white shadow-xs'
              : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300'
          }`}
        >
          Interviews
        </button>
        <button
          onClick={() => setFilterType('project')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
            filterType === 'project'
              ? 'bg-primary text-white shadow-xs'
              : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300'
          }`}
        >
          Projects & Reviews
        </button>
      </div>

      <div className="space-y-3">
        {filtered.length > 0 ? (
          filtered.map((item: any) => (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition-all ${
                !item.read
                  ? 'bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-800/60 shadow-2xs'
                  : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700/60 shadow-2xs'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-3.5">
                  <div
                    className={`p-2.5 rounded-xl self-start ${
                      item.type === 'interview'
                        ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-600'
                        : item.type === 'project'
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600'
                        : 'bg-indigo-50 dark:bg-indigo-900/30 text-primary'
                    }`}
                  >
                    <Bell className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white">{item.title}</h4>
                      {!item.read && (
                        <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{item.message}</p>
                    <span className="text-[11px] text-gray-400 font-mono block pt-1">
                      {new Date(item.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {!item.read && (
                    <button
                      onClick={() => handleMarkRead(item.id)}
                      className="text-xs text-primary font-bold hover:underline cursor-pointer"
                    >
                      Mark read
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    title="Dismiss"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-xs text-gray-400 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
            No notifications matching this filter.
          </div>
        )}
      </div>
    </div>
  );
};
