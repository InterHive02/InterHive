import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, BookOpen, CheckCircle2, Play, ArrowRight, Award, Clock, Sparkles } from 'lucide-react';
import { useTraining } from '../hooks/use-training';

export const TrainingPage: React.FC = () => {
  const navigate = useNavigate();
  const { useAvailablePrograms, useMyEnrollments } = useTraining();
  const [activeTab, setActiveTab] = useState<'all' | 'in_progress' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: programsData, isLoading: programsLoading } = useAvailablePrograms();
  const { data: enrollmentsData, isLoading: enrollmentsLoading } = useMyEnrollments();

  // Official PRD Training Modules matching Image 2 Middle-Right
  const modules = [
    {
      id: 'mod-1',
      title: 'Python for Industry',
      subtitle: 'Basics to Advanced',
      lessons: 12,
      projects: 4,
      status: 'completed' as const,
      progress: 100,
      iconBg: 'bg-purple-100 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400',
      description: 'Master idiomatic Python 3, object-oriented design, data manipulation, and packaging.',
    },
    {
      id: 'mod-2',
      title: 'Web Development',
      subtitle: 'React, Node.js, APIs',
      lessons: 16,
      projects: 5,
      status: 'in_progress' as const,
      progress: 65,
      iconBg: 'bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400',
      description: 'Full-stack application engineering with TypeScript, modern React hooks, and REST APIs.',
    },
    {
      id: 'mod-3',
      title: 'Data Structures & Problem Solving',
      subtitle: 'DSA, SQL, System Design Basics',
      lessons: 14,
      projects: 5,
      status: 'not_started' as const,
      progress: 0,
      iconBg: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400',
      description: 'Algorithmic efficiency, relational database normalization, indexing, and architecture design.',
    },
    {
      id: 'mod-4',
      title: 'Professional Skills',
      subtitle: 'Communication, Teamwork, Resume',
      lessons: 8,
      projects: 2,
      status: 'not_started' as const,
      progress: 0,
      iconBg: 'bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400',
      description: 'Corporate workplace etiquette, Agile sprint ceremonies, technical documentation, and interview mastery.',
    },
  ];

  const filteredModules = modules.filter(m => {
    const matchesSearch = m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.subtitle.toLowerCase().includes(searchTerm.toLowerCase());
    if (activeTab === 'in_progress') return matchesSearch && m.status === 'in_progress';
    if (activeTab === 'completed') return matchesSearch && m.status === 'completed';
    return matchesSearch;
  });

  return (
    <div className="space-y-6 pb-16">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Training Modules
          </h1>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
            Complete all modules to become industry-ready before company matching.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search training modules..."
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#1A1D33] border border-slate-200/80 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all shadow-2xs"
          />
        </div>
      </div>

      {/* Tabs matching Image 2 Middle-Right: All Modules, In Progress, Completed */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
            activeTab === 'all'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white dark:bg-[#151829] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
          }`}
        >
          All Modules ({modules.length})
        </button>
        <button
          onClick={() => setActiveTab('in_progress')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
            activeTab === 'in_progress'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white dark:bg-[#151829] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
          }`}
        >
          In Progress ({modules.filter(m => m.status === 'in_progress').length})
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
            activeTab === 'completed'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white dark:bg-[#151829] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
          }`}
        >
          Completed ({modules.filter(m => m.status === 'completed').length})
        </button>
      </div>

      {/* Modules List matching Image 2 */}
      <div className="space-y-4">
        {filteredModules.map(mod => (
          <div
            key={mod.id}
            className="bg-white dark:bg-[#151829] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5 hover:shadow-md hover:border-blue-200 transition-all"
          >
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-2xl ${mod.iconBg} flex items-center justify-center shrink-0 shadow-2xs`}>
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {mod.title}
                  </h3>
                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                    mod.status === 'completed'
                      ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                      : mod.status === 'in_progress'
                      ? 'bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                  }`}>
                    {mod.status === 'completed' ? 'Completed 100%' : mod.status === 'in_progress' ? 'In-Progress' : 'Not Started'}
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {mod.subtitle} · {mod.lessons} Lessons · {mod.projects} Projects
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium pt-1 max-w-xl">
                  {mod.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 self-end md:self-center">
              {mod.status === 'in_progress' && (
                <div className="w-32 hidden sm:block">
                  <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                    <span>Progress</span>
                    <span>{mod.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${mod.progress}%` }} />
                  </div>
                </div>
              )}

              <button
                onClick={() => navigate(`/training/${mod.id}`)}
                className={`px-5 py-2.5 rounded-xl font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                  mod.status === 'completed'
                    ? 'bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                    : mod.status === 'in_progress'
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/25'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white'
                }`}
              >
                <span>{mod.status === 'completed' ? 'Review Module' : mod.status === 'in_progress' ? 'Continue' : 'Start Module'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
