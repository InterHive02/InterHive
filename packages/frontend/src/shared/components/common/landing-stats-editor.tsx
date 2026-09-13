import React, { useState } from 'react';
import { getLandingStats, saveLandingStats, LandingStats, DEFAULT_LANDING_STATS } from '../../utils/landing-stats';
import { Sliders, Save, RefreshCw, CheckCircle2, Building2, Briefcase, Users, Star } from 'lucide-react';

export const LandingStatsEditor: React.FC = () => {
  const [stats, setStats] = useState<LandingStats>(getLandingStats());
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveLandingStats(stats);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    setStats(DEFAULT_LANDING_STATS);
    saveLandingStats(DEFAULT_LANDING_STATS);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-gray-900 dark:text-white">
              Manage Landing Page Metrics
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              Update stats displayed live on the public landing page hero section.
            </p>
          </div>
        </div>

        {saved && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            Live Updated!
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Top Companies */}
          <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-750 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                Top Companies
              </label>
            </div>
            <input
              type="text"
              value={stats.topCompanies}
              onChange={e => setStats({ ...stats, topCompanies: e.target.value })}
              placeholder="e.g. 500+"
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500/40 focus:outline-none"
            />
          </div>

          {/* Active Internships */}
          <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-750 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <Briefcase className="w-4 h-4 text-purple-600" />
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                Active Internships
              </label>
            </div>
            <input
              type="text"
              value={stats.activeInternships}
              onChange={e => setStats({ ...stats, activeInternships: e.target.value })}
              placeholder="e.g. 10K+"
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500/40 focus:outline-none"
            />
          </div>

          {/* Students Placed */}
          <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-750 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-emerald-600" />
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                Students Placed
              </label>
            </div>
            <input
              type="text"
              value={stats.studentsPlaced}
              onChange={e => setStats({ ...stats, studentsPlaced: e.target.value })}
              placeholder="e.g. 50K+"
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500/40 focus:outline-none"
            />
          </div>

          {/* User Rating */}
          <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-750 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                User Rating
              </label>
            </div>
            <input
              type="text"
              value={stats.userRating}
              onChange={e => setStats({ ...stats, userRating: e.target.value })}
              placeholder="e.g. 4.8/5"
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500/40 focus:outline-none"
            />
          </div>

        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Defaults
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 flex items-center gap-1.5 transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            Save Landing Page Metrics
          </button>
        </div>
      </form>
    </div>
  );
};
