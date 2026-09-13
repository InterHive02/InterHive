import React, { useState } from 'react';
import { Plus, Filter, Search, CheckCircle, Clock, AlertCircle, MoreVertical, User } from 'lucide-react';

interface ProjectTasksProps {
  tasks: {
    id: string;
    title: string;
    description?: string;
    assignedTo: { firstName: string; lastName: string; profilePhoto?: string }[];
    status: 'to_do' | 'in_progress' | 'review' | 'completed' | 'blocked';
    priority: 'low' | 'medium' | 'high' | 'critical';
    startDate?: string;
    endDate?: string;
    subtasks?: { title: string; status: 'to_do' | 'in_progress' | 'completed' }[];
  }[];
  onTaskClick?: (taskId: string) => void;
  onTaskStatusChange?: (taskId: string, status: string) => void;
  onAddTask?: () => void;
}

export const ProjectTasks: React.FC<ProjectTasksProps> = ({
  tasks,
  onTaskClick,
  onTaskStatusChange,
  onAddTask,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400';
      case 'in_progress':
        return 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400';
      case 'review':
        return 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400';
      case 'blocked':
        return 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'text-red-500';
      case 'high':
        return 'text-orange-500';
      case 'medium':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'in_progress':
        return <Clock className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const statusOptions = [
    { value: 'all', label: 'All Tasks' },
    { value: 'to_do', label: 'To Do' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'review', label: 'Review' },
    { value: 'completed', label: 'Completed' },
    { value: 'blocked', label: 'Blocked' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Tasks</h3>
        {onAddTask && (
          <button
            onClick={onAddTask}
            className="inline-flex items-center gap-2 text-primary hover:text-primary-dark text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Task
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="flex-1 min-w-[150px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary transition-colors cursor-pointer"
            onClick={() => onTaskClick?.(task.id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-lg ${getStatusColor(task.status)}`}
                  >
                    {getStatusIcon(task.status)}
                    {task.status.replace('_', ' ').charAt(0).toUpperCase() + task.status.replace('_', ' ').slice(1)}
                  </span>
                  <span className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                  </span>
                </div>
                <p className="mt-1 font-medium text-gray-900 dark:text-white">
                  {task.title}
                </p>
                {task.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                    {task.description}
                  </p>
                )}
              </div>
              <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <MoreVertical className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
              {/* Assigned to */}
              {task.assignedTo && task.assignedTo.length > 0 && (
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4 text-gray-400" />
                  <div className="flex -space-x-2">
                    {task.assignedTo.slice(0, 3).map((member, index) => (
                      <div
                        key={index}
                        className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-800 overflow-hidden bg-gray-200 dark:bg-gray-700"
                      >
                        {member.profilePhoto ? (
                          <img
                            src={member.profilePhoto}
                            alt={`${member.firstName} ${member.lastName}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[8px] font-medium text-gray-500">
                            {member.firstName[0]}{member.lastName[0]}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  {task.assignedTo.length > 3 && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      +{task.assignedTo.length - 3}
                    </span>
                  )}
                </div>
              )}

              {/* Dates */}
              {task.endDate && (
                <span className="text-gray-500 dark:text-gray-400">
                  Due: {new Date(task.endDate).toLocaleDateString()}
                </span>
              )}

              {/* Subtasks */}
              {task.subtasks && task.subtasks.length > 0 && (
                <span className="text-gray-500 dark:text-gray-400">
                  {task.subtasks.filter(s => s.status === 'completed').length}/{task.subtasks.length} subtasks
                </span>
              )}
            </div>

            {/* Status change dropdown (if provided) */}
            {onTaskStatusChange && (
              <div className="mt-2" onClick={(e) => e.stopPropagation()}>
                <select
                  value={task.status}
                  onChange={(e) => onTaskStatusChange(task.id, e.target.value)}
                  className="px-2 py-1 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="to_do">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="review">Review</option>
                  <option value="completed">Completed</option>
                  <option value="blocked">Blocked</option>
                </select>
              </div>
            )}
          </div>
        ))}

        {filteredTasks.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No tasks found</p>
          </div>
        )}
      </div>
    </div>
  );
};
