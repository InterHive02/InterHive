import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, BellOff, CheckCircle, XCircle, Clock } from 'lucide-react';

interface NotificationBellProps {
  count: number;
  onClick?: () => void;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({
  count,
  onClick,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
    onClick?.();
  };

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        className="relative p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        {count > 0 ? (
          <>
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-medium">
              {count > 9 ? '9+' : count}
            </span>
          </>
        ) : (
          <BellOff className="w-5 h-5" />
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-medium text-gray-900 dark:text-white">Notifications</h3>
            <Link
              to="/notifications"
              className="text-xs text-primary hover:text-primary-dark"
            >
              View All
            </Link>
          </div>

          <div className="overflow-y-auto max-h-64">
            {count > 0 ? (
              <div className="p-2 space-y-1">
                {/* Sample notifications - would be replaced with actual data */}
                <div className="flex items-start gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer">
                  <div className="p-1.5 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                    <CheckCircle className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Assessment Completed
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      You scored 85% on React Assessment
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                      2 minutes ago
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer">
                  <div className="p-1.5 bg-green-100 dark:bg-green-900/20 rounded-full">
                    <Clock className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Project Update
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      New task assigned in E-commerce Project
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                      1 hour ago
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer">
                  <div className="p-1.5 bg-yellow-100 dark:bg-yellow-900/20 rounded-full">
                    <Clock className="w-4 h-4 text-yellow-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Training Reminder
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      Module 3 of Full Stack Development is due tomorrow
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                      3 hours ago
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 px-4">
                <BellOff className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
                <p className="text-sm text-gray-500 dark:text-gray-400">No notifications</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  You're all caught up!
                </p>
              </div>
            )}
          </div>

          {count > 0 && (
            <div className="p-2 border-t border-gray-200 dark:border-gray-700">
              <button className="w-full text-xs text-center text-primary hover:text-primary-dark py-1">
                Mark all as read
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
