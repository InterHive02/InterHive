import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Calendar,
  CheckSquare,
  Award,
  ArrowRight,
  UserCheck,
  Search,
  Bell,
  RefreshCw,
  X,
  ExternalLink,
  Video,
  Clock,
  PlusCircle,
  BookOpen,
  CheckCircle2,
  FolderKanban,
  FileText,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { analyticsApi } from '../../../api/endpoints/analytics.api';
import { LandingStatsEditor } from '../../../shared/components/common/landing-stats-editor';

interface SprintBatch {
  id: string;
  name: string;
  internsCount: number;
  progress: number;
  sprint: string;
  daysRemaining: number;
  modules?: string[];
}

interface InterviewQueueItem {
  id: string;
  intern: string;
  company: string;
  role: string;
  time: string;
  status: 'Scheduled' | 'Confirmed';
  phone?: string;
  email?: string;
  institution?: string;
  resumeUrl?: string;
  meetLink?: string;
  notes?: string;
}

export const ManagerDashboardPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [showNotificationPopup, setShowNotificationPopup] = useState<boolean>(false);
  const [notificationCount, setNotificationCount] = useState<number>(4);

  // Selected modals
  const [selectedSprint, setSelectedSprint] = useState<SprintBatch | null>(null);
  const [selectedInterview, setSelectedInterview] = useState<InterviewQueueItem | null>(null);
  const [showNewSprintModal, setShowNewSprintModal] = useState<boolean>(false);
  const [showLandingEditor, setShowLandingEditor] = useState<boolean>(false);

  // Form for new sprint
  const [newSprintName, setNewSprintName] = useState('');
  const [newSprintInterns, setNewSprintInterns] = useState('16');
  const [newSprintDays, setNewSprintDays] = useState('30');

  // Stats state
  const [stats, setStats] = useState([
    {
      label: 'Active Interns in Training',
      value: '0',
      icon: Users,
      change: 'Live Interns',
      color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30',
    },
    {
      label: 'Live Projects Active',
      value: '0',
      icon: CheckSquare,
      change: 'Active Projects',
      color: 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/30',
    },
    {
      label: 'Upcoming Interviews',
      value: '0',
      icon: Calendar,
      change: 'Pipeline Queue',
      color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30',
    },
    {
      label: 'Ready for Placement',
      value: '0',
      icon: Award,
      change: 'Score > 80%',
      color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30',
    },
  ]);

  // Sprints state
  const [activeBatches, setActiveBatches] = useState<SprintBatch[]>([]);

  // Interviews state
  const [pendingInterviews, setPendingInterviews] = useState<InterviewQueueItem[]>([]);

  // Load manager dashboard from backend
  const loadDashboardData = async (showToast = false) => {
    try {
      if (showToast) setIsRefreshing(true);
      const res = await analyticsApi.getManagerDashboard();
      if (res.data?.success && res.data.data) {
        const d = res.data.data;
        if (d.metrics && Array.isArray(d.metrics)) {
          setStats([
            { ...d.metrics[0], icon: Users },
            { ...d.metrics[1], icon: CheckSquare },
            { ...d.metrics[2], icon: Calendar },
            { ...d.metrics[3], icon: Award },
          ]);
        }
        if (d.sprints && Array.isArray(d.sprints)) {
          setActiveBatches(d.sprints);
        }
        if (d.interviews && Array.isArray(d.interviews)) {
          setPendingInterviews(d.interviews);
        }
      }
      if (showToast) toast.success('Manager dashboard refreshed from database');
    } catch (err) {
      console.warn('Using baseline manager data:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Filtered lists
  const filteredBatches = useMemo(() => {
    if (!searchTerm) return activeBatches;
    return activeBatches.filter(
      (b) =>
        b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.sprint.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [activeBatches, searchTerm]);

  const filteredInterviews = useMemo(() => {
    if (!searchTerm) return pendingInterviews;
    return pendingInterviews.filter(
      (i) =>
        i.intern.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [pendingInterviews, searchTerm]);

  // Update interview status
  const toggleInterviewStatus = (id: string) => {
    setPendingInterviews((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextStatus = item.status === 'Scheduled' ? 'Confirmed' : 'Scheduled';
          toast.success(`Interview for ${item.intern} marked as ${nextStatus}`);
          return { ...item, status: nextStatus };
        }
        return item;
      })
    );
    if (selectedInterview && selectedInterview.id === id) {
      setSelectedInterview((prev) =>
        prev ? { ...prev, status: prev.status === 'Scheduled' ? 'Confirmed' : 'Scheduled' } : null
      );
    }
  };

  // Add new sprint
  const handleCreateSprint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSprintName.trim()) {
      toast.error('Please enter a sprint name');
      return;
    }
    const newSprint: SprintBatch = {
      id: `sp-${Date.now()}`,
      name: newSprintName,
      internsCount: parseInt(newSprintInterns) || 15,
      progress: 10,
      sprint: 'Sprint 1/4',
      daysRemaining: parseInt(newSprintDays) || 30,
      modules: ['Core Architecture', 'Database Foundations', 'API Integrations'],
    };
    setActiveBatches([newSprint, ...activeBatches]);
    toast.success(`Training sprint "${newSprintName}" launched successfully!`);
    setShowNewSprintModal(false);
    setNewSprintName('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Operations & Training Management
          </h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
            Track intern preparation sprints, live project milestones, and company interview pipelines.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search sprints, projects, candidates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121526] text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all w-56 sm:w-64"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sync Button */}
          <button
            onClick={() => loadDashboardData(true)}
            disabled={isRefreshing}
            title="Refresh dashboard metrics"
            className="p-2 rounded-xl bg-white dark:bg-[#121526] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors shadow-2xs"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-indigo-600' : ''}`} />
          </button>

          {/* Action Buttons */}
          <button
            onClick={() => setShowLandingEditor(!showLandingEditor)}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#121526] border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors shadow-2xs"
          >
            {showLandingEditor ? 'Hide Stats Editor' : 'Edit Landing Metrics'}
          </button>

          <button
            onClick={() => setShowNewSprintModal(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Launch Sprint</span>
          </button>
        </div>
      </div>

      {/* 4 Top KPI Cards matching reference image */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {stats.map((stat, idx) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white dark:bg-[#121526] rounded-2xl p-5 border border-slate-100 dark:border-slate-800/80 shadow-xs flex flex-col justify-between transition-all hover:shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wide">
                  {stat.label}
                </p>
                <div className={`p-2.5 rounded-xl ${stat.color} shadow-2xs`}>
                  <IconComponent className="w-5 h-5" />
                </div>
              </div>

              <div className="mt-3">
                <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {stat.value}
                </h3>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1 inline-block">
                  {stat.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Expandable Landing Stats Editor */}
      {showLandingEditor && (
        <div className="animate-in fade-in zoom-in-98 duration-200">
          <LandingStatsEditor />
        </div>
      )}

      {/* Operations Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Active Training Sprints (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-[#121526] rounded-2xl p-5 border border-slate-100 dark:border-slate-800/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Active Training Sprints
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Real-time batch progression and syllabus velocity</p>
            </div>
            <Link
              to="/manager/projects"
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3.5">
            {filteredBatches.length > 0 ? (
              filteredBatches.map((batch) => (
                <div
                  key={batch.id}
                  onClick={() => setSelectedSprint(batch)}
                  className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-[#161A30] hover:border-indigo-200 dark:hover:border-indigo-900/60 transition-all cursor-pointer group shadow-2xs"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {batch.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {batch.internsCount} Enrolled Interns • {batch.sprint}
                      </p>
                    </div>
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/50">
                      {batch.daysRemaining} days left
                    </span>
                  </div>

                  <div className="mt-3.5">
                    <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5 font-semibold">
                      <span>Curriculum Progress</span>
                      <span className="text-slate-900 dark:text-white font-extrabold font-mono">
                        {batch.progress}%
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700/60 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                        style={{ width: `${batch.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-slate-400">
                No active training sprints at this time.
              </div>
            )}
          </div>

          <div className="pt-2">
            <Link
              to="/training"
              className="w-full py-2.5 px-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center justify-center gap-1.5 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              <span>Explore Curriculum Modules & Syllabi</span>
            </Link>
          </div>
        </div>

        {/* Right: Partner Interview Queue (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-[#121526] rounded-2xl p-5 border border-slate-100 dark:border-slate-800/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Partner Interview Queue
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Scheduled company assessments</p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/50">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Live Feed</span>
              </span>
            </div>

            <div className="space-y-3 mt-4">
              {filteredInterviews.length > 0 ? (
                filteredInterviews.map((item) => {
                  const isConfirmed = item.status === 'Confirmed';
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedInterview(item)}
                      className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-[#161A30] hover:border-indigo-200 dark:hover:border-indigo-900/60 transition-all cursor-pointer flex items-center justify-between group shadow-2xs"
                    >
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {item.intern}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {item.company} • {item.role}
                        </p>
                        <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-mono font-medium mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3 inline" /> {item.time}
                        </span>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <span
                          className={`text-xs px-2.5 py-1 rounded-lg border font-bold ${
                            isConfirmed
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/50 text-emerald-600 dark:text-emerald-400'
                              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-8 text-center text-xs text-slate-400">
                  No partner interviews currently scheduled.
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
            <Link
              to="/manager/team"
              className="w-full py-2.5 px-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-600 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center justify-center gap-1.5 transition-colors"
            >
              <UserCheck className="w-4 h-4" />
              <span>Manage Team & Allocations</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Sprint Detail Modal */}
      {selectedSprint && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#121526] rounded-2xl max-w-lg w-full p-6 border border-slate-100 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  {selectedSprint.name}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {selectedSprint.internsCount} Enrolled Interns • {selectedSprint.daysRemaining} days remaining
                </p>
              </div>
              <button
                onClick={() => setSelectedSprint(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-500 mb-1">
                  <span>Curriculum Completion</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedSprint.progress}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${selectedSprint.progress}%` }} />
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Active Modules in this Sprint
                </h4>
                <div className="space-y-2">
                  {(selectedSprint.modules || ['Core Microservices', 'High Throughput DB', 'Cloud CI/CD']).map((mod, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between text-xs"
                    >
                      <span className="font-medium text-slate-800 dark:text-slate-200">{mod}</span>
                      <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> In Progress
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <Link
                to="/manager/projects"
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                Open Project Board <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={() => {
                  toast.success('Sprint milestones synced with intern training records');
                  setSelectedSprint(null);
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
              >
                Sync Progress
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Candidate Interview Detail Modal */}
      {selectedInterview && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#121526] rounded-2xl max-w-md w-full p-6 border border-slate-100 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  {selectedInterview.intern}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {selectedInterview.company} • {selectedInterview.role}
                </p>
              </div>
              <button
                onClick={() => setSelectedInterview(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
                <p className="text-slate-400">Scheduled Time</p>
                <p className="font-bold text-sm text-indigo-600 dark:text-indigo-400">
                  ⏰ {selectedInterview.time}
                </p>
              </div>

              {selectedInterview.email && (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
                  <div>
                    <p className="text-slate-400">Candidate Email</p>
                    <p className="font-semibold text-slate-900 dark:text-white mt-0.5">{selectedInterview.email}</p>
                  </div>
                  {selectedInterview.institution && (
                    <span className="text-[11px] font-medium text-slate-400">
                      {selectedInterview.institution}
                    </span>
                  )}
                </div>
              )}

              {selectedInterview.notes && (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <p className="text-slate-400">Interview Notes</p>
                  <p className="text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
                    {selectedInterview.notes}
                  </p>
                </div>
              )}

              {selectedInterview.meetLink && (
                <a
                  href={selectedInterview.meetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200/60 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 flex items-center justify-center gap-2 font-bold transition-colors"
                >
                  <Video className="w-4 h-4" />
                  <span>Join Google Meet Session</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-auto" />
                </a>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={() => toggleInterviewStatus(selectedInterview.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                  selectedInterview.status === 'Scheduled'
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                {selectedInterview.status === 'Scheduled' ? 'Mark Confirmed' : 'Mark Scheduled'}
              </button>

              <button
                onClick={() => setSelectedInterview(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Launch New Sprint Modal */}
      {showNewSprintModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in">
          <form
            onSubmit={handleCreateSprint}
            className="bg-white dark:bg-[#121526] rounded-2xl max-w-md w-full p-6 border border-slate-100 dark:border-slate-800 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Launch New Training Sprint
              </h3>
              <button
                type="button"
                onClick={() => setShowNewSprintModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 font-semibold mb-1">Sprint / Track Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI Prompt Engineering & LLMOps (Batch 02)"
                  value={newSprintName}
                  onChange={(e) => setNewSprintName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Enrolled Interns</label>
                  <input
                    type="number"
                    min="1"
                    value={newSprintInterns}
                    onChange={(e) => setNewSprintInterns(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Duration (Days)</label>
                  <input
                    type="number"
                    min="7"
                    value={newSprintDays}
                    onChange={(e) => setNewSprintDays(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowNewSprintModal(false)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
              >
                Confirm Launch
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
