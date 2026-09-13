import React from 'react';
import { GraduationCap, Calendar } from 'lucide-react';

interface EducationSectionProps {
  education: {
    institution: string;
    degree: string;
    field: string;
    startDate: Date;
    endDate?: Date;
    isCurrent: boolean;
    grade?: string;
  };
}

export const EducationSection: React.FC<EducationSectionProps> = ({ education }) => {
  if (!education || (!education.degree && !education.institution)) {
    return null;
  }

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
        Education
      </h3>

      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <GraduationCap className="w-5 h-5 text-gray-400 mt-0.5" />
          <div className="flex-1">
            <div className="flex flex-wrap justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {education.degree} in {education.field}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {education.institution}
                </p>
              </div>
              {education.grade && (
                <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-lg">
                  CGPA: {education.grade}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 mt-1 text-sm text-gray-500 dark:text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>
                {formatDate(education.startDate)} - {formatDate(education.endDate)}
              </span>
              {education.isCurrent && (
                <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-600 text-xs rounded-full dark:bg-green-900/20 dark:text-green-400">
                  Current
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
