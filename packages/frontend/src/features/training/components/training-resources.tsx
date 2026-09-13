import React from 'react';
import { Download, ExternalLink, FileText, Video, Book, Code, Briefcase, Link2 } from 'lucide-react';

interface TrainingResourcesProps {
  resources: {
    id: string;
    title: string;
    type: 'video' | 'document' | 'link' | 'code' | 'exercise';
    url: string;
    description?: string;
    size?: string;
  }[];
}

export const TrainingResources: React.FC<TrainingResourcesProps> = ({ resources }) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-5 h-5 text-blue-500" />;
      case 'document':
        return <FileText className="w-5 h-5 text-green-500" />;
      case 'link':
        return <Link2 className="w-5 h-5 text-purple-500" />;
      case 'code':
        return <Code className="w-5 h-5 text-orange-500" />;
      case 'exercise':
        return <Briefcase className="w-5 h-5 text-yellow-500" />;
      default:
        return <Book className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'video':
        return 'Video';
      case 'document':
        return 'Document';
      case 'link':
        return 'Link';
      case 'code':
        return 'Code';
      case 'exercise':
        return 'Exercise';
      default:
        return 'Resource';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
        Resources
      </h3>

      <div className="space-y-3">
        {resources.map((resource) => (
          <div
            key={resource.id}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600/50 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              {getTypeIcon(resource.type)}
              <div className="min-w-0">
                <p className="font-medium text-gray-900 dark:text-white truncate">
                  {resource.title}
                </p>
                {resource.description && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {resource.description}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {getTypeLabel(resource.type)}
                  </span>
                  {resource.size && (
                    <>
                      <span className="text-xs text-gray-300 dark:text-gray-600">•</span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        {resource.size}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {resource.type === 'link' ? (
                  <ExternalLink className="w-4 h-4" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
              </a>
            </div>
          </div>
        ))}

        {resources.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
            No resources available for this module
          </p>
        )}
      </div>
    </div>
  );
};
