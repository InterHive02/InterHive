import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullScreen?: boolean;
  label?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  fullScreen = false,
  label,
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4',
  };

  const textClasses = {
    sm: 'text-[5px]',
    md: 'text-[7px]',
    lg: 'text-[10px]',
    xl: 'text-xs',
  };

  const spinner = (
    <div className={`flex flex-col items-center justify-center gap-3 ${fullScreen ? 'min-h-screen' : ''}`}>
      <div className="relative inline-flex items-center justify-center">
        {/* Original spinner ring — exactly as it was */}
        <div
          className={`${sizeClasses[size]} rounded-full border-t-transparent border-primary animate-spin`}
        />
        {/* IH text centered inside the ring */}
        <span
          className={`absolute ${textClasses[size]} text-primary font-black tracking-wider select-none`}
        >
          IH
        </span>
      </div>
      {label && <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>}
    </div>
  );

  if (fullScreen) {
    return spinner;
  }

  return spinner;
};
