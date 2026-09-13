import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Plus } from 'lucide-react';
import { ProjectCard } from '../components/project-card';
import { useProject } from '../hooks/use-project';

export const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const { useMyProjects } = useProject();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');

  const { data: rawProjects, isLoading } = useMyProjects();

  const defaultProjects = [
    {
      id: 'proj-01',
      title: 'Distributed Microservices Architecture',
      description: 'Design and implement resilient event-driven NestJS microservices with Redis Streams and Kafka.',
      status: 'in_progress',
      progress: 68,
      companyName: 'TechCorp India',
      teamSize: { min: 4, max: 6 },
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 86400000).toISOString(),
    },
    {
      id: 'proj-02',
      title: 'Full-Stack Next.js & GraphQL Portal',
      description: 'Develop responsive client-facing analytics portal with real-time subscriptions and Tailwind UI.',
      status: 'planning',
      progress: 25,
      companyName: 'Innovate AI Labs',
      teamSize: { min: 3, max: 5 },
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 45 * 86400000).toISOString(),
    },
    {
      id: 'proj-03',
      title: 'DevOps CI/CD Automation Pipeline',
      description: 'Containerized deployment infrastructure with Docker, Kubernetes manifests, and GitHub Actions.',
      status: 'completed',
      progress: 100,
      companyName: 'CloudWave Systems',
      teamSize: { min: 2, max: 4 },
      startDate: new Date(Date.now() - 40 * 86400000).toISOString(),
      endDate: new Date().toISOString(),
    },
  ];

  const fetchedProjects = Array.isArray(rawProjects)
    ? rawProjects
    : (rawProjects as any)?.data || [];

  const projects = fetchedProjects.length > 0 ? fetchedProjects : defaultProjects;

  const filteredProjects = projects.filter((project: any) => {
    const title = project.title || '';
    const desc = project.description || '';
    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      desc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Projects Workspace</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Industrial live projects, technical milestones, and code deliverables
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-sm transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="planning">Planning</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="paused">Paused</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects?.map((project: any) => (
          <ProjectCard
            key={project.id}
            project={{
              id: project.id,
              title: project.title,
              description: project.description,
              status: project.status,
              progress: project.progress,
              companyId: project.companyId,
              companyName: project.companyId?.companyInfo?.name || 'Company',
              teamSize: project.teamSize,
              startDate: project.duration?.startDate,
              endDate: project.duration?.endDate,
              assignedTo: project.assignedTo || [],
            }}
          />
        ))}
      </div>

      {filteredProjects?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No projects found</p>
        </div>
      )}

      {/* New Project Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-[#121526] rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-100 dark:border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Propose New Project</h3>
            <p className="text-xs text-slate-500">Configure a production track for mentor review.</p>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Project Title</label>
                <input
                  type="text"
                  value={newProjectTitle}
                  onChange={(e) => setNewProjectTitle(e.target.value)}
                  placeholder="e.g. Distributed Cache & Rate Limiting Engine"
                  className="w-full mt-1 px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Description & Deliverables</label>
                <textarea
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                  placeholder="Outline key technical goals, microservices, and PR milestones..."
                  rows={3}
                  className="w-full mt-1 px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setNewProjectTitle('');
                  setNewProjectDesc('');
                }}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Submit Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
