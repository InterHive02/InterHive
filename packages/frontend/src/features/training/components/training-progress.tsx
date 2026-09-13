import React from 'react';
import { CheckCircle, Clock, Award, TrendingUp } from 'lucide-react';

interface TrainingProgressProps {
  program: {
    title: string;
    totalModules: number;
  };
  enrollment: {
    progress: number;
    status: 'active' | 'completed' | 'withdrawn';
    enrollmentDate: Date;
    completionDate?: Date;
    certification?: {
      issued: boolean;
      issuedDate?: Date;
      certificateId?: string;
    };
  };
  moduleStats: {
    completed: number;
    inProgress: number;
    locked: number;
  };
}

export const TrainingProgress: React.FC<TrainingProgressProps> = ({
  program,
  enrollment,
  moduleStats,
}) => {
  const getStatusColor = () => {
    switch (enrollment.status) {
      case 'completed':
        return 'text-green-500';
      case 'active':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusText = () => {
    switch (enrollment.status) {
      case 'completed':
        return 'Completed';
      case 'active':
        return 'In Progress';
      default:
        return 'Not Started';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
        Progress Overview
      </h3>

      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {enrollment.progress}%
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {getStatusText()}
          </p>
        </div>
        <div className="flex items-center gap-4">
          {enrollment.certification?.issued && (
            <div className="flex items-center gap-2 text-green-500">
              <Award className="w-5 h-5" />
              <span className="text-sm font-medium">Certified</span>
            </div>
          )}
          <div className={`flex items-center gap-2 ${getStatusColor()}`}>
            <Clock className="w-5 h-5" />
            <span className="text-sm font-medium">
              {enrollment.status === 'completed' ? 'Completed' : 'Active'}
            </span>
          </div>
        </div>
      </div>

      {/* Main progress bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
        <div
          className={`h-3 rounded-full transition-all duration-500 ${
            enrollment.status === 'completed' ? 'bg-green-500' : 'bg-primary'
          }`}
          style={{ width: `${enrollment.progress}%` }}
        />
      </div>

      {/* Module stats */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {moduleStats.completed}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Completed</p>
        </div>
        <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <Clock className="w-5 h-5 text-yellow-500 mx-auto" />
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {moduleStats.inProgress}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">In Progress</p>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <Clock className="w-5 h-5 text-gray-400 mx-auto" />
          <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">
            {moduleStats.locked}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Locked</p>
        </div>
      </div>

      {/* Timeline */}
      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <div>
            <p className="text-gray-500 dark:text-gray-400">Started</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {new Date(enrollment.enrollmentDate).toLocaleDateString()}
            </p>
          </div>
          <TrendingUp className="w-5 h-5 text-primary" />
          <div>
            <p className="text-gray-500 dark:text-gray-400">
              {enrollment.status === 'completed' ? 'Completed' : 'Est. Completion'}
            </p>
            <p className="font-medium text-gray-900 dark:text-white">
              {enrollment.completionDate
                ? new Date(enrollment.completionDate).toLocaleDateString()
                : 'In Progress'}
            </p>
          </div>
        </div>
      </div>

      {/* Certification */}
      {enrollment.certification?.issued && (
        <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-3">
            <Award className="w-6 h-6 text-green-500" />
            <div>
              <p className="font-medium text-green-700 dark:text-green-400">
                Certificate Issued
              </p>
              <p className="text-sm text-green-600 dark:text-green-300">
                Certificate ID: {enrollment.certification.certificateId}
              </p>
              {enrollment.certification.issuedDate && (
                <p className="text-xs text-green-600 dark:text-green-300">
                  Issued on {new Date(enrollment.certification.issuedDate).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
