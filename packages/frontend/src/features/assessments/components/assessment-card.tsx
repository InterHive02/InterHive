import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Award, FileText, Play, CheckCircle, Lock } from 'lucide-react';

interface AssessmentCardProps {
  assessment: {
    id: string;
    title: string;
    description: string;
    type: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    duration: number;
    totalScore: number;
    passingScore: number;
    status: 'draft' | 'published' | 'active' | 'archived';
    skillsAssessed: { name: string }[];
  };
  onStart?: (id: string) => void;
  isCompleted?: boolean;
  isLocked?: boolean;
}

export const AssessmentCard: React.FC<AssessmentCardProps> = ({
  assessment,
  onStart,
  isCompleted = false,
  isLocked = false,
}) => {
  const navigate = useNavigate();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
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
    if (isCompleted) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-600 text-xs rounded-lg dark:bg-green-900/20 dark:text-green-400">
          <CheckCircle className="w-3 h-3" />
          Completed
        </span>
      );
    }
    if (isLocked) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-lg dark:bg-gray-700 dark:text-gray-400">
          <Lock className="w-3 h-3" />
          Locked
        </span>
      );
    }
    return null;
  };

  const difficulty = assessment.difficulty || 'intermediate';
  const formatDifficulty = (diff?: string) => {
    if (!diff) return 'Intermediate';
    return diff.charAt(0).toUpperCase() + diff.slice(1);
  };

  const skillsAssessed = Array.isArray(assessment.skillsAssessed) ? assessment.skillsAssessed : [];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
              {assessment.title || 'Technical Assessment'}
            </h3>
          </div>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {assessment.description || 'Comprehensive evaluation of domain proficiency.'}
          </p>
        </div>
        {getStatusBadge()}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <span
          className={`px-2 py-1 text-xs rounded-lg font-medium ${getDifficultyColor(difficulty)}`}
        >
          {formatDifficulty(difficulty)}
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
          <Clock className="w-4 h-4" />
          {assessment.duration || 45} min
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
          <Award className="w-4 h-4" />
          Pass: {assessment.passingScore || 70}%
        </span>
      </div>

      {skillsAssessed.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {skillsAssessed.slice(0, 3).map((skill: any, idx: number) => {
            const skillName = typeof skill === 'string' ? skill : (skill?.name || `Skill ${idx + 1}`);
            return (
              <span
                key={skillName + idx}
                className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-xs rounded-lg text-gray-600 dark:text-gray-300"
              >
                {skillName}
              </span>
            );
          })}
          {skillsAssessed.length > 3 && (
            <span className="px-2 py-0.5 text-xs text-gray-500 dark:text-gray-400">
              +{skillsAssessed.length - 3} more
            </span>
          )}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {assessment.totalScore ?? (assessment as any).totalQuestions ? ((assessment as any).totalQuestions * 10) : 100} points
        </span>
        {!isCompleted && !isLocked && onStart && (
          <button
            onClick={() => onStart(assessment.id)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium"
          >
            <Play className="w-4 h-4" />
            Start Assessment
          </button>
        )}
        {isCompleted && (
          <button
            onClick={() => navigate(`/assessments/${assessment.id}/results`)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
          >
            View Results
          </button>
        )}
      </div>
    </div>
  );
};
