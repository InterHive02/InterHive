import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  Eye,
  ExternalLink,
  Plus,
  Send,
  UserCheck,
  Shield,
  FileText,
  Mail,
  Phone,
  GraduationCap,
  Sparkles,
  Building,
  ChevronRight,
  X,
  AlertCircle,
} from 'lucide-react';
import { applicationsApi, InternshipApplicationData } from '../../../api/endpoints/applications.api';
import { toast } from 'react-hot-toast';

export const HrApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<InternshipApplicationData[]>([]);
  const [stats, setStats] = useState<any>({
    total: 0,
    new: 0,
    under_review: 0,
    shortlisted: 0,
    interview_scheduled: 0,
    interview_completed: 0,
    selected: 0,
    rejected: 0,
  });
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeApplicant, setActiveApplicant] = useState<InternshipApplicationData | null>(null);

  // Note State
  const [newNoteText, setNewNoteText] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);

  // Interview Schedule State
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [interviewForm, setInterviewForm] = useState({
    date: '',
    time: '',
    mode: 'online' as 'online' | 'offline',
    linkOrLocation: '',
    interviewer: '',
    notes: '',
  });
  const [isScheduling, setIsScheduling] = useState(false);

  // Account Creation State
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [createdAccountInfo, setCreatedAccountInfo] = useState<any>(null);

  // Rejection Modal State
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionFeedback, setRejectionFeedback] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const [appRes, statsRes] = await Promise.all([
        applicationsApi.getApplications({
          status: selectedStatus !== 'all' ? selectedStatus : undefined,
          search: searchQuery.trim() || undefined,
        }),
        applicationsApi.getStats(),
      ]);

      // Handle axios response wrapped in data
      const list = (appRes as any).data || appRes;
      setApplications(Array.isArray(list) ? list : []);

      const statsData = (statsRes as any).data || statsRes;
      if (statsData) {
        setStats(statsData);
      }
    } catch (err) {
      console.error('Failed to load applications:', err);
      toast.error('Failed to fetch applications.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [selectedStatus]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchApplications();
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await applicationsApi.updateStatus(id, newStatus);
      toast.success(`Status updated to ${newStatus.replace('_', ' ')}`);
      
      // Update local state
      setApplications(prev =>
        prev.map(app => (app._id === id || app.id === id ? { ...app, status: newStatus as any } : app))
      );
      if (activeApplicant && (activeApplicant._id === id || activeApplicant.id === id)) {
        setActiveApplicant(prev => (prev ? { ...prev, status: newStatus as any } : null));
      }
      applicationsApi.getStats().then(res => setStats((res as any).data || res));
    } catch (err) {
      toast.error('Failed to update status.');
    }
  };

  const handleAddNote = async () => {
    if (!activeApplicant || !newNoteText.trim()) return;
    const appId = activeApplicant._id || activeApplicant.id;
    if (!appId) return;

    setIsAddingNote(true);
    try {
      const res = await applicationsApi.addNote(appId, newNoteText.trim());
      toast.success('Note added successfully');
      setNewNoteText('');
      
      const updated = (res as any).data || res;
      setActiveApplicant(updated);
      setApplications(prev =>
        prev.map(app => (app._id === appId || app.id === appId ? updated : app))
      );
    } catch (err) {
      toast.error('Failed to add note.');
    } finally {
      setIsAddingNote(false);
    }
  };

  const handleScheduleInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeApplicant) return;
    const appId = activeApplicant._id || activeApplicant.id;
    if (!appId) return;

    setIsScheduling(true);
    try {
      const res = await applicationsApi.scheduleInterview(appId, interviewForm);
      toast.success('Interview scheduled and applicant updated!');
      setIsInterviewModalOpen(false);

      const updated = (res as any).data || res;
      setActiveApplicant(updated);
      setApplications(prev =>
        prev.map(app => (app._id === appId || app.id === appId ? updated : app))
      );
      applicationsApi.getStats().then(s => setStats((s as any).data || s));
    } catch (err) {
      toast.error('Failed to schedule interview.');
    } finally {
      setIsScheduling(false);
    }
  };

  const handleCreateInternAccount = async (appId: string) => {
    setIsCreatingAccount(true);
    try {
      const res = await applicationsApi.createInternAccount(appId);
      const data = (res as any).data?.data || (res as any).data || res;
      setCreatedAccountInfo(data);
      toast.success('Intern account created and credentials emailed!');

      // Refresh applicant
      const refreshed = await applicationsApi.getApplicationById(appId);
      const updatedData = (refreshed as any).data || refreshed;
      setActiveApplicant(updatedData);
      setApplications(prev =>
        prev.map(app => (app._id === appId || app.id === appId ? updatedData : app))
      );
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create intern account.');
    } finally {
      setIsCreatingAccount(false);
    }
  };

  const handleRejectApplication = async () => {
    if (!activeApplicant) return;
    const appId = activeApplicant._id || activeApplicant.id;
    if (!appId) return;

    setIsRejecting(true);
    try {
      await applicationsApi.rejectApplication(appId, rejectionFeedback.trim() || undefined);
      toast.success('Application rejected and notification email sent to candidate.');
      setIsRejectModalOpen(false);
      setRejectionFeedback('');

      // Update local state
      const updatedApp = { ...activeApplicant, status: 'rejected' as any };
      setActiveApplicant(updatedApp);
      setApplications(prev =>
        prev.map(app => (app._id === appId || app.id === appId ? updatedApp : app)),
      );
      applicationsApi.getStats().then(res => setStats((res as any).data || res));
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to reject application.');
    } finally {
      setIsRejecting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">New</span>;
      case 'under_review':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">Under Review</span>;
      case 'shortlisted':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-cyan-100 text-cyan-800">Shortlisted</span>;
      case 'interview_scheduled':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800">Interview Scheduled</span>;
      case 'interview_completed':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">Interview Completed</span>;
      case 'selected':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">Selected</span>;
      case 'rejected':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">Rejected</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Internship Applications Pipeline
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Review applicant profiles, schedule interviews, evaluate candidate skills, and issue official intern accounts.
          </p>
        </div>

        <button
          onClick={fetchApplications}
          className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-all cursor-pointer"
        >
          ↻ Refresh List
        </button>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div
          onClick={() => setSelectedStatus('all')}
          className={`p-3 rounded-2xl border transition-all cursor-pointer ${
            selectedStatus === 'all'
              ? 'bg-blue-50 border-blue-300 dark:bg-blue-950/40 dark:border-blue-700 shadow-xs'
              : 'bg-white dark:bg-slate-800 border-slate-200/80 dark:border-slate-700/80'
          }`}
        >
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total</span>
          <p className="text-xl font-black text-slate-900 dark:text-white mt-1">{stats.total || 0}</p>
        </div>

        <div
          onClick={() => setSelectedStatus('new')}
          className={`p-3 rounded-2xl border transition-all cursor-pointer ${
            selectedStatus === 'new'
              ? 'bg-blue-50 border-blue-300 dark:bg-blue-950/40 dark:border-blue-700 shadow-xs'
              : 'bg-white dark:bg-slate-800 border-slate-200/80 dark:border-slate-700/80'
          }`}
        >
          <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">New</span>
          <p className="text-xl font-black text-blue-600 mt-1">{stats.new || 0}</p>
        </div>

        <div
          onClick={() => setSelectedStatus('under_review')}
          className={`p-3 rounded-2xl border transition-all cursor-pointer ${
            selectedStatus === 'under_review'
              ? 'bg-amber-50 border-amber-300 dark:bg-amber-950/40 dark:border-amber-700 shadow-xs'
              : 'bg-white dark:bg-slate-800 border-slate-200/80 dark:border-slate-700/80'
          }`}
        >
          <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">In Review</span>
          <p className="text-xl font-black text-amber-600 mt-1">{stats.under_review || 0}</p>
        </div>

        <div
          onClick={() => setSelectedStatus('shortlisted')}
          className={`p-3 rounded-2xl border transition-all cursor-pointer ${
            selectedStatus === 'shortlisted'
              ? 'bg-cyan-50 border-cyan-300 dark:bg-cyan-950/40 dark:border-cyan-700 shadow-xs'
              : 'bg-white dark:bg-slate-800 border-slate-200/80 dark:border-slate-700/80'
          }`}
        >
          <span className="text-[11px] font-bold text-cyan-600 uppercase tracking-wider">Shortlisted</span>
          <p className="text-xl font-black text-cyan-600 mt-1">{stats.shortlisted || 0}</p>
        </div>

        <div
          onClick={() => setSelectedStatus('interview_scheduled')}
          className={`p-3 rounded-2xl border transition-all cursor-pointer ${
            selectedStatus === 'interview_scheduled'
              ? 'bg-purple-50 border-purple-300 dark:bg-purple-950/40 dark:border-purple-700 shadow-xs'
              : 'bg-white dark:bg-slate-800 border-slate-200/80 dark:border-slate-700/80'
          }`}
        >
          <span className="text-[11px] font-bold text-purple-600 uppercase tracking-wider">Interviewing</span>
          <p className="text-xl font-black text-purple-600 mt-1">{stats.interview_scheduled || 0}</p>
        </div>

        <div
          onClick={() => setSelectedStatus('selected')}
          className={`p-3 rounded-2xl border transition-all cursor-pointer ${
            selectedStatus === 'selected'
              ? 'bg-emerald-50 border-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-700 shadow-xs'
              : 'bg-white dark:bg-slate-800 border-slate-200/80 dark:border-slate-700/80'
          }`}
        >
          <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Selected</span>
          <p className="text-xl font-black text-emerald-600 mt-1">{stats.selected || 0}</p>
        </div>

        <div
          onClick={() => setSelectedStatus('rejected')}
          className={`p-3 rounded-2xl border transition-all cursor-pointer ${
            selectedStatus === 'rejected'
              ? 'bg-red-50 border-red-300 dark:bg-red-950/40 dark:border-red-700 shadow-xs'
              : 'bg-white dark:bg-slate-800 border-slate-200/80 dark:border-slate-700/80'
          }`}
        >
          <span className="text-[11px] font-bold text-red-500 uppercase tracking-wider">Rejected</span>
          <p className="text-xl font-black text-red-500 mt-1">{stats.rejected || 0}</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, college, skill..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
          />
        </form>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-500 shrink-0">Filter Status:</span>
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
          >
            <option value="all">All Applications</option>
            <option value="new">New</option>
            <option value="under_review">Under Review</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="interview_scheduled">Interview Scheduled</option>
            <option value="interview_completed">Interview Completed</option>
            <option value="selected">Selected</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Applications Mobile Cards (<640px) */}
      <div className="block sm:hidden space-y-3">
        {isLoading ? (
          <div className="bg-white dark:bg-slate-800 p-8 rounded-xl text-center text-slate-400 border border-slate-200/80 dark:border-slate-700/80">
            <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading applications...
          </div>
        ) : applications.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 p-8 rounded-xl text-center text-slate-400 border border-slate-200/80 dark:border-slate-700/80 text-xs">
            No internship applications found matching your criteria.
          </div>
        ) : (
          applications.map(app => {
            const id = app._id || app.id || '';
            return (
              <div
                key={id}
                onClick={() => setActiveApplicant(app)}
                className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-3 cursor-pointer"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-bold text-slate-900 dark:text-white text-sm truncate">{app.fullName}</div>
                    <div className="text-[11px] text-slate-400 font-mono truncate">{app.email}</div>
                  </div>
                  <div className="shrink-0">{getStatusBadge(app.status)}</div>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-300 pt-1 border-t border-slate-100 dark:border-slate-750">
                  <span className="font-semibold text-slate-800 dark:text-slate-100">{app.institution}</span>
                  <div className="text-[11px] text-slate-400">{app.degree} • {app.semester}</div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <div className="flex flex-wrap gap-1">
                    {app.skills?.slice(0, 2).map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-[10px] font-semibold text-slate-600 dark:text-slate-300"
                      >
                        {skill}
                      </span>
                    ))}
                    {(app.skills?.length || 0) > 2 && (
                      <span className="text-[10px] text-slate-400 font-bold">
                        +{(app.skills?.length || 0) - 2}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={e => {
                      e.stopPropagation();
                      setActiveApplicant(app);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 font-bold text-xs shrink-0 min-h-[36px]"
                  >
                    Review →
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Applications Table (>=640px) */}
      <div className="hidden sm:block bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200/80 dark:border-slate-700/80 text-slate-500 uppercase tracking-wider font-bold">
              <tr>
                <th className="py-3.5 px-4">Applicant</th>
                <th className="py-3.5 px-4">College / Course</th>
                <th className="py-3.5 px-4">Skills</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Applied Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    Loading applications...
                  </td>
                </tr>
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No internship applications found matching your criteria.
                  </td>
                </tr>
              ) : (
                applications.map(app => {
                  const id = app._id || app.id || '';
                  return (
                    <tr
                      key={id}
                      onClick={() => setActiveApplicant(app)}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors cursor-pointer"
                    >
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 dark:text-white">{app.fullName}</div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">{app.email}</div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800 dark:text-slate-100">{app.institution}</div>
                        <div className="text-[11px] text-slate-400">
                          {app.degree} • {app.semester}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {app.skills?.slice(0, 3).map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-[10px] font-semibold text-slate-600 dark:text-slate-300"
                            >
                              {skill}
                            </span>
                          ))}
                          {(app.skills?.length || 0) > 3 && (
                            <span className="text-[10px] text-slate-400 font-bold">
                              +{(app.skills?.length || 0) - 3}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4">{getStatusBadge(app.status)}</td>

                      <td className="py-3 px-4 text-slate-400">
                        {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'Recent'}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            setActiveApplicant(app);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 font-bold text-xs transition-all"
                        >
                          Review →
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* APPLICANT DETAIL DRAWER / MODAL */}
      {activeApplicant && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-2xl h-full bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden text-slate-800 dark:text-slate-100">
            
            {/* Drawer Header */}
            <div className="p-6 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">
                    {activeApplicant.fullName}
                  </h2>
                  {getStatusBadge(activeApplicant.status)}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
                  {activeApplicant.email} • {activeApplicant.phone}
                </p>
              </div>

              <button
                onClick={() => setActiveApplicant(null)}
                className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Account Provisioned Notice */}
              {activeApplicant.accountCreated && (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center gap-3 text-emerald-800 dark:text-emerald-300 text-xs">
                  <CheckCircle className="w-5 h-5 shrink-0 text-emerald-600" />
                  <div>
                    <span className="font-bold">Official Intern Account Provisioned:</span> Login credentials have been delivered via email to {activeApplicant.email}.
                  </div>
                </div>
              )}

              {/* Status Action Toolbar */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-3">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Workflow Status Actions:
                </span>
                
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleStatusUpdate(activeApplicant._id || activeApplicant.id || '', 'under_review')}
                    className="px-3 py-1.5 rounded-xl bg-amber-100 text-amber-800 font-bold text-xs hover:bg-amber-200 transition-all cursor-pointer"
                  >
                    Mark In Review
                  </button>

                  <button
                    onClick={() => handleStatusUpdate(activeApplicant._id || activeApplicant.id || '', 'shortlisted')}
                    className="px-3 py-1.5 rounded-xl bg-cyan-100 text-cyan-800 font-bold text-xs hover:bg-cyan-200 transition-all cursor-pointer"
                  >
                    Shortlist Candidate
                  </button>

                  <button
                    onClick={() => setIsInterviewModalOpen(true)}
                    className="px-3 py-1.5 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-700 transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    Schedule Interview
                  </button>

                  <button
                    onClick={() => handleStatusUpdate(activeApplicant._id || activeApplicant.id || '', 'selected')}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    Mark as Selected
                  </button>

                  <button
                    onClick={() => {
                      setRejectionFeedback('');
                      setIsRejectModalOpen(true);
                    }}
                    disabled={activeApplicant.status === 'rejected'}
                    className="px-3 py-1.5 rounded-xl bg-red-100 text-red-700 font-bold text-xs hover:bg-red-200 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Reject &amp; Notify Candidate
                  </button>
                </div>

                {/* Selected Intern Account Creation Button */}
                {activeApplicant.status === 'selected' && !activeApplicant.accountCreated && (
                  <div className="pt-3 border-t border-slate-200 dark:border-slate-700 mt-2 space-y-2">
                    <p className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Candidate selected! Click below to create their intern account and email login credentials.
                    </p>
                    <button
                      onClick={() => handleCreateInternAccount(activeApplicant._id || activeApplicant.id || '')}
                      disabled={isCreatingAccount}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-extrabold text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isCreatingAccount ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <UserCheck className="w-4 h-4" />
                          <span>Generate Intern Account &amp; Send Credentials via Email</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Credentials Sent Success Info */}
                {createdAccountInfo && activeApplicant.accountCreated && (
                  <div className="mt-3 p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs space-y-1">
                    <p className="font-black text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5" /> Credentials sent successfully!
                    </p>
                    <p className="text-emerald-700 dark:text-emerald-400"><strong>Employee ID:</strong> {createdAccountInfo.employeeId}</p>
                    <p className="text-emerald-700 dark:text-emerald-400"><strong>Login Email:</strong> {createdAccountInfo.email}</p>
                    <p className="text-emerald-700 dark:text-emerald-400 font-mono"><strong>Temp Password:</strong> {createdAccountInfo.temporaryPassword}</p>
                  </div>
                )}
              </div>

              {/* Applicant Academics & Details */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-400 font-bold block mb-1">College / University:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{activeApplicant.institution}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-400 font-bold block mb-1">Degree & Roll No:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {activeApplicant.degree} • Roll: {activeApplicant.rollNumber}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-400 font-bold block mb-1">Work Preference:</span>
                  <span className="font-semibold capitalize text-slate-800 dark:text-slate-200">{activeApplicant.internshipPreference}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-400 font-bold block mb-1">Current Semester:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{activeApplicant.semester}</span>
                </div>
              </div>

              {/* Resume & Links Bar */}
              <div className="p-4 rounded-2xl border border-indigo-100 dark:border-indigo-950 bg-indigo-50/50 dark:bg-indigo-950/20 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Candidate Resume / CV</span>
                </div>

                <div className="flex items-center gap-2">
                  {activeApplicant.resumeUrl && (
                    <a
                      href={activeApplicant.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs"
                    >
                      <span>View Resume Document</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}

                  {activeApplicant.linkedInUrl && (
                    <a
                      href={activeApplicant.linkedInUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-blue-600 font-bold text-xs hover:bg-slate-50"
                    >
                      LinkedIn
                    </a>
                  )}

                  {activeApplicant.githubUrl && (
                    <a
                      href={activeApplicant.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-50"
                    >
                      GitHub
                    </a>
                  )}
                </div>
              </div>

              {/* Skills & Statement */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Technical Skills:</span>
                <div className="flex flex-wrap gap-1.5">
                  {activeApplicant.skills?.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs border border-slate-200/60 dark:border-slate-700/60"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Reason for Applying */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Motivation & Statement:</span>
                <p className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60 leading-relaxed">
                  {activeApplicant.reasonForApplying || 'No statement provided.'}
                </p>
              </div>

              {/* Interview Details if Scheduled */}
              {activeApplicant.interview?.date && (
                <div className="p-4 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-2xl space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-purple-900 dark:text-purple-300 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-purple-600" /> Scheduled Interview Details
                    </span>
                    <span className="px-2 py-0.5 rounded-md font-bold uppercase text-[10px] bg-purple-200 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                      {activeApplicant.interview.mode || 'Online'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-slate-700 dark:text-slate-300 pt-1">
                    <div><strong>Date & Time:</strong> {activeApplicant.interview.date} at {activeApplicant.interview.time}</div>
                    <div><strong>Interviewer:</strong> {activeApplicant.interview.interviewer || 'HR Panel'}</div>
                  </div>

                  {activeApplicant.interview.linkOrLocation && (
                    <div className="pt-1 text-purple-700 dark:text-purple-400">
                      <strong>Meeting Link / Venue:</strong> {activeApplicant.interview.linkOrLocation}
                    </div>
                  )}
                </div>
              )}

              {/* Internal HR Notes */}
              <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Internal HR Evaluation Notes:</span>
                
                <div className="space-y-2">
                  {activeApplicant.notes?.map((note, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-xs border border-slate-200/60 dark:border-slate-700/60"
                    >
                      <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200 mb-1">
                        <span>{note.author}</span>
                        <span className="text-[10px] text-slate-400 font-normal">
                          {new Date(note.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400">{note.text}</p>
                    </div>
                  ))}

                  {(!activeApplicant.notes || activeApplicant.notes.length === 0) && (
                    <p className="text-xs text-slate-400 italic">No notes recorded yet.</p>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <input
                    type="text"
                    value={newNoteText}
                    onChange={e => setNewNoteText(e.target.value)}
                    placeholder="Add an evaluation note or candidate remarks..."
                    className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  />
                  <button
                    onClick={handleAddNote}
                    disabled={isAddingNote || !newNoteText.trim()}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all disabled:opacity-50 cursor-pointer"
                  >
                    Add Note
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* SCHEDULE INTERVIEW MODAL */}
      {isInterviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Schedule Candidate Interview</h3>
              <button onClick={() => setIsInterviewModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleScheduleInterview} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Interview Date</label>
                  <input
                    type="date"
                    required
                    value={interviewForm.date}
                    onChange={e => setInterviewForm({ ...interviewForm, date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Interview Time</label>
                  <input
                    type="time"
                    required
                    value={interviewForm.time}
                    onChange={e => setInterviewForm({ ...interviewForm, time: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Mode</label>
                <select
                  value={interviewForm.mode}
                  onChange={e => setInterviewForm({ ...interviewForm, mode: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                >
                  <option value="online">Online (Google Meet / Zoom)</option>
                  <option value="offline">In-Person / Office</option>
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1">Meeting Link or Location</label>
                <input
                  type="text"
                  required
                  value={interviewForm.linkOrLocation}
                  onChange={e => setInterviewForm({ ...interviewForm, linkOrLocation: e.target.value })}
                  placeholder="https://meet.google.com/xyz or Office Room 3"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Interviewer Name / Panel</label>
                <input
                  type="text"
                  value={interviewForm.interviewer}
                  onChange={e => setInterviewForm({ ...interviewForm, interviewer: e.target.value })}
                  placeholder="e.g. Lead Engineer & HR Head"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsInterviewModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isScheduling}
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all disabled:opacity-50"
                >
                  {isScheduling ? 'Scheduling...' : 'Save & Confirm Interview'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REJECTION MODAL */}
      {isRejectModalOpen && activeApplicant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">Reject Application</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  A rejection email will be sent to <strong className="text-slate-700 dark:text-slate-300">{activeApplicant.email}</strong>
                </p>
              </div>
              <button onClick={() => setIsRejectModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Candidate Summary */}
              <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl">
                <p className="font-bold text-red-800 dark:text-red-300">{activeApplicant.fullName}</p>
                <p className="text-red-600 dark:text-red-400">{activeApplicant.institution} — {activeApplicant.degree}</p>
              </div>

              {/* Feedback Field */}
              <div>
                <label className="block font-bold mb-1.5 text-slate-700 dark:text-slate-300">
                  HR Feedback / Reason <span className="font-normal text-slate-400">(optional — will be included in the email)</span>
                </label>
                <textarea
                  rows={4}
                  value={rejectionFeedback}
                  onChange={e => setRejectionFeedback(e.target.value)}
                  placeholder="e.g. We were impressed by your profile but found a stronger match for the current batch. We encourage you to re-apply in our next round..."
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-red-400/40 resize-none"
                />
                <p className="text-slate-400 mt-1 text-[11px]">
                  If left empty, a standard rejection message will be sent without specific feedback.
                </p>
              </div>

              {/* What gets sent */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl space-y-1">
                <p className="font-bold text-slate-700 dark:text-slate-300">The candidate will receive:</p>
                <ul className="text-slate-500 dark:text-slate-400 space-y-0.5 list-disc pl-4">
                  <li>A professional rejection email from InterHive HR</li>
                  {rejectionFeedback.trim() && <li>Your feedback message</li>}
                  <li>Encouragement and tips for their next steps</li>
                </ul>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsRejectModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRejectApplication}
                  disabled={isRejecting}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                >
                  {isRejecting ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <><XCircle className="w-4 h-4" /> Send Rejection Email</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
