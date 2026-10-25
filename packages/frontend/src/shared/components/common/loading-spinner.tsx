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
    sm: { container: 32, border: 2, fontSize: 9 },
    md: { container: 48, border: 2, fontSize: 11 },
    lg: { container: 64, border: 2, fontSize: 13 },
    xl: { container: 80, border: 3, fontSize: 15 },
  };

  const { container, border, fontSize } = sizeMap[size] || sizeMap.md;

  const spinner = (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${
        fullScreen ? 'min-h-screen' : ''
      } ${className}`}
    >
      <div
        style={{ width: container, height: container, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        {/* The original dual-arc spinning ring — top and bottom arcs colored, sides transparent */}
        <div
          className="animate-spin"
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            borderWidth: border,
            borderStyle: 'solid',
            borderTopColor: '#6366f1',
            borderBottomColor: '#6366f1',
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
          }}
        />

        {/* "IH" stays still in the center while the ring rotates around it */}
        {showText && (
          <span
            style={{
              position: 'absolute',
              color: '#6366f1',
              fontWeight: 900,
              fontSize,
              letterSpacing: '0.06em',
              userSelect: 'none',
              lineHeight: 1,
            }}
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
