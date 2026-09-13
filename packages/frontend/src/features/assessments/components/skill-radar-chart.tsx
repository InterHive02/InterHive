import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';

interface SkillRadarChartProps {
  skills: {
    category: string;
    score: number;
    fullMark?: number;
  }[];
}

export const SkillRadarChart: React.FC<SkillRadarChartProps> = ({ skills }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart data={skills}>
        <PolarGrid stroke="#374151" />
        <PolarAngleAxis
          dataKey="category"
          tick={{ fill: '#9CA3AF', fontSize: 12 }}
        />
        <PolarRadiusAxis
          angle={30}
          domain={[0, 100]}
          tick={{ fill: '#9CA3AF', fontSize: 10 }}
        />
        <Radar
          name="Skills"
          dataKey="score"
          stroke="#4F46E5"
          fill="#4F46E5"
          fillOpacity={0.6}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
};
