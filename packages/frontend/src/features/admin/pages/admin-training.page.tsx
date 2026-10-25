import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Eye,
  Edit2,
  Trash2,
  X,
  Users,
  Award,
  ChevronDown,
  ChevronUp,
  Layers,
  GraduationCap,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  ExternalLink,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

interface TrainingTrack {
  id: string;
  title: string;
  category: string;
  durationDays: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  status: 'active' | 'draft' | 'archived';
  enrolledStudents: number;
  completionRate: number;
  modulesCount: number;
  modules: { week: number; title: string; lessonsCount: number }[];
}

export const AdminTrainingPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'tracks' | 'roster'>('tracks');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedTrackId, setExpandedTrackId] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrack, setEditingTrack] = useState<TrainingTrack | null>(null);
  const [form, setForm] = useState({
    title: '',
    category: 'Full-Stack Web Engineering',
    durationDays: 45,
    level: 'Intermediate' as 'Beginner' | 'Intermediate' | 'Advanced',
    status: 'active' as 'active' | 'draft',
    modulesCount: 6,
  });

  const [tracks, setTracks] = useState<TrainingTrack[]>([
    {
      id: 'trk-fs-01',
      title: '45-Day Full-Stack Web Engineering Accelerator',
      category: 'Software Engineering',
      durationDays: 45,
      level: 'Intermediate',
      status: 'active',
      enrolledStudents: 142,
      completionRate: 84,
      modulesCount: 6,
      modules: [
        { week: 1, title: 'Modern TypeScript & Scalable Frontend Architecture', lessonsCount: 8 },
        { week: 2, title: 'NestJS Backend API Architecture & Clean Services', lessonsCount: 9 },
        { week: 3, title: 'MongoDB, PostgreSQL & Redis Distributed Caching', lessonsCount: 7 },
        { week: 4, title: 'Microservices & Event-Driven Architecture', lessonsCount: 8 },
        { week: 5, title: 'Docker, CI/CD Pipeline & Cloud Deployment', lessonsCount: 6 },
        { week: 6, title: 'Capstone Enterprise Sprint & Mentored Code Review', lessonsCount: 5 },
      ],
    },
    {
      id: 'trk-ai-02',
      title: '60-Day Data Engineering & Machine Learning Systems',
      category: 'AI & Data Science',
      durationDays: 60,
      level: 'Advanced',
      status: 'active',
      enrolledStudents: 88,
      completionRate: 79,
      modulesCount: 8,
      modules: [
        { week: 1, title: 'Data Structures, Algorithms & Python High Performance', lessonsCount: 8 },
        { week: 2, title: 'ETL Pipelines, Pandas & Distributed Spark Jobs', lessonsCount: 10 },
        { week: 3, title: 'Machine Learning Models & Feature Engineering', lessonsCount: 8 },
        { week: 4, title: 'Deep Learning & Neural Networks with PyTorch', lessonsCount: 9 },
        { week: 5, title: 'Model Serving via FastAPI & Docker Containers', lessonsCount: 7 },
        { week: 6, title: 'Production MLOps, Tracking & Cloud Inference', lessonsCount: 6 },
      ],
    },
    {
      id: 'trk-devops-03',
      title: '30-Day DevOps & Cloud SRE Bootcamp',
      category: 'Cloud & Infrastructure',
      durationDays: 30,
      level: 'Advanced',
      status: 'active',
      enrolledStudents: 64,
      completionRate: 88,
      modulesCount: 4,
      modules: [
        { week: 1, title: 'Linux System Internals, Bash Scripting & Networking', lessonsCount: 7 },
        { week: 2, title: 'Docker Containerization & Kubernetes Cluster Ops', lessonsCount: 9 },
        { week: 3, title: 'AWS Cloud Architecture, Terraform & IAC', lessonsCount: 8 },
        { week: 4, title: 'Prometheus, Grafana Monitoring & Incident Response', lessonsCount: 6 },
      ],
    },
    {
      id: 'trk-design-04',
      title: '45-Day Digital Product & UI/UX Design System Cohort',
      category: 'Product Design',
      durationDays: 45,
      level: 'Beginner',
      status: 'draft',
      enrolledStudents: 0,
      completionRate: 0,
      modulesCount: 6,
      modules: [
        { week: 1, title: 'User Research, Heuristic Audits & Persona Mapping', lessonsCount: 6 },
        { week: 2, title: 'Information Architecture & Wireframing in Figma', lessonsCount: 8 },
        { week: 3, title: 'Modern Design Systems, Tokens & Component Kits', lessonsCount: 7 },
      ],
    },
  ]);

  const cohortRoster = [
    { name: 'Ankit Yadav', email: 'ankit.y@example.com', track: '45-Day Full-Stack Web', progress: 85, status: 'On Track', mentor: 'Senior Engineering Team' },
    { name: 'Priya Sharma', email: 'priya.s@example.com', track: '60-Day Data Engineering', progress: 92, status: 'Excelling', mentor: 'Lead AI Engineer' },
    { name: 'Rahul Verma', email: 'rahul.v@example.com', track: '30-Day DevOps & Cloud', progress: 74, status: 'On Track', mentor: 'Cloud Infrastructure Lead' },
    { name: 'Sneha Patel', email: 'sneha.p@example.com', track: '45-Day Full-Stack Web', progress: 96, status: 'Ready for Matching', mentor: 'Principal Engineer' },
    { name: 'Kunal Joshi', email: 'kunal.j@example.com', track: '45-Day Full-Stack Web', progress: 58, status: 'Needs Support', mentor: 'Staff Developer' },
  ];

  const handleOpenAdd = () => {
    setEditingTrack(null);
    setForm({
      title: '',
      category: 'Software Engineering',
      durationDays: 45,
      level: 'Intermediate',
      status: 'active',
      modulesCount: 6,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (track: TrainingTrack) => {
    setEditingTrack(track);
    setForm({
      title: track.title,
      category: track.category,
      durationDays: track.durationDays,
      level: track.level,
      status: track.status === 'archived' ? 'draft' : track.status,
      modulesCount: track.modulesCount,
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error('Track title is required');
      return;
    }

    if (editingTrack) {
      setTracks((prev) =>
        prev.map((t) =>
          t.id === editingTrack.id
            ? {
                ...t,
                title: form.title,
                category: form.category,
                durationDays: form.durationDays,
                level: form.level,
                status: form.status,
                modulesCount: form.modulesCount,
              }
            : t
        )
      );
      toast.success('Training track updated successfully');
    } else {
      const newTrack: TrainingTrack = {
        id: `trk-${Date.now()}`,
        title: form.title,
        category: form.category,
        durationDays: form.durationDays,
        level: form.level,
        status: form.status,
        enrolledStudents: 0,
        completionRate: 0,
        modulesCount: form.modulesCount,
        modules: [
          { week: 1, title: 'Foundational Core Concepts & Tooling', lessonsCount: 6 },
          { week: 2, title: 'Hands-on Implementation & Sprints', lessonsCount: 8 },
        ],
      };
      setTracks((prev) => [newTrack, ...prev]);
      toast.success('New training track added');
    }
    setIsModalOpen(false);
  };

  const handleToggleStatus = (id: string) => {
    setTracks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextStatus = t.status === 'active' ? 'draft' : 'active';
          toast.success(`Track status set to ${nextStatus}`);
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Are you sure you want to delete this training track?')) return;
    setTracks((prev) => prev.filter((t) => t.id !== id));
    toast.success('Track removed');
  };

  const filteredTracks = tracks.filter((t) => {
    const matchesQuery =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || t.category.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesQuery && matchesCat;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Industrial Training Programs Admin</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Configure 30-day, 45-day, and 60-day curriculum tracks, syllabus modules, and cohort cohorts
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/training')}
            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 text-gray-700 dark:text-gray-200 text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" /> Preview Student View
          </button>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Curriculum Track
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xs border border-gray-100 dark:border-gray-700/60 p-5">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Active Curriculum Tracks</p>
          <p className="text-3xl font-black text-gray-900 dark:text-white mt-1">
            {tracks.filter((t) => t.status === 'active').length}
          </p>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 inline-block">
            {tracks.length} total tracks configured
          </span>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xs border border-gray-100 dark:border-gray-700/60 p-5">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Enrolled Interns</p>
          <p className="text-3xl font-black text-gray-900 dark:text-white mt-1">
            {tracks.reduce((acc, curr) => acc + curr.enrolledStudents, 0)}
          </p>
          <span className="text-[11px] text-indigo-600 font-semibold mt-1 inline-block">
            Active in sprint modules
          </span>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xs border border-gray-100 dark:border-gray-700/60 p-5">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Average Completion Rate</p>
          <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">83.6%</p>
          <span className="text-[11px] text-gray-500 mt-1 inline-block">High milestone adherence</span>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xs border border-gray-100 dark:border-gray-700/60 p-5">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Modules Published</p>
          <p className="text-3xl font-black text-blue-600 dark:text-blue-400 mt-1">
            {tracks.reduce((acc, curr) => acc + curr.modulesCount, 0)}
          </p>
          <span className="text-[11px] text-gray-500 mt-1 inline-block">Interactive lessons & tasks</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/60 shadow-xs overflow-hidden">
        <div className="flex border-b border-gray-100 dark:border-gray-700 px-6 pt-4 gap-6">
          <button
            onClick={() => setActiveTab('tracks')}
            className={`pb-3 text-sm font-bold border-b-2 cursor-pointer transition-all ${
              activeTab === 'tracks' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            Curriculum Tracks ({tracks.length})
          </button>
          <button
            onClick={() => setActiveTab('roster')}
            className={`pb-3 text-sm font-bold border-b-2 cursor-pointer transition-all ${
              activeTab === 'roster' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            Intern Enrollment Roster
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'tracks' ? (
            <div className="space-y-4">
              {/* Filter */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search tracks by title or domain..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-750 border border-gray-200 dark:border-gray-700 rounded-xl text-xs"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 bg-gray-50 dark:bg-gray-750 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold"
                >
                  <option value="all">All Disciplines</option>
                  <option value="software">Software Engineering</option>
                  <option value="ai">AI & Data Science</option>
                  <option value="cloud">Cloud & Infrastructure</option>
                  <option value="design">Product Design</option>
                </select>
              </div>

              {/* Tracks List */}
              <div className="space-y-3">
                {filteredTracks.map((track) => {
                  const isExpanded = expandedTrackId === track.id;
                  return (
                    <div
                      key={track.id}
                      className="p-5 rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 space-y-3 shadow-2xs"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-gray-900 dark:text-white text-sm">{track.title}</h3>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                                track.status === 'active'
                                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40'
                                  : 'bg-amber-50 text-amber-600 dark:bg-amber-950/40'
                              }`}
                            >
                              {track.status}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md">
                              {track.level}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                            <span className="font-medium text-indigo-600 dark:text-indigo-400">{track.category}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" /> {track.durationDays} Days
                            </span>
                            <span>•</span>
                            <span>{track.modulesCount} Modules</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Users className="w-3.5 h-3.5" /> {track.enrolledStudents} Enrolled
                            </span>
                            <span>•</span>
                            <span>{track.completionRate}% Avg Completion</span>
                          </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-2 self-end md:self-center">
                          <button
                            onClick={() => handleToggleStatus(track.id)}
                            className="p-2 text-gray-500 hover:text-indigo-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                            title={track.status === 'active' ? 'Archive Track' : 'Publish Track'}
                          >
                            {track.status === 'active' ? (
                              <ToggleRight className="w-5 h-5 text-emerald-600" />
                            ) : (
                              <ToggleLeft className="w-5 h-5 text-gray-400" />
                            )}
                          </button>
                          <button
                            onClick={() => handleOpenEdit(track)}
                            className="p-2 text-gray-500 hover:text-blue-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                            title="Edit Configuration"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(track.id)}
                            className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setExpandedTrackId(isExpanded ? null : track.id)}
                            className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 flex items-center gap-1 cursor-pointer"
                          >
                            {isExpanded ? 'Hide Syllabus' : 'View Syllabus'}
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      {/* Expandable Syllabus */}
                      {isExpanded && (
                        <div className="pt-3 border-t border-gray-100 dark:border-gray-700 space-y-2 text-xs">
                          <p className="font-bold text-gray-500 uppercase tracking-wider text-[10px]">
                            Curriculum Weekly Syllabus & Modules
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {track.modules.map((m, mIdx) => (
                              <div
                                key={mIdx}
                                className="p-3 bg-gray-50 dark:bg-gray-750 rounded-lg space-y-1 text-gray-700 dark:text-gray-300"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-indigo-600 dark:text-indigo-400 text-[10px]">
                                    WEEK {m.week}
                                  </span>
                                  <span className="text-[10px] text-gray-400">{m.lessonsCount} Lessons</span>
                                </div>
                                <p className="font-semibold text-xs text-gray-900 dark:text-white">{m.title}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Roster Table */
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 dark:bg-gray-750 text-gray-500 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="px-4 py-3">Intern</th>
                    <th className="px-4 py-3">Assigned Track</th>
                    <th className="px-4 py-3">Progress</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Assigned Mentor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {cohortRoster.map((r, i) => (
                    <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                      <td className="px-4 py-3">
                        <p className="font-bold text-gray-900 dark:text-white">{r.name}</p>
                        <p className="text-[10px] text-gray-500">{r.email}</p>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200">{r.track}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${r.progress}%` }} />
                          </div>
                          <span className="font-bold text-gray-900 dark:text-white">{r.progress}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            r.progress >= 90
                              ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40'
                              : r.progress >= 70
                              ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/40'
                              : 'bg-amber-50 text-amber-600 dark:bg-amber-950/40'
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{r.mentor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Add / Edit Track */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                {editingTrack ? 'Edit Curriculum Track' : 'Create Training Track'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Track Title *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. 45-Day Microservices & Cloud Sprint"
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Domain</label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Level</label>
                  <select
                    value={form.level}
                    onChange={(e) => setForm({ ...form, level: e.target.value as any })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Duration (Days)</label>
                  <input
                    type="number"
                    value={form.durationDays}
                    onChange={(e) => setForm({ ...form, durationDays: parseInt(e.target.value) || 30 })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Total Modules</label>
                  <input
                    type="number"
                    value={form.modulesCount}
                    onChange={(e) => setForm({ ...form, modulesCount: parseInt(e.target.value) || 4 })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 font-bold text-gray-600 rounded-xl hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 font-bold text-white bg-primary rounded-xl shadow-xs">
                  {editingTrack ? 'Save Changes' : 'Create Track'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
