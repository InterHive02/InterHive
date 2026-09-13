import React from 'react';
import { Megaphone, Calendar, Clock, Pin, Bell, AlertCircle, CheckCircle } from 'lucide-react';

interface AnnouncementListProps {
  announcements: {
    id: string;
    title: string;
    content: string;
    type: 'general' | 'urgent' | 'event' | 'update';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    isPinned?: boolean;
    createdBy: { firstName: string; lastName: string; profilePhoto?: string };
    createdAt: Date;
    expiresAt?: Date;
    readBy: string[];
    attachments?: { name: string; url: string }[];
  }[];
  userId: string;
  onMarkAsRead?: (id: string) => void;
  onPin?: (id: string) => void;
}

export const AnnouncementList: React.FC<AnnouncementListProps> = ({
  announcements,
  userId,
  onMarkAsRead,
  onPin,
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400 border-red-500';
      case 'high':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400 border-orange-500';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400 border-yellow-500';
      default:
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border-blue-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'urgent':
        return <AlertCircle className="w-5 h-5" />;
      case 'event':
        return <Calendar className="w-5 h-5" />;
      case 'update':
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <Megaphone className="w-5 h-5" />;
    }
  };

  const getTypeLabel = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const isRead = (announcement: any) => {
    return announcement.readBy.includes(userId);
  };

  const sortedAnnouncements = [...announcements].sort((a, b) => {
    // Pinned first
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    // Then by priority
    const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
    if (priorityOrder[a.priority as keyof typeof priorityOrder] !== 
        priorityOrder[b.priority as keyof typeof priorityOrder]) {
      return priorityOrder[a.priority as keyof typeof priorityOrder] - 
             priorityOrder[b.priority as keyof typeof priorityOrder];
    }
    // Then by date
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="space-y-4">
      {sortedAnnouncements.map((announcement) => (
        <div
          key={announcement.id}
          className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border-l-4 ${getPriorityColor(announcement.priority)} p-4 ${
            !isRead(announcement) ? 'border border-gray-200 dark:border-gray-700' : 'opacity-75'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              {getTypeIcon(announcement.type)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {announcement.title}
                  </h4>
                  {announcement.isPinned && (
                    <Pin className="w-4 h-4 text-primary" />
                  )}
                  {!isRead(announcement) && (
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 text-xs rounded-lg ${getPriorityColor(announcement.priority)}`}>
                    {getTypeLabel(announcement.type)}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatTime(announcement.createdAt)}
                  </span>
                </div>
              </div>

              <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {announcement.content}
              </p>

              {announcement.attachments && announcement.attachments.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {announcement.attachments.map((file, index) => (
                    <a
                      key={index}
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary-dark"
                    >
                      📎 {file.name}
                    </a>
                  ))}
                </div>
              )}

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    {announcement.createdBy.profilePhoto ? (
                      <img
                        src={announcement.createdBy.profilePhoto}
                        alt={`${announcement.createdBy.firstName} ${announcement.createdBy.lastName}`}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-medium text-gray-500 dark:text-gray-400">
                        {announcement.createdBy.firstName[0]}{announcement.createdBy.lastName[0]}
                      </div>
                    )}
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {announcement.createdBy.firstName} {announcement.createdBy.lastName}
                    </span>
                  </div>

                  {announcement.expiresAt && (
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      Expires: {new Date(announcement.expiresAt).toLocaleDateString()}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {onMarkAsRead && !isRead(announcement) && (
                    <button
                      onClick={() => onMarkAsRead(announcement.id)}
                      className="text-xs text-primary hover:text-primary-dark"
                    >
                      Mark as read
                    </button>
                  )}
                  {onPin && (
                    <button
                      onClick={() => onPin(announcement.id)}
                      className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      {announcement.isPinned ? 'Unpin' : 'Pin'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {announcements.length === 0 && (
        <div className="text-center py-8">
          <Megaphone className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">No announcements</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            Check back later for updates
          </p>
        </div>
      )}
    </div>
  );
};
