import React from 'react';
import { Users, Search, Filter, CheckCircle2, Clock } from 'lucide-react';
import { useIntern } from '../../../api/hooks/use-intern';

export const AdminInternsPage: React.FC = () => {
  const { useInterns } = useIntern();
  const { data: internsData } = useInterns();
  const interns = Array.isArray(internsData) ? internsData : (internsData as any)?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Intern Candidate Roster</h1>
          <p className="text-sm text-gray-500">Track and manage enrolled candidates across preparation cohorts</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700/60 p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-gray-500 border-b border-gray-100 dark:border-gray-700 pb-3">
              <tr>
                <th className="pb-3 font-medium">Intern</th>
                <th className="pb-3 font-medium">Domain</th>
                <th className="pb-3 font-medium">Training Progress</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-750">
              {interns.length > 0 ? (
                interns.map((intern: any) => (
                  <tr key={intern.id} className="hover:bg-gray-50/50">
                    <td className="py-3 font-medium text-gray-900 dark:text-white">{intern.name || 'Candidate'}</td>
                    <td className="py-3 text-xs text-gray-500">{intern.domain || 'Full-Stack Development'}</td>
                    <td className="py-3 text-xs font-semibold text-indigo-600">{intern.progress || 75}%</td>
                    <td className="py-3">
                      <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 font-medium">
                        Active
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-xs text-gray-400">
                    No interns found in the current cohort.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
