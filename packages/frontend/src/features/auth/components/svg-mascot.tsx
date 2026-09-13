import React from 'react';

interface SVGMascotProps {
  isPasswordFocused: boolean;
  showPassword: boolean;
  emailLength?: number;
}

export const SVGMascot: React.FC<SVGMascotProps> = ({
  isPasswordFocused,
  showPassword,
  emailLength = 0,
}) => {
  // Calculate eye pupil shift based on email input length
  const pupilX = Math.min(Math.max((emailLength - 15) * 0.5, -6), 6);
  
  // When password is unseen (hidden dots), mascot is looking straight at user / field
  // When password is seen (plain text), mascot covers eyes or looks away shyly
  const isLookingAway = isPasswordFocused && showPassword;
  const isWatchingHiddenPassword = isPasswordFocused && !showPassword;

  return (
    <div className="flex flex-col items-center justify-center -mb-3 transition-all duration-300">
      <div className="relative w-36 h-36">
        <svg viewBox="0 0 160 160" className="w-full h-full drop-shadow-xl select-none">
          <defs>
            <radialGradient id="mascotGradient" cx="50%" cy="40%" r="50%">
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#4f46e5" />
            </radialGradient>
            <radialGradient id="bellyGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#e0e7ff" />
            </radialGradient>
            <radialGradient id="blushGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
            </radialGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Antennae (InterHive Bee theme) */}
          <g className="transition-transform duration-300 origin-bottom">
            {/* Left Antenna */}
            <path
              d="M 65 42 Q 50 15 42 22"
              fill="none"
              stroke="#312e81"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <circle cx="42" cy="22" r="6" fill="#fbbf24" className="animate-pulse" />
            
            {/* Right Antenna */}
            <path
              d="M 95 42 Q 110 15 118 22"
              fill="none"
              stroke="#312e81"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <circle cx="118" cy="22" r="6" fill="#fbbf24" className="animate-pulse" />
          </g>

          {/* Little Wings on back */}
          <g className={`transition-all duration-300 ${isLookingAway ? 'opacity-30' : 'opacity-80'}`}>
            <ellipse cx="34" cy="72" rx="14" ry="24" transform="rotate(-30 34 72)" fill="#93c5fd" opacity="0.6" />
            <ellipse cx="126" cy="72" rx="14" ry="24" transform="rotate(30 126 72)" fill="#93c5fd" opacity="0.6" />
          </g>

          {/* Main Body */}
          <ellipse
            cx="80"
            cy="86"
            rx="52"
            ry="48"
            fill="url(#mascotGradient)"
            className="transition-transform duration-300"
          />

          {/* InterHive Stripes (Subtle Modern Bee Accent) */}
          <path
            d="M 38 88 Q 80 102 122 88"
            fill="none"
            stroke="#312e81"
            strokeWidth="5"
            strokeLinecap="round"
            opacity="0.4"
          />
          <path
            d="M 44 104 Q 80 118 116 104"
            fill="none"
            stroke="#312e81"
            strokeWidth="5"
            strokeLinecap="round"
            opacity="0.4"
          />

          {/* Cheeks / Blush (Active when looking away or embarrassed) */}
          <circle
            cx="48"
            cy="92"
            r="9"
            fill="url(#blushGradient)"
            className={`transition-opacity duration-300 ${isLookingAway ? 'opacity-100' : 'opacity-40'}`}
          />
          <circle
            cx="112"
            cy="92"
            r="9"
            fill="url(#blushGradient)"
            className={`transition-opacity duration-300 ${isLookingAway ? 'opacity-100' : 'opacity-40'}`}
          />

          {/* Eyes Group */}
          <g className="transition-all duration-300">
            {isLookingAway ? (
              // Shy / Look away eyes (Eyes looking up and far right/turned away)
              <g>
                {/* Left Eye Closed Curved Line */}
                <path
                  d="M 52 74 Q 62 66 72 74"
                  fill="none"
                  stroke="#1e1b4b"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                {/* Right Eye Closed Curved Line */}
                <path
                  d="M 88 74 Q 98 66 108 74"
                  fill="none"
                  stroke="#1e1b4b"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                {/* Sweat drop when shy */}
                <path
                  d="M 120 60 Q 124 66 122 70 Q 120 74 116 72 Q 114 68 118 64 Z"
                  fill="#38bdf8"
                  className="animate-bounce"
                />
              </g>
            ) : isWatchingHiddenPassword ? (
              // Watching Password intently (Focused big round eyes looking down at password field)
              <g>
                <circle cx="62" cy="74" r="14" fill="#ffffff" stroke="#312e81" strokeWidth="2" />
                <circle cx="98" cy="74" r="14" fill="#ffffff" stroke="#312e81" strokeWidth="2" />
                {/* Pupils looking directly down at the password box */}
                <circle cx="62" cy="80" r="7" fill="#1e1b4b" />
                <circle cx="60" cy="78" r="2.5" fill="#ffffff" />
                <circle cx="98" cy="80" r="7" fill="#1e1b4b" />
                <circle cx="96" cy="78" r="2.5" fill="#ffffff" />
              </g>
            ) : (
              // Normal state: Eyes track user's email typing
              <g>
                <circle cx="62" cy="74" r="14" fill="#ffffff" stroke="#312e81" strokeWidth="2" />
                <circle cx="98" cy="74" r="14" fill="#ffffff" stroke="#312e81" strokeWidth="2" />
                {/* Pupils with dynamic shift */}
                <circle cx={62 + pupilX} cy={74 + Math.abs(pupilX) * 0.3} r="6" fill="#1e1b4b" />
                <circle cx={60 + pupilX} cy={72 + Math.abs(pupilX) * 0.3} r="2" fill="#ffffff" />
                <circle cx={98 + pupilX} cy={74 + Math.abs(pupilX) * 0.3} r="6" fill="#1e1b4b" />
                <circle cx={96 + pupilX} cy={72 + Math.abs(pupilX) * 0.3} r="2" fill="#ffffff" />
              </g>
            )}
          </g>

          {/* Cute Mouth */}
          <g className="transition-all duration-300">
            {isLookingAway ? (
              // Shy wavy mouth
              <path
                d="M 74 98 Q 80 95 86 98"
                fill="none"
                stroke="#1e1b4b"
                strokeWidth="3"
                strokeLinecap="round"
              />
            ) : isWatchingHiddenPassword ? (
              // Surprised/focused 'o' mouth
              <ellipse cx="80" cy="98" rx="4" ry="5" fill="#1e1b4b" />
            ) : (
              // Happy smile
              <path
                d="M 72 96 Q 80 104 88 96"
                fill="none"
                stroke="#1e1b4b"
                strokeWidth="3"
                strokeLinecap="round"
              />
            )}
          </g>

          {/* Mascot Hands / Paws */}
          <g className="transition-all duration-500 ease-out">
            {isLookingAway ? (
              // Hands up covering sides of face / blushing
              <g>
                <ellipse cx="44" cy="78" rx="9" ry="12" transform="rotate(25 44 78)" fill="#6366f1" stroke="#312e81" strokeWidth="2" />
                <ellipse cx="116" cy="78" rx="9" ry="12" transform="rotate(-25 116 78)" fill="#6366f1" stroke="#312e81" strokeWidth="2" />
              </g>
            ) : (
              // Hands resting happily on bottom of body
              <g>
                <ellipse cx="56" cy="116" rx="10" ry="7" fill="#6366f1" stroke="#312e81" strokeWidth="2" />
                <ellipse cx="104" cy="116" rx="10" ry="7" fill="#6366f1" stroke="#312e81" strokeWidth="2" />
              </g>
            )}
          </g>
        </svg>

        {/* Dynamic Bubble Reaction Badge */}
        <div className="absolute -top-1 -right-2 transform translate-x-2 transition-all duration-300">
          {isLookingAway && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse">
              🙈 Password Visible!
            </span>
          )}
          {isWatchingHiddenPassword && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 animate-pulse">
              👀 Watching...
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
