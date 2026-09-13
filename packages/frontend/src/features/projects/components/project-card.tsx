import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Users, Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    description: string;
    status: 'planning' | 'in_progress' | 'completed' | 'paused' | 'cancelled';
    progress: number;
    companyId: string;
    companyName: string;
    teamSize?: { min: number; max: number };
    startDate?: string;
    endDate?: string;
    assignedTo: { firstName: string; lastName: string; profilePhoto?: string }[];
  };
  role?: 'intern' | 'manager';
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, role = 'intern' }) => {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400';
      case 'in_progress':
        return 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400';
      case 'planning':
        return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'paused':
        return 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400';
      case 'cancelled':
        return 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400';
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

  const formatDate = (date?: string) => {
    if (!date) return 'TBD';
    return new Date(date).toLocaleDateString();
  };

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 cursor-pointer hover:shadow-md transition-all"
      onClick={() => navigate(`/projects/${project.id}`)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
              {project.title}
            </h3>
          </div>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {project.description}
          </p>
        </div>
        <span
          className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-lg ${getStatusColor(project.status)}`}
        >
          {getStatusIcon(project.status)}
          {project.status.charAt(0).toUpperCase() + project.status.slice(1).replace('_', ' ')}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
        <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
          <Users className="w-4 h-4" />
          {project.companyName}
        </span>
        {project.teamSize && (
          <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <Users className="w-4 h-4" />
            Team: {project.teamSize.min}-{project.teamSize.max}
          </span>
        )}
        <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          {formatDate(project.startDate)} - {formatDate(project.endDate)}
        </span>
      </div>

      {/* Team Avatars */}
      {project.assignedTo && project.assignedTo.length > 0 && (
        <div className="mt-4 flex items-center gap-2">
          <div className="flex -space-x-2">
            {project.assignedTo.slice(0, 4).map((member, index) => (
              <div
                key={index}
                className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 overflow-hidden bg-gray-200 dark:bg-gray-700"
              >
                {member.profilePhoto ? (
                  <img
                    src={member.profilePhoto}
                    alt={`${member.firstName} ${member.lastName}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs font-medium text-gray-500">
                    {member.firstName[0]}{member.lastName[0]}
                  </div>
                )}
              </div>
            ))}
          </div>
          {project.assignedTo.length > 4 && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              +{project.assignedTo.length - 4} more
            </span>
          )}
        </div>
      )}

      {/* Progress */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Progress</span>
          <span className="font-medium text-gray-900 dark:text-white">{project.progress}%</span>
        </div>
        <div className="mt-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${
              project.status === 'completed' ? 'bg-green-500' : 'bg-primary'
            }`}
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
