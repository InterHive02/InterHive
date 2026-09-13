import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Clock, Award, Users, Play, CheckCircle, Lock } from 'lucide-react';

interface TrainingProgramCardProps {
  program: {
    id: string;
    title: string;
    description: string;
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    duration: { min: number; max: number };
    totalModules: number;
    status: 'draft' | 'published' | 'archived';
    category?: string;
    tags: string[];
  };
  enrollment?: {
    status: 'active' | 'completed' | 'withdrawn';
    progress: number;
  };
  onEnroll?: (id: string) => void;
}

export const TrainingProgramCard: React.FC<TrainingProgramCardProps> = ({
  program,
  enrollment,
  onEnroll,
}) => {
  const navigate = useNavigate();

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'advanced':
        return 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400';
      case 'expert':
        return 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  const getStatusBadge = () => {
    if (enrollment) {
      if (enrollment.status === 'completed') {
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-600 text-xs rounded-lg dark:bg-green-900/20 dark:text-green-400">
            <CheckCircle className="w-3 h-3" />
            Completed
          </span>
        );
      }
      if (enrollment.status === 'active') {
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-lg dark:bg-blue-900/20 dark:text-blue-400">
            <Play className="w-3 h-3" />
            In Progress
          </span>
        );
      }
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                {program.title}
              </h3>
            </div>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {program.description}
            </p>
          </div>
          {getStatusBadge()}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span
            className={`px-2 py-1 text-xs rounded-lg ${getLevelColor(program.level)}`}
          >
            {program.level.charAt(0).toUpperCase() + program.level.slice(1)}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {program.duration.min}-{program.duration.max} days
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <Award className="w-4 h-4" />
            {program.totalModules} modules
          </span>
        </div>

        {program.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {program.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-xs rounded-lg text-gray-600 dark:text-gray-300"
              >
                {tag}
              </span>
            ))}
            {program.tags.length > 3 && (
              <span className="px-2 py-0.5 text-xs text-gray-500 dark:text-gray-400">
                +{program.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {enrollment && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Progress</span>
              <span className="font-medium text-gray-900 dark:text-white">{enrollment.progress}%</span>
            </div>
            <div className="mt-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-primary transition-all duration-500"
                style={{ width: `${enrollment.progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between">
          {enrollment ? (
            <button
              onClick={() => navigate(`/training/${program.id}`)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium"
            >
              {enrollment.status === 'completed' ? 'Review' : 'Continue'}
            </button>
          ) : (
            onEnroll && (
              <button
                onClick={() => onEnroll(program.id)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium"
              >
                <Users className="w-4 h-4" />
                Enroll Now
              </button>
            )
          )}
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {program.category || 'General'}
          </span>
        </div>
      </div>
    </div>
  );
};
