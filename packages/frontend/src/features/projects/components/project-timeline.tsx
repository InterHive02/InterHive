import React from 'react';
import { Calendar, Clock, CheckCircle, Circle, AlertCircle } from 'lucide-react';

interface ProjectTimelineProps {
  events: {
    id: string;
    title: string;
    description?: string;
    date: Date;
    type: 'milestone' | 'task' | 'deliverable' | 'meeting';
    status: 'completed' | 'in_progress' | 'pending' | 'overdue';
    assignee?: { firstName: string; lastName: string; profilePhoto?: string };
  }[];
}

export const ProjectTimeline: React.FC<ProjectTimelineProps> = ({ events }) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'milestone':
        return <CheckCircle className="w-5 h-5 text-purple-500" />;
      case 'deliverable':
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
      case 'meeting':
        return <Calendar className="w-5 h-5 text-green-500" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-500';
      case 'in_progress':
        return 'text-blue-500';
      case 'overdue':
        return 'text-red-500';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusDot = (status: string) => {
    const colors = {
      completed: 'bg-green-500',
      in_progress: 'bg-blue-500',
      pending: 'bg-gray-400',
      overdue: 'bg-red-500',
    };
    return `w-3 h-3 rounded-full ${colors[status as keyof typeof colors]}`;
  };

  const sortedEvents = [...events].sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
        Timeline
      </h3>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>

        <div className="space-y-6">
          {sortedEvents.map((event) => (
            <div key={event.id} className="flex items-start gap-4">
              {/* Timeline dot */}
              <div className="relative z-10 flex items-center justify-center w-8 h-8">
                <div className={getStatusDot(event.status)}></div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      {getTypeIcon(event.type)}
                      <p className="font-medium text-gray-900 dark:text-white">
                        {event.title}
                      </p>
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${getStatusColor(event.status)}`}
                      >
                        {event.status.replace('_', ' ').charAt(0).toUpperCase() + event.status.replace('_', ' ').slice(1)}
                      </span>
                    </div>
                    {event.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {event.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                </div>

                {event.assignee && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                      {event.assignee.profilePhoto ? (
                        <img
                          src={event.assignee.profilePhoto}
                          alt={`${event.assignee.firstName} ${event.assignee.lastName}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs font-medium text-gray-500">
                          {event.assignee.firstName[0]}{event.assignee.lastName[0]}
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {event.assignee.firstName} {event.assignee.lastName}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {sortedEvents.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No timeline events</p>
          </div>
        )}
      </div>
    </div>
  );
};
