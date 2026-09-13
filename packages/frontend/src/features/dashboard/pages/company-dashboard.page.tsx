import React from 'react';
import { Link } from 'react-router-dom';
import { DashboardHeader } from '../components/dashboard-header';
import { useCompany } from '../../../api/hooks/use-company';
import { useMatching } from '../../../api/hooks/use-matching';
import { Building2, Users, Calendar, Award, Plus, ArrowRight, CheckCircle2, Clock } from 'lucide-react';

export const CompanyDashboardPage: React.FC = () => {
  const { useProfile, useRequirements } = useCompany();
  const { useMyMatches } = useMatching();

  const { data: profile } = useProfile();
  const { data: requirements } = useRequirements(profile?.id || '', 'published');
  const { data: matches } = useMyMatches();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <DashboardHeader
          title="Company Dashboard"
          subtitle="Manage your hiring requirements and discover industry-ready intern talent"
        />
        <Link
          to="/company/requirements/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium text-sm transition-all shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Post Requirement</span>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700/60">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Requirements</p>
            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-3">
            {requirements?.filter((r: any) => r.status === 'published').length || 0}
          </p>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1 inline-block">● Open for applicants</span>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700/60">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Matched Interns</p>
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-3">
            {matches?.data?.length || 0}
          </p>
          <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 inline-block">Pre-vetted by InterHive</span>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700/60">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Interviews Scheduled</p>
            <div className="p-2 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-lg">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-3">
            {matches?.data?.filter((m: any) => m.status === 'interview_scheduled').length || 0}
          </p>
          <span className="text-xs text-amber-600 dark:text-amber-400 mt-1 inline-block font-medium">In pipeline</span>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700/60">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Hires Made</p>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-3">
            {matches?.data?.filter((m: any) => m.status === 'hired').length || 0}
          </p>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 inline-block font-medium">Successfully placed</span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Requirements List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700/60">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              Recent Job Requirements
            </h3>
            <Link to="/company/requirements" className="text-xs font-medium text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {requirements && requirements.length > 0 ? (
              requirements.slice(0, 4).map((req: any) => (
                <div key={req.id} className="p-3.5 rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-750 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">{req.title}</h4>
                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span>{req.department || 'Engineering'}</span>
                      <span>•</span>
                      <span>{req.openings || 1} Openings</span>
                      <span>•</span>
                      <span className="capitalize text-emerald-600 dark:text-emerald-400">{req.status}</span>
                    </div>
                  </div>
                  <Link
                    to={`/company/requirements`}
                    className="text-xs px-2.5 py-1 rounded bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50"
                  >
                    Details
                  </Link>
                </div>
              ))
            ) : (
              <div className="text-center py-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                <Building2 className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">No active job requirements yet.</p>
                <Link
                  to="/company/requirements"
                  className="mt-2 text-xs font-semibold text-primary hover:underline inline-block"
                >
                  Create your first requirement
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Top Matches List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700/60">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              Vetted Candidate Matches
            </h3>
            <Link to="/company/matches" className="text-xs font-medium text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {matches?.data && matches.data.length > 0 ? (
              matches.data.slice(0, 4).map((match: any) => (
                <div key={match.id} className="p-3.5 rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-750 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                      {match.internName ? match.internName.substring(0, 2).toUpperCase() : 'IN'}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">{match.internName || 'Candidate'}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Score: <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{match.score || 85}%</span> • Ready for {match.role || 'Placement'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-medium capitalize">
                      {match.status || 'matched'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">Intern candidates will appear here as readiness assessments complete.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
