import React from 'react';
import { Building2, Plus } from 'lucide-react';
import { useCompany } from '../../../api/hooks/use-company';

export const CompanyRequirementsPage: React.FC = () => {
  const { useProfile, useRequirements } = useCompany();
  const { data: profile } = useProfile();
  const { data: requirements } = useRequirements(profile?.id || '');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Talent Requirements</h1>
          <p className="text-sm text-gray-500">Post and manage job positions and internship roles</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700/60 p-6 space-y-4">
        {requirements && requirements.length > 0 ? (
          requirements.map((req: any) => (
            <div key={req.id} className="p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50/50 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{req.title}</h4>
                <p className="text-xs text-gray-500 mt-1">{req.department} • {req.openings || 1} Openings • {req.workType || 'Remote'}</p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 font-medium">
                {req.status || 'Active'}
              </span>
            </div>
          ))
        ) : (
          <div className="text-center py-10">
            <Building2 className="w-10 h-10 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No requirements published yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};
