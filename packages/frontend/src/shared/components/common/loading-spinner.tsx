import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullScreen?: boolean;
  label?: string;
  showText?: boolean;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  fullScreen = false,
  label,
  showText = true,
  className = '',
}) => {
  const sizeMap = {
    sm: {
      container: 'w-8 h-8',
      ring: 'border-2',
      text: 'text-[9px] font-black',
    },
    md: {
      container: 'w-12 h-12',
      ring: 'border-2',
      text: 'text-xs font-black',
    },
    lg: {
      container: 'w-16 h-16',
      ring: 'border-2',
      text: 'text-sm font-black',
    },
    xl: {
      container: 'w-20 h-20',
      ring: 'border-3',
      text: 'text-base font-black',
    },
  };

  const { container, ring, text } = sizeMap[size] || sizeMap.md;

  const spinner = (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${
        fullScreen ? 'min-h-screen' : ''
      } ${className}`}
    >
      <div className={`relative flex items-center justify-center ${container}`}>
        {/* Exact rotating circle with dual arcs */}
        <div
          className={`absolute inset-0 rounded-full border-t-2 border-b-2 border-primary animate-spin ${ring}`}
        />

        {/* 'IH' centered inside the circle */}
        {showText && (
          <span
            className={`text-primary dark:text-primary-light font-black tracking-wider select-none uppercase ${text}`}
            style={{ letterSpacing: '0.06em' }}
          >
            IH
          </span>
        )}
      </div>

      {label && (
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 tracking-wide animate-pulse">
          {label}
        </p>
      )}
    </div>
  );

  return spinner;
};
