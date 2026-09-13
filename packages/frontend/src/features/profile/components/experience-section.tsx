import React from 'react';
import { Briefcase, Calendar } from 'lucide-react';

interface ExperienceSectionProps {
  experience: {
    company: string;
    position: string;
    startDate: Date;
    endDate?: Date;
    current: boolean;
    description?: string;
    skills?: string[];
  }[];
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experience }) => {
  const formatDate = (date?: Date) => {
    if (!date) return 'Present';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
        Experience
      </h3>

      <div className="space-y-6">
        {experience.map((exp, index) => (
          <div key={index} className="flex items-start gap-3">
            <Briefcase className="w-5 h-5 text-gray-400 mt-0.5" />
            <div className="flex-1">
              <div className="flex flex-wrap justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {exp.position}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {exp.company}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                  </span>
                  {exp.current && (
                    <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-600 text-xs rounded-full dark:bg-green-900/20 dark:text-green-400">
                      Current
                    </span>
                  )}
                </div>
              </div>

              {exp.description && (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  {exp.description}
                </p>
              )}

              {exp.skills && exp.skills.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {exp.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded-lg text-gray-600 dark:text-gray-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {experience.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
            No experience added yet
          </p>
        )}
      </div>
    </div>
  );
};
