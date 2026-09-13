import React, { useState } from 'react';
import { CheckSquare, Search, Filter, FolderKanban, GitPullRequest, Users, Building2, CheckCircle2, Clock, ExternalLink } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const TeamProjectsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [projects, setProjects] = useState([
    {
      id: 'tp-01',
      title: 'Distributed Microservices & Event Stream Engine',
      company: 'TechCorp India',
      cohort: 'Batch 12 • 4 Interns',
      leadIntern: 'Vikram Mehta',
      progress: 74,
      openPrs: 3,
      status: 'In Progress',
      deadline: '18 Sep 2026',
    },
    {
      id: 'tp-02',
      title: 'Customer Data Platform & ETL Analytics Pipeline',
      company: 'Innovate AI Labs',
      cohort: 'Batch 04 • 3 Interns',
      leadIntern: 'Priya Patel',
      progress: 58,
      openPrs: 2,
      status: 'In Progress',
      deadline: '24 Sep 2026',
    },
    {
      id: 'tp-03',
      title: 'Next.js 14 Design System & Micro-Frontend',
      company: 'Nexus FinTech',
      cohort: 'Batch 12 • 3 Interns',
      leadIntern: 'Sneha Reddy',
      progress: 92,
      openPrs: 1,
      status: 'Under Final Review',
      deadline: '14 Sep 2026',
    },
    {
      id: 'tp-04',
      title: 'Multi-Cluster Kubernetes & Observability Setup',
      company: 'CloudWave Systems',
      cohort: 'Batch 08 • 4 Interns',
      leadIntern: 'Aman Verma',
      progress: 100,
      openPrs: 0,
      status: 'Completed',
      deadline: '10 Sep 2026',
    },
  ]);

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.leadIntern.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleSignOff = (projectId: string, title: string) => {
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, status: 'Completed', progress: 100, openPrs: 0 } : p));
    toast.success(`Milestone approved for ${title}!`);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Active Team Projects</h1>
          <p className="text-sm text-gray-500">Track industrial live-project submissions, PRs, and milestone sign-offs</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search projects by title, company partner, or intern lead..."
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121526] text-slate-900 dark:text-white"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121526] text-slate-900 dark:text-white"
        >
          <option value="all">All Statuses</option>
          <option value="In Progress">In Progress</option>
          <option value="Under Final Review">Under Final Review</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProjects.map((proj) => (
          <div
            key={proj.id}
            className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121526] hover:border-indigo-500/40 transition-all shadow-2xs space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{proj.title}</h3>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                  <Building2 className="w-3.5 h-3.5 text-teal-600" />
                  {proj.company} • {proj.cohort}
                </p>
              </div>
              <span
                className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                  proj.status === 'Completed'
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                    : proj.status === 'Under Final Review'
                    ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                    : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300'
                }`}
              >
                {proj.status}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-500">Milestone Progress</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">{proj.progress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                  style={{ width: `${proj.progress}%` }}
                />
              </div>
            </div>

            {/* Info Footer */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-3 text-slate-500">
                <span className="flex items-center gap-1 font-medium">
                  <GitPullRequest className="w-3.5 h-3.5 text-amber-500" />
                  {proj.openPrs} Open PRs
                </span>
                <span className="flex items-center gap-1 font-medium">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Due {proj.deadline}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {proj.status !== 'Completed' && (
                  <button
                    onClick={() => handleSignOff(proj.id, proj.title)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors"
                  >
                    Sign Off
                  </button>
                )}
                <button
                  onClick={() => toast.success(`Opening GitHub pull request review for ${proj.title}`)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                >
                  Review PRs
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
