import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Users, Briefcase, FileText, Upload, Plus, CheckCircle2, Circle, Clock, Check, ExternalLink, Github, ShieldCheck } from 'lucide-react';
import { useProject } from '../hooks/use-project';
import { useAuth } from '../../../api/hooks/use-auth';
import { toast } from 'react-hot-toast';

export const ProjectDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { useProject: useProjectDetails } = useProject();
  const { data: apiProject } = useProjectDetails(id || '');

  const [githubUrl, setGithubUrl] = useState('');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [submittedLink, setSubmittedLink] = useState<string | null>(null);

  const defaultProjectsRepo: Record<string, any> = {
    'sprint-task-manager': {
      id: 'sprint-task-manager',
      title: 'Microservices Task & Workflow Engine',
      description: 'Architect a resilient event-driven NestJS microservice task board with PostgreSQL indexing and JWT authentication.',
      companyName: 'InterHive Engineering Lab',
      category: 'Full Stack & Backend',
      leadMentor: 'Staff Backend Architect',
      tasks: [
        { id: 't-1', title: 'Initialize NestJS repository with strict TypeScript & ESLint configuration', points: 25 },
        { id: 't-2', title: 'Design PostgreSQL relational schema (Users, Tasks, Projects) with indexes', points: 25 },
        { id: 't-3', title: 'Implement JWT Auth guard & Role-Based Access Control middleware', points: 25 },
        { id: 't-4', title: 'Write comprehensive PyTest/Jest integration tests and containerize with Docker', points: 25 },
      ],
    },
    'sprint-analytics-portal': {
      id: 'sprint-analytics-portal',
      title: 'High-Throughput Analytics & Logging Dashboard',
      description: 'Build a responsive real-time client metrics dashboard with React, Tailwind UI, chart visualizations, and Docker deployment.',
      companyName: 'InterHive Engineering Lab',
      category: 'Frontend & Systems',
      leadMentor: 'Senior Frontend Architect',
      tasks: [
        { id: 't-1', title: 'Scaffold Vite + React + TypeScript project with Tailwind CSS tokens', points: 25 },
        { id: 't-2', title: 'Implement Recharts/SVG metrics graphs with period filter controls', points: 25 },
        { id: 't-3', title: 'Build dark/light responsive layout with sidebar navigation', points: 25 },
        { id: 't-4', title: 'Configure multi-stage Dockerfile and Vercel/Cloud deployment pipeline', points: 25 },
      ],
    },
  };

  const project = (apiProject as any)?.data || apiProject || defaultProjectsRepo[id || ''] || defaultProjectsRepo['sprint-task-manager'];

  const storageKey = user?.id ? `interhive_user_projects_${user.id}` : 'interhive_user_projects';

  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const state = JSON.parse(raw);
        return state[project.id]?.completedTasks || [];
      }
    } catch (e) {
      return [];
    }
    return [];
  });

  const totalTasks = project.tasks?.length || 4;
  const completedCount = completedTaskIds.length;
  const progressPercent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  const handleToggleTask = (taskId: string) => {
    const isDone = completedTaskIds.includes(taskId);
    let updated: string[];
    if (isDone) {
      updated = completedTaskIds.filter((tid) => tid !== taskId);
    } else {
      updated = [...completedTaskIds, taskId];
      toast.success('Task marked completed! Project progress updated.');
    }
    setCompletedTaskIds(updated);

    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(storageKey);
        const state = raw ? JSON.parse(raw) : {};
        const newProgress = Math.round((updated.length / totalTasks) * 100);
        state[project.id] = {
          completedTasks: updated,
          progress: newProgress,
          updatedAt: new Date().toISOString(),
        };
        localStorage.setItem(storageKey, JSON.stringify(state));
      } catch (e) {}
    }
  };

  const handleSaveSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!githubUrl) {
      toast.error('Please enter a GitHub repository or live URL');
      return;
    }
    setSubmittedLink(githubUrl);
    setIsSubmitModalOpen(false);
    toast.success('Deliverable submitted successfully for mentor code review!');
  };

  return (
    <div className="space-y-6 pb-16 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/projects')}
          className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-md border border-blue-200/50">
              {project.category || 'Engineering Sprint'}
            </span>
            <span className="text-xs font-semibold text-slate-400">
              Organization: {project.companyName || project.company?.name || 'InterHive Lab'}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
            {project.title}
          </h1>
        </div>

        <div className="text-right">
          <span className="text-xl font-black text-blue-600 dark:text-blue-400">{progressPercent}%</span>
          <span className="block text-[10px] font-bold text-slate-400">Completed</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${progressPercent}%` }} />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Task Board */}
        <div className="lg:col-span-7 bg-white dark:bg-[#151829] rounded-[2rem] p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-blue-600" />
              <span>Sprint Deliverables Checklist</span>
            </h2>
            <span className="text-xs font-semibold text-slate-400">
              {completedCount} / {totalTasks} finished
            </span>
          </div>

          <div className="space-y-3">
            {(project.tasks || []).map((t: any, idx: number) => {
              const isDone = completedTaskIds.includes(t.id);
              return (
                <div
                  key={t.id || idx}
                  onClick={() => handleToggleTask(t.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                    isDone
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800'
                      : 'bg-slate-50 dark:bg-[#1A1D33] border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleTask(t.id);
                    }}
                    className="p-0.5 mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer shrink-0"
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <p className={`text-xs sm:text-sm font-bold ${
                      isDone ? 'line-through text-slate-500 dark:text-slate-400' : 'text-slate-900 dark:text-white'
                    }`}>
                      {t.title}
                    </p>
                    <span className="text-[10px] font-semibold text-slate-400 block mt-1">
                      Milestone · {t.points || 25} Sprint Points
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Submission Bar */}
          <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="font-bold text-xs text-indigo-700 dark:text-indigo-300 block">
                {submittedLink ? 'Deliverable Submitted ✅' : 'Submit Code for Mentor Review'}
              </span>
              <p className="text-[11px] text-slate-500">
                {submittedLink ? `Repo: ${submittedLink}` : 'Attach your GitHub repository or hosted project demo link.'}
              </p>
            </div>

            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs whitespace-nowrap shadow-xs transition-all cursor-pointer"
            >
              {submittedLink ? 'Update Submission' : 'Submit Deliverable'}
            </button>
          </div>
        </div>

        {/* Sprint Overview Sidebar */}
        <div className="lg:col-span-5 bg-white dark:bg-[#151829] rounded-[2rem] p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
            Sprint Specifications
          </h3>

          <div className="text-xs space-y-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#1A1D33] border border-slate-200/60 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 block mb-1">Architecture Overview</span>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                {project.description}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#1A1D33] border border-slate-200/60 dark:border-slate-800 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Assigned Mentor:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{project.leadMentor || 'Staff Architect'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Target Stack:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">TypeScript, React, NestJS, SQL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Review SLA:</span>
                <span className="font-bold text-emerald-600">Within 24-48 Hours</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40 text-xs text-slate-700 dark:text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-600 mb-1" />
              <span>Completed deliverables are directly showcased to hiring partner engineering managers.</span>
            </div>
          </div>
        </div>

      </div>

      {/* Submission Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-[#151829] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Submit Project Deliverable
            </h3>
            <p className="text-xs text-slate-500">
              Provide your public GitHub repository URL or live deployed web application link.
            </p>

            <form onSubmit={handleSaveSubmission} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  GitHub Repository / Live Demo URL
                </label>
                <div className="relative">
                  <Github className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="url"
                    required
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/yourusername/project"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1A1D33] text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20"
                >
                  Submit for Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
