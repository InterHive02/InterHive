import React from 'react';
import { Users } from 'lucide-react';
import { useMatching } from '../../../api/hooks/use-matching';

export const CompanyMatchesPage: React.FC = () => {
  const { useMyMatches } = useMatching();
  const { data: matchesData } = useMyMatches();
  const matches = matchesData?.data || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Matched Intern Talent</h1>
        <p className="text-sm text-gray-500">Review industry-ready candidates matched to your requirements</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700/60 p-6 space-y-4">
        {matches.length > 0 ? (
          matches.map((match: any) => (
            <div key={match.id} className="p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50/50 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{match.internName || 'Candidate'}</h4>
                <p className="text-xs text-gray-500 mt-1">Match Score: {match.score || 85}% • {match.role || 'Full-Stack Developer'}</p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600 font-medium">
                {match.status || 'Matched'}
              </span>
            </div>
          ))
        ) : (
          <div className="text-center py-10">
            <Users className="w-10 h-10 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Intern candidate matches will appear here as readiness assessments complete.</p>
          </div>
        )}
      </div>
    </div>
  );
};
