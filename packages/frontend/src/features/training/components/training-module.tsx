import React, { useState } from 'react';
import { Play, CheckCircle, Lock, ChevronDown, ChevronUp, Video, FileText, Book, Code, Briefcase } from 'lucide-react';

interface TrainingModuleProps {
  module: {
    id: string;
    title: string;
    description?: string;
    type: 'video' | 'article' | 'quiz' | 'assignment' | 'project' | 'lab';
    duration: number;
    isRequired: boolean;
    content?: {
      videoUrl?: string;
      content?: string;
      resources?: { title: string; url: string; type: string }[];
    };
  };
  progress: {
    status: 'locked' | 'in_progress' | 'completed';
    progress: number;
    score?: number;
  };
  index: number;
  onStart?: (moduleId: string) => void;
  onComplete?: (moduleId: string) => void;
}

export const TrainingModule: React.FC<TrainingModuleProps> = ({
  module,
  progress,
  index,
  onStart,
  onComplete,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getTypeIcon = () => {
    switch (module.type) {
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'article':
        return <FileText className="w-4 h-4" />;
      case 'quiz':
        return <Book className="w-4 h-4" />;
      case 'assignment':
        return <Briefcase className="w-4 h-4" />;
      case 'project':
        return <Code className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getStatusIcon = () => {
    switch (progress.status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in_progress':
        return <Play className="w-5 h-5 text-yellow-500" />;
      default:
        return <Lock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (progress.status) {
      case 'completed':
        return 'border-green-500';
      case 'in_progress':
        return 'border-yellow-500';
      default:
        return 'border-gray-200 dark:border-gray-700';
    }
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <div className={`border-l-4 ${getStatusColor()} bg-white dark:bg-gray-800 rounded-r-xl shadow-sm border border-gray-200 dark:border-gray-700`}>
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex items-center gap-2 min-w-[80px]">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              #{index + 1}
            </span>
            {getStatusIcon()}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="font-medium text-gray-900 dark:text-white">
                {module.title}
              </h4>
              {module.isRequired && (
                <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-lg dark:bg-red-900/20 dark:text-red-400">
                  Required
                </span>
              )}
            </div>
            {module.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {module.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {formatDuration(module.duration)}
            </span>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </button>
          </div>
        </div>

        {/* Progress bar */}
        {progress.status !== 'locked' && (
          <div className="mt-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Progress</span>
              <span className="font-medium text-gray-900 dark:text-white">{progress.progress}%</span>
            </div>
            <div className="mt-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  progress.status === 'completed' ? 'bg-green-500' : 'bg-primary'
                }`}
                style={{ width: `${progress.progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Expanded content */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            {module.content?.content && (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: module.content.content }} />
              </div>
            )}

            {module.content?.resources && module.content.resources.length > 0 && (
              <div className="mt-4">
                <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Resources
                </h5>
                <div className="space-y-1">
                  {module.content.resources.map((resource, idx) => (
                    <a
                      key={idx}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary hover:text-primary-dark"
                    >
                      {getTypeIcon()}
                      {resource.title}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {progress.status !== 'completed' && progress.status !== 'locked' && (
              <div className="mt-4 flex gap-2">
                {onStart && (
                  <button
                    onClick={() => onStart(module.id)}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm"
                  >
                    {progress.status === 'in_progress' ? 'Continue' : 'Start'}
                  </button>
                )}
                {onComplete && progress.progress === 100 && (
                  <button
                    onClick={() => onComplete(module.id)}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                  >
                    Mark as Complete
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
