import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MatchScoreProps {
  score: number;
  breakdown: {
    skillMatch: number;
    readinessMatch: number;
    experienceMatch: number;
    preferenceMatch: number;
  };
  size?: 'sm' | 'md' | 'lg';
}

export const MatchScore: React.FC<MatchScoreProps> = ({
  score,
  breakdown,
  size = 'md',
}) => {
  const getScoreColor = (value: number) => {
    if (value >= 80) return 'text-green-500';
    if (value >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBgColor = (value: number) => {
    if (value >= 80) return 'bg-green-500';
    if (value >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const sizeClasses = {
    sm: {
      circle: 'w-16 h-16',
      text: 'text-2xl',
      label: 'text-xs',
    },
    md: {
      circle: 'w-24 h-24',
      text: 'text-4xl',
      label: 'text-sm',
    },
    lg: {
      circle: 'w-32 h-32',
      text: 'text-5xl',
      label: 'text-base',
    },
  };

  const breakdownItems = [
    { key: 'skillMatch', label: 'Skills Match', value: breakdown.skillMatch },
    { key: 'readinessMatch', label: 'Readiness', value: breakdown.readinessMatch },
    { key: 'experienceMatch', label: 'Experience', value: breakdown.experienceMatch },
    { key: 'preferenceMatch', label: 'Preferences', value: breakdown.preferenceMatch },
  ];

  return (
    <div className="flex items-center gap-6">
      {/* Circle Score */}
      <div className={`relative ${sizeClasses[size].circle} flex-shrink-0`}>
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            className="stroke-gray-200 dark:stroke-gray-700 fill-none stroke-[6]"
          />
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            className={`fill-none stroke-[6] transition-all duration-1000 ${getScoreBgColor(score)}`}
            strokeDasharray={`${score * 2.827} 282.7`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-bold ${getScoreColor(score)} ${sizeClasses[size].text}`}>
            {score}%
          </span>
        </div>
      </div>

      {/* Breakdown */}
      <div className="flex-1 min-w-0">
        <p className={`font-medium text-gray-900 dark:text-white ${sizeClasses[size].label} mb-2`}>
          Match Breakdown
        </p>
        <div className="space-y-2">
          {breakdownItems.map((item) => (
            <div key={item.key}>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">{item.label}</span>
                <span className={`font-medium ${getScoreColor(item.value)}`}>
                  {item.value}%
                </span>
              </div>
              <div className="mt-0.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full transition-all duration-500 ${getScoreBgColor(item.value)}`}
                  style={{ width: `${item.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
