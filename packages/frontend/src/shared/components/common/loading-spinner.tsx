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
  const sizeConfig = {
    sm: { wh: 16, border: 2, text: 5, glow: 4 },
    md: { wh: 32, border: 2, text: 7, glow: 6 },
    lg: { wh: 48, border: 3, text: 10, glow: 10 },
    xl: { wh: 64, border: 3, text: 13, glow: 14 },
  };

  const { wh, border, text, glow } = sizeConfig[size] || sizeConfig.md;

  const spinner = (
    <div className={`flex flex-col items-center justify-center gap-3 ${fullScreen ? 'min-h-screen' : ''}`}>
      <div
        style={{
          position: 'relative',
          width: wh,
          height: wh,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* The original spinning ring — border-t and border-b arcs with neon glow */}
        <div
          className="animate-spin"
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            borderWidth: border,
            borderStyle: 'solid',
            borderTopColor: '#4F46E5',
            borderBottomColor: '#4F46E5',
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            boxShadow: `0 0 ${glow}px rgba(79, 70, 229, 0.6), 0 0 ${glow * 2}px rgba(79, 70, 229, 0.3)`,
          }}
        />
        {/* "IH" stays centered while the ring rotates */}
        <span
          style={{
            position: 'absolute',
            color: '#818CF8',
            fontWeight: 900,
            fontSize: text,
            letterSpacing: '0.08em',
            userSelect: 'none',
            lineHeight: 1,
          }}
        >
          IH
        </span>
      </div>
      {label && <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>}
    </div>
  );

  return spinner;
};
