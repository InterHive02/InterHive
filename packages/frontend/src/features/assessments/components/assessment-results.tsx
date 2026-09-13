import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, CheckCircle, XCircle, Clock, TrendingUp, BarChart3 } from 'lucide-react';
import { SkillRadarChart } from './skill-radar-chart';

interface AssessmentResultsProps {
  results: {
    score: number;
    percentage: number;
    passed: boolean;
    grade?: string;
    timeSpent: number;
    totalQuestions: number;
    correctAnswers: number;
    skillsAssessment: {
      skill: string;
      score: number;
      level: string;
    }[];
    feedback?: {
      strengths: string[];
      weaknesses: string[];
      recommendations: string[];
    };
  };
  assessmentTitle: string;
}

export const AssessmentResults: React.FC<AssessmentResultsProps> = ({
  results,
  assessmentTitle,
}) => {
  const navigate = useNavigate();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getGradeColor = (grade?: string) => {
    if (!grade) return 'text-gray-500';
    switch (grade) {
      case 'A':
        return 'text-green-500';
      case 'B':
        return 'text-blue-500';
      case 'C':
        return 'text-yellow-500';
      case 'D':
        return 'text-orange-500';
      case 'F':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-500';
    if (percentage >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-3 mb-2">
          <Award className={`w-8 h-8 ${results.passed ? 'text-green-500' : 'text-red-500'}`} />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {assessmentTitle}
          </h2>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className={`text-3xl font-bold ${getScoreColor(results.percentage)}`}>
              {results.percentage}%
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">Score</span>
          </div>
          <div className="w-px h-8 bg-gray-200 dark:bg-gray-700" />
          <div className="flex items-center gap-2">
            <span className={`text-xl font-bold ${getGradeColor(results.grade)}`}>
              {results.grade || 'N/A'}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">Grade</span>
          </div>
          <div className="w-px h-8 bg-gray-200 dark:bg-gray-700" />
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {formatTime(results.timeSpent)}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">Time Spent</span>
          </div>
          <div className="w-px h-8 bg-gray-200 dark:bg-gray-700" />
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {results.correctAnswers}/{results.totalQuestions}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">Correct</span>
          </div>
        </div>
        <div className="mt-4">
          <span
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
              results.passed
                ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
            }`}
          >
            {results.passed ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <XCircle className="w-5 h-5" />
            )}
            {results.passed ? 'Passed' : 'Failed'}
          </span>
        </div>
      </div>

      {/* Skills Assessment */}
      {results.skillsAssessment.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
              Skills Breakdown
            </h3>
            <div className="h-64">
              <SkillRadarChart
                skills={results.skillsAssessment.map(s => ({
                  category: s.skill,
                  score: s.score,
                  fullMark: 100,
                }))}
              />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
              Skill Levels
            </h3>
            <div className="space-y-3">
              {results.skillsAssessment.map((skill) => (
                <div key={skill.skill}>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700 dark:text-gray-300">{skill.skill}</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {skill.level.charAt(0).toUpperCase() + skill.level.slice(1)}
                    </span>
                  </div>
                  <div className="mt-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        skill.score >= 70
                          ? 'bg-green-500'
                          : skill.score >= 50
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${skill.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Feedback */}
      {results.feedback && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
            Detailed Feedback
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.feedback.strengths.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-green-600 dark:text-green-400 mb-2">
                  Strengths
                </h4>
                <ul className="space-y-1">
                  {results.feedback.strengths.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {results.feedback.weaknesses.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-red-600 dark:text-red-400 mb-2">
                  Areas for Improvement
                </h4>
                <ul className="space-y-1">
                  {results.feedback.weaknesses.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {results.feedback.recommendations.length > 0 && (
            <div className="mt-4 p-4 bg-primary/5 rounded-lg">
              <h4 className="text-sm font-medium text-primary mb-2">Recommendations</h4>
              <ul className="space-y-1">
                {results.feedback.recommendations.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <TrendingUp className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-4">
        <button
          onClick={() => navigate('/assessments')}
          className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          Back to Assessments
        </button>
        <button
          onClick={() => navigate(`/assessments/${results.id}/retake`)}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          Retake Assessment
        </button>
      </div>
    </div>
  );
};
