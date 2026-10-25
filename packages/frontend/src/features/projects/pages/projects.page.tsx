import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Plus, Briefcase, Building2, Clock, CheckCircle2, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useProject } from '../hooks/use-project';
import { useAuth } from '../../../api/hooks/use-auth';

export const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { useMyProjects } = useProject();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const { data: rawProjects, isLoading } = useMyProjects();

  // Load user-scoped project progress
  const userProjectsState = useMemo(() => {
    if (typeof window === 'undefined') return {};
    const key = user?.id ? `interhive_user_projects_${user.id}` : 'interhive_user_projects';
    const raw = localStorage.getItem(key);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        return {};
      }
    }
    return {};
  }, [user?.id]);

  const fetchedProjects = Array.isArray(rawProjects)
    ? rawProjects
    : (rawProjects as any)?.data || [];

  // Foundational engineering project tracks available for all students to build industry proof
  const standardProjects = [
    {
      id: 'sprint-task-manager',
      title: 'Microservices Task & Workflow Engine',
      description: 'Architect a resilient event-driven NestJS microservice task board with PostgreSQL indexing and JWT authentication.',
      companyName: 'InterHive Engineering Lab',
      badge: 'Core Practice Sprint',
      category: 'Full Stack & Backend',
      teamSize: { min: 2, max: 4 },
      durationText: '30 Days Sprint',
    },
    {
      id: 'sprint-analytics-portal',
      title: 'High-Throughput Analytics & Logging Dashboard',
      description: 'Build a responsive real-time client metrics dashboard with React, Tailwind UI, chart visualizations, and Docker deployment.',
      companyName: 'InterHive Engineering Lab',
      badge: 'Core Practice Sprint',
      category: 'Frontend & Systems',
      teamSize: { min: 2, max: 3 },
      durationText: '21 Days Sprint',
    },
  ];

  const allProjects = fetchedProjects.length > 0 ? fetchedProjects : standardProjects.map((p) => {
    const saved = userProjectsState[p.id];
    const progress = saved?.progress ?? 0;
    const status = progress === 100 ? 'completed' : progress > 0 ? 'in_progress' : 'not_started';
    return {
      ...p,
      progress,
      status,
    };
  });

  const filteredProjects = allProjects.filter((p: any) => {
    const matchesSearch =
      (p.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.companyName || p.company?.name || '').toLowerCase().includes(searchTerm.toLowerCase());

    if (filterStatus === 'in_progress') return matchesSearch && (p.status === 'in_progress' || p.status === 'active');
    if (filterStatus === 'completed') return matchesSearch && p.status === 'completed';
    return matchesSearch;
  });

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Engineering Projects & Sprints
          </h1>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
            Build production-grade deliverables, manage sprint tasks, and submit pull requests for mentor review.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search projects..."
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#1A1D33] border border-slate-200/80 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all shadow-2xs"
          />
        </div>
      </div>

      {/* Allocation Notice for New Students */}
      {fetchedProjects.length === 0 && (
        <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
              <strong>Corporate Client Project Matching:</strong> Direct company client projects are allocated upon passing your Technical Diagnostic Assessment. Below are your active practice sprint tracks.
            </p>
          </div>
          <button
            onClick={() => navigate('/assessments')}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs whitespace-nowrap transition-colors shrink-0"
          >
            Take Assessment →
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto">
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
            filterStatus === 'all'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white dark:bg-[#151829] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
          }`}
        >
          All Sprints ({allProjects.length})
        </button>
        <button
          onClick={() => setFilterStatus('in_progress')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
            filterStatus === 'in_progress'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white dark:bg-[#151829] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
          }`}
        >
          In Progress ({allProjects.filter((p: any) => p.status === 'in_progress' || p.status === 'active').length})
        </button>
        <button
          onClick={() => setFilterStatus('completed')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
            filterStatus === 'completed'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white dark:bg-[#151829] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
          }`}
        >
          Completed ({allProjects.filter((p: any) => p.status === 'completed').length})
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.map((p: any) => {
          const progress = p.progress ?? 0;
          const status = p.status || 'not_started';
          const company = p.companyName || p.company?.name || 'InterHive Lab';
          const badgeText = p.badge || 'Practice Sprint';

          return (
            <div
              key={p.id}
              className="bg-white dark:bg-[#151829] rounded-[2rem] p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-6 hover:shadow-xl hover:border-blue-200 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-md border border-indigo-200/50 dark:border-indigo-800/50">
                    {badgeText}
                  </span>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    status === 'completed'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
                      : status === 'in_progress' || status === 'active'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}>
                    {status === 'completed' ? 'Completed 100%' : status === 'in_progress' || status === 'active' ? `${progress}% Active` : 'Not Started'}
                  </span>
                </div>

                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1">
                  {p.title}
                </h3>
                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">
                  Organization: {company}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {p.description}
                </p>
              </div>

              <div className="space-y-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                {/* Progress bar */}
                <div>
                  <div className="flex justify-between text-[11px] font-bold text-slate-500 mb-1">
                    <span>Deliverables Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {p.durationText || '30 Days Sprint'}
                  </span>

                  <button
                    onClick={() => navigate(`/projects/${p.id}`)}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>{status === 'completed' ? 'Review Board' : status === 'in_progress' ? 'Open Sprint Board' : 'Join Sprint'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
