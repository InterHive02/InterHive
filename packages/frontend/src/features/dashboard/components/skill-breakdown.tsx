import React from 'react';
import { useNavigate } from 'react-router-dom';

interface SkillBreakdownProps {
  skills?: Array<{
    category: any;
    score: number;
    fullMark?: number;
  }>;
}

const safeText = (val: any): string => {
  if (val === null || val === undefined) return '';
  if (typeof val === 'string' || typeof val === 'number') return String(val);
  if (val instanceof Date) return val.toLocaleDateString();
  if (typeof val === 'object') {
    if (val.name) return String(val.name);
    if (val.title) return String(val.title);
    return '';
  }
  return String(val);
};

export const SkillBreakdown: React.FC<SkillBreakdownProps> = ({ skills = [] }) => {
  const navigate = useNavigate();

  const defaultSkills = [
    { category: 'Technical', score: 0 },
    { category: 'Problem Solving', score: 0 },
    { category: 'Communication', score: 0 },
    { category: 'Teamwork', score: 0 },
    { category: 'Tools', score: 0 },
  ];

  const skillList = skills.length > 0 ? skills : defaultSkills;
  const isAllZero = skillList.every(s => !s.score || Number(s.score) === 0);

  // Render SVG pentagon/radar chart
  const center = 100;
  const radius = 65;
  const numAxes = skillList.length;

  const getCoordinates = (index: number, val: number) => {
    const angle = (Math.PI * 2 / numAxes) * index - Math.PI / 2;
    const r = (val / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // Polygon points for value fill (baseline 5% for visual indicator if all 0)
  const valuePoints = skillList
    .map((s, idx) => {
      const displayScore = isAllZero ? 5 : Number(s.score) || 0;
      const { x, y } = getCoordinates(idx, displayScore);
      return `${x},${y}`;
    })
    .join(' ');

  // Grid concentric rings (25, 50, 75, 100)
  const rings = [0.25, 0.5, 0.75, 1];

  return (
    <div className="bg-white dark:bg-[#1A1D33] rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800/80 flex flex-col justify-between transition-colors h-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
            Skill Breakdown
          </h3>
          {isAllZero && (
            <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md">
              Assessment Pending
            </span>
          )}
        </div>

        {/* SVG Radar Chart */}
        <div className="relative flex justify-center items-center my-2">
          <svg className="w-56 h-56 overflow-visible" viewBox="0 0 200 200">
            {/* Grid Rings */}
            {rings.map((ring, rIdx) => {
              const ringPoints = skillList
                .map((_, idx) => {
                  const angle = (Math.PI * 2 / numAxes) * idx - Math.PI / 2;
                  const r = ring * radius;
                  const x = center + r * Math.cos(angle);
                  const y = center + r * Math.sin(angle);
                  return `${x},${y}`;
                })
                .join(' ');
              return (
                <polygon
                  key={rIdx}
                  points={ringPoints}
                  className="stroke-slate-200 dark:stroke-slate-800 fill-none"
                  strokeWidth="1"
                />
              );
            })}

            {/* Radar Spoke Lines */}
            {skillList.map((_, idx) => {
              const { x, y } = getCoordinates(idx, 100);
              return (
                <line
                  key={idx}
                  x1={center}
                  y1={center}
                  x2={x}
                  y2={y}
                  className="stroke-slate-200 dark:stroke-slate-800"
                  strokeWidth="1"
                />
              );
            })}

            {/* Data Polygon */}
            <polygon
              points={valuePoints}
              className="fill-indigo-500/20 stroke-indigo-600 dark:stroke-indigo-400"
              strokeWidth="2"
            />

            {/* Data Dots */}
            {skillList.map((s, idx) => {
              const displayScore = isAllZero ? 5 : Number(s.score) || 0;
              const { x, y } = getCoordinates(idx, displayScore);
              return (
                <circle
                  key={idx}
                  cx={x}
                  cy={y}
                  r="3.5"
                  className="fill-indigo-600 dark:fill-indigo-400 stroke-white dark:stroke-[#1A1D33]"
                  strokeWidth="1.5"
                />
              );
            })}

            {/* Axis Labels */}
            {skillList.map((s, idx) => {
              const angle = (Math.PI * 2 / numAxes) * idx - Math.PI / 2;
              const labelRadius = radius + 22;
              const lx = center + labelRadius * Math.cos(angle);
              const ly = center + labelRadius * Math.sin(angle);

              let textAnchor = 'middle';
              if (Math.cos(angle) > 0.3) textAnchor = 'start';
              if (Math.cos(angle) < -0.3) textAnchor = 'end';

              return (
                <text
                  key={idx}
                  x={lx}
                  y={ly}
                  textAnchor={textAnchor}
                  dominantBaseline="middle"
                  className="text-[10px] font-bold fill-slate-600 dark:fill-slate-400"
                >
                  {safeText(s.category)}
                </text>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Outlined Purple Button */}
      <div className="mt-6 pt-2">
        <button
          onClick={() => navigate('/assessments')}
          className="w-full py-2.5 px-4 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold text-xs hover:bg-indigo-100 dark:hover:bg-indigo-950/80 transition-colors"
        >
          {isAllZero ? 'Take Assessment to Build Graph' : 'Improve Your Skills'}
        </button>
      </div>
    </div>
  );
};
