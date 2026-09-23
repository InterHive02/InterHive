import React from 'react';
import { Building2, CheckCircle2, Clock } from 'lucide-react';
import { useCompany } from '../../../api/hooks/use-company';

export const AdminCompaniesPage: React.FC = () => {
  const { useCompanies } = useCompany();
  const { data: companiesData } = useCompanies();
  const companies = Array.isArray(companiesData) ? companiesData : (companiesData as any)?.data || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Partner Companies</h1>
        <p className="text-sm text-gray-500">Manage hiring partner relationships, agreements, and outreach requests</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700/60 p-4 sm:p-6">
        {/* Mobile Stacked Card View (< 640px) */}
        <div className="block sm:hidden space-y-3">
          {companies.length > 0 ? (
            companies.map((c: any, idx: number) => (
              <div
                key={c.id || c._id || `company-${idx}`}
                className="p-3.5 rounded-xl border border-gray-100 dark:border-gray-700/80 bg-gray-50/50 dark:bg-gray-700/30 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="font-bold text-gray-900 dark:text-white text-sm truncate">
                    {c.name || 'Company Partner'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {c.industry || 'Technology'}
                  </p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 font-bold shrink-0">
                  Verified
                </span>
              </div>
            ))
          ) : (
            <div className="py-6 text-center text-xs text-gray-400">
              No partner companies found.
            </div>
          )}
        </div>

        {/* Desktop Table (>= 640px) */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-gray-500 border-b border-gray-100 dark:border-gray-700 pb-3">
              <tr>
                <th className="pb-3 font-medium">Company</th>
                <th className="pb-3 font-medium">Industry</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-750">
              {companies.length > 0 ? (
                companies.map((c: any, idx: number) => (
                  <tr key={c.id || c._id || `company-${idx}`} className="hover:bg-gray-50/50">
                    <td className="py-3 font-medium text-gray-900 dark:text-white">{c.name || 'Company Partner'}</td>
                    <td className="py-3 text-xs text-gray-500">{c.industry || 'Technology'}</td>
                    <td className="py-3">
                      <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 font-medium">
                        Verified
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-xs text-gray-400">
                    No partner companies found.
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
