import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showSubtitle?: boolean;
  subtitle?: string;
  className?: string;
  linkToHome?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  showSubtitle = false,
  subtitle = 'From Intern to Industry',
  className = '',
  linkToHome = true,
}) => {
  const [imageError, setImageError] = useState(false);

  // Perfectly balanced responsive size mappings
  const sizeClasses = {
    sm: {
      img: 'h-7 sm:h-8 max-w-[140px]',
      badge: 'w-7 h-7 text-xs rounded-xl',
      title: 'text-base',
      subtitle: 'text-[9px]',
    },
    md: {
      img: 'h-9 sm:h-10 max-w-[180px]',
      badge: 'w-9.5 h-9.5 text-lg rounded-xl',
      title: 'text-xl',
      subtitle: 'text-[10px]',
    },
    lg: {
      img: 'h-11 sm:h-12 max-w-[220px]',
      badge: 'w-11 h-11 text-xl rounded-xl',
      title: 'text-2xl',
      subtitle: 'text-xs',
    },
    xl: {
      img: 'h-14 sm:h-16 max-w-[280px]',
      badge: 'w-16 h-16 text-3xl rounded-2xl',
      title: 'text-3xl',
      subtitle: 'text-sm',
    },
  };

  const currentSize = sizeClasses[size];

  const logoContent = (
    <div className={`flex items-center gap-2.5 group cursor-pointer ${className}`}>
      {/* 
        Single Logo File System:
        Upload / replace your logo image at: packages/frontend/public/logo.png
        It will automatically apply everywhere across the platform.
      */}
      {!imageError ? (
        <img
          src="/logo.png"
          alt="InterHive Logo"
          loading="eager"
          decoding="async"
          onError={() => setImageError(true)}
          className={`${currentSize.img} w-auto object-contain shrink-0 group-hover:scale-105 transition-transform duration-200`}
        />
      ) : (
        <div
          className={`${currentSize.badge} bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-black shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform shrink-0`}
        >
          H
        </div>
      )}

      {showText && (
        <div className="leading-tight min-w-0">
          <span className={`${currentSize.title} font-black tracking-tight text-slate-900 dark:text-white block`}>
            Inter<span className="text-blue-600 dark:text-blue-400">Hive</span>
          </span>
          {showSubtitle && (
            <span className={`${currentSize.subtitle} font-semibold text-slate-400 block tracking-wide truncate mt-0.5`}>
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (linkToHome) {
    return <Link to="/" className="inline-flex items-center">{logoContent}</Link>;
  }

  return logoContent;
};
