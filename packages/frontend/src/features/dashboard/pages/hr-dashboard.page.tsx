import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  CheckSquare,
  Calendar,
  Award,
  Search,
  Bell,
  ArrowRight,
  Rocket,
  Code2,
  RefreshCw,
  X,
  ExternalLink,
  Video,
  Clock,
  MapPin,
  FileText,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  BookOpen,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { applicationsApi } from '../../../api/endpoints/applications.api';

interface SprintItem {
  id: string;
  title: string;
  subtitle: string;
  daysLeft: number;
  progress: number;
  icon: 'rocket' | 'code';
  enrolledCount?: number;
}

interface InterviewItem {
  id: string;
  candidateName: string;
  email?: string;
  phone?: string;
  institution?: string;
  degree?: string;
  skills?: string[];
  resumeUrl?: string;
  avatarText: string;
  companyName: string;
  roleTitle: string;
  interviewTime: string;
  interviewDate?: string;
  interviewMode?: string;
  linkOrLocation?: string;
  interviewer?: string;
  notes?: string;
  status: 'Scheduled' | 'Confirmed';
  isEmerald?: boolean;
  rawApplication?: any;
}

export const HrDashboardPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [notificationCount, setNotificationCount] = useState<number>(3);
  const [showNotificationPopup, setShowNotificationPopup] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Selected modals
  const [selectedInterview, setSelectedInterview] = useState<InterviewItem | null>(null);
  const [selectedSprint, setSelectedSprint] = useState<SprintItem | null>(null);
  const [newNoteText, setNewNoteText] = useState<string>('');
  const [isSubmittingAction, setIsSubmittingAction] = useState<boolean>(false);

  const [stats, setStats] = useState({
    activeInterns: 48,
    liveProjects: 14,
    upcomingInterviews: 9,
    readyPlacement: 26,
  });

  // Base training sprints matching reference image
  const defaultSprints: SprintItem[] = [
    {
      id: 'sprint-1',
      title: 'Full-Stack 45-Day Sprint (Batch 12)',
      subtitle: '18 Enrolled Interns • Sprint 3/4',
      daysLeft: 14,
      progress: 68,
      icon: 'rocket',
      enrolledCount: 18,
    },
    {
      id: 'sprint-2',
      title: 'Data Engineering & Analytics (Batch 04)',
      subtitle: '15 Enrolled Interns • Sprint 2/4',
      daysLeft: 26,
      progress: 42,
      icon: 'code',
      enrolledCount: 15,
    },
  ];

  // Base partner interview queue matching reference image
  const defaultInterviews: InterviewItem[] = [
    {
      id: 'int-1',
      candidateName: 'Rahul Sharma',
      email: 'rahul.sharma@techcorp.in',
      phone: '+91 9876543201',
      institution: 'IIT Bombay',
      degree: 'B.Tech Computer Science',
      skills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'AWS'],
      resumeUrl: 'https://interhive.in/resumes/rahul-sharma.pdf',
      avatarText: 'RS',
      companyName: 'TechCorp India',
      roleTitle: 'Full Stack Developer',
      interviewTime: '11:00 AM Today',
      interviewDate: 'Today',
      interviewMode: 'online',
      linkOrLocation: 'https://meet.google.com/ih-techcorp-rs',
      interviewer: 'TechCorp Technical Team',
      notes: 'Round 1 technical architecture assessment.',
      status: 'Scheduled',
    },
    {
      id: 'int-2',
      candidateName: 'Priya Patel',
      email: 'priya.patel@cloudwave.io',
      phone: '+91 9876543202',
      institution: 'NIT Surat',
      degree: 'B.E. Information Technology',
      skills: ['React', 'Next.js', 'Tailwind CSS', 'Redux'],
      resumeUrl: 'https://interhive.in/resumes/priya-patel.pdf',
      avatarText: 'PP',
      companyName: 'CloudWave Systems',
      roleTitle: 'Frontend React Dev',
      interviewTime: '02:30 PM Today',
      interviewDate: 'Today',
      interviewMode: 'online',
      linkOrLocation: 'https://meet.google.com/ih-cloudwave-pp',
      interviewer: 'CloudWave Lead Architect',
      notes: 'Frontend system design and responsive layouts.',
      status: 'Scheduled',
    },
    {
      id: 'int-3',
      candidateName: 'Aman Verma',
      email: 'aman.verma@nexusfin.com',
      phone: '+91 9876543203',
      institution: 'Delhi University',
      degree: 'M.C.A. Software Engineering',
      skills: ['Node.js', 'Express', 'PostgreSQL', 'Redis', 'Kafka'],
      resumeUrl: 'https://interhive.in/resumes/aman-verma.pdf',
      avatarText: 'AV',
      companyName: 'Nexus FinTech',
      roleTitle: 'Backend Node.js Dev',
      interviewTime: '04:00 PM Tomorrow',
      interviewDate: 'Tomorrow',
      interviewMode: 'online',
      linkOrLocation: 'https://meet.google.com/ih-nexus-av',
      interviewer: 'Nexus FinTech VP of Tech',
      notes: 'Confirmed by partner company engineering committee.',
      status: 'Confirmed',
      isEmerald: true,
    },
  ];

  const [sprints, setSprints] = useState<SprintItem[]>(defaultSprints);
  const [interviews, setInterviews] = useState<InterviewItem[]>(defaultInterviews);

  // Load backend stats and live data smoothly from MongoDB
  const loadDashboardData = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    setIsRefreshing(true);
    try {
      const res = await applicationsApi.getHrDashboard();
      const payload = (res as any)?.data?.data || (res as any)?.data || res;

      if (payload && payload.stats) {
        setStats({
          activeInterns: payload.stats.activeInterns || 48,
          liveProjects: payload.stats.liveProjects || 14,
          upcomingInterviews: payload.stats.upcomingInterviews !== undefined ? payload.stats.upcomingInterviews : 9,
          readyPlacement: payload.stats.readyPlacement || 26,
        });

        if (Array.isArray(payload.sprints) && payload.sprints.length > 0) {
          setSprints(payload.sprints);
        }

        if (Array.isArray(payload.interviews) && payload.interviews.length > 0) {
          setInterviews(payload.interviews);
        }
      }
    } catch (err: any) {
      console.warn('Backend HR Dashboard API fallback to baseline:', err.message);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Actions on interviews
  const handleUpdateInterviewStatus = async (status: string) => {
    if (!selectedInterview) return;
    setIsSubmittingAction(true);
    try {
      await applicationsApi.updateStatus(selectedInterview.id, status);
      toast.success(`Candidate status updated to "${status.replace('_', ' ')}"`);
      setSelectedInterview(null);
      await loadDashboardData(true);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update candidate status');
    } finally {
      setIsSubmittingAction(false);
    }
  };

  const handleAddNote = async () => {
    if (!selectedInterview || !newNoteText.trim()) return;
    setIsSubmittingAction(true);
    try {
      await applicationsApi.addNote(selectedInterview.id, newNoteText.trim());
      toast.success('Interview note recorded successfully');
      setNewNoteText('');
      await loadDashboardData(true);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to record note');
    } finally {
      setIsSubmittingAction(false);
    }
  };

  // Filter sprints & interviews based on search term
  const filteredSprints = useMemo(() => {
    if (!searchTerm.trim()) return sprints;
    const term = searchTerm.toLowerCase();
    return sprints.filter(
      s => s.title.toLowerCase().includes(term) || s.subtitle.toLowerCase().includes(term)
    );
  }, [sprints, searchTerm]);

  const filteredInterviews = useMemo(() => {
    if (!searchTerm.trim()) return interviews;
    const term = searchTerm.toLowerCase();
    return interviews.filter(
      i =>
        i.candidateName.toLowerCase().includes(term) ||
        i.companyName.toLowerCase().includes(term) ||
        i.roleTitle.toLowerCase().includes(term) ||
        (i.skills && i.skills.some(s => s.toLowerCase().includes(term)))
    );
  }, [interviews, searchTerm]);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      
      {/* 1. Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Left Title & Subtitle */}
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl lg:text-[26px] font-extrabold text-slate-900 dark:text-white tracking-tight">
              Operations & Training Management
            </h1>
            <button
              onClick={() => loadDashboardData(true)}
              disabled={isRefreshing}
              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-[#1E2248] transition-all"
              title="Sync with MongoDB"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-indigo-600' : ''}`} />
            </button>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            Track intern preparation sprints, live project milestones, and company interview pipelines.
          </p>
        </div>

        {/* Right Header Controls */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search interns, projects..."
              className="pl-9 pr-8 py-2 text-xs rounded-xl bg-white dark:bg-[#13172E] border border-slate-200/80 dark:border-[#21264A] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 w-48 sm:w-56 transition-all shadow-xs"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Notification Button */}
          <div className="relative">
            <button
              onClick={() => setShowNotificationPopup(!showNotificationPopup)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-[#13172E] border border-slate-200/80 dark:border-[#21264A] text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#181D38] transition-colors shadow-xs"
              title="Notifications"
            >
              <Bell className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>{notificationCount}</span>
            </button>

            {showNotificationPopup && (
              <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-[#1A1D33] rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-800 p-3 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Pipeline Alerts</span>
                  <button
                    onClick={() => {
                      setNotificationCount(0);
                      setShowNotificationPopup(false);
                    }}
                    className="text-[10px] text-indigo-600 hover:underline font-semibold"
                  >
                    Clear All
                  </button>
                </div>
                <div className="space-y-2 mt-2 text-xs">
                  <div className="p-2 rounded-xl bg-indigo-50/50 dark:bg-[#20254D]/50 text-slate-700 dark:text-slate-200">
                    <p className="font-semibold text-indigo-600 dark:text-indigo-400">TechCorp Interview</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Rahul Sharma scheduled for 11:00 AM today.</p>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200">
                    <p className="font-semibold">Batch 12 Milestone</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">18 Interns completed Sprint 3 React module.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Review Companies Button */}
          <Link
            to="/hr/leads"
            className="px-4 py-2 text-xs font-semibold rounded-xl border border-[#6366F1] dark:border-[#6366F1]/70 text-[#6366F1] dark:text-[#818CF8] bg-white dark:bg-transparent hover:bg-indigo-50/60 dark:hover:bg-indigo-950/40 transition-colors shadow-xs whitespace-nowrap"
          >
            Review Companies
          </Link>

          {/* Manage Interns Button */}
          <Link
            to="/hr/applications"
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#6366F1] hover:bg-[#5254E0] text-white transition-colors shadow-xs shadow-indigo-500/20 whitespace-nowrap"
          >
            Manage Interns
          </Link>
        </div>
      </div>

      {/* 2. Top Metric Cards (4 Cards Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* Card 1: Active Interns in Training */}
        <div className="bg-white dark:bg-[#13172E] border border-slate-200/80 dark:border-[#21264A] rounded-2xl p-5 shadow-xs transition-colors flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-[#1E1B4B] text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Active Interns in Training
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1 tracking-tight">
              {stats.activeInterns}
            </div>
            <div className="flex items-center text-xs mt-1 font-medium">
              <span className="text-emerald-500 font-bold flex items-center">
                ↑ 12%
              </span>
              <span className="text-slate-400 dark:text-slate-400 ml-1">
                vs last week
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Live Projects Active */}
        <div className="bg-white dark:bg-[#13172E] border border-slate-200/80 dark:border-[#21264A] rounded-2xl p-5 shadow-xs transition-colors flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-[#1E1B4B] text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Live Projects Active
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1 tracking-tight">
              {stats.liveProjects}
            </div>
            <div className="flex items-center text-xs mt-1 font-medium">
              <span className="text-emerald-500 font-bold flex items-center">
                + 3
              </span>
              <span className="text-slate-400 dark:text-slate-400 ml-1">
                this week
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Upcoming Interviews */}
        <div className="bg-white dark:bg-[#13172E] border border-slate-200/80 dark:border-[#21264A] rounded-2xl p-5 shadow-xs transition-colors flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-[#32251B] text-amber-500 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Upcoming Interviews
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1 tracking-tight">
              {stats.upcomingInterviews}
            </div>
            <div className="text-xs text-slate-400 dark:text-slate-400 mt-1 font-medium">
              Today
            </div>
          </div>
        </div>

        {/* Card 4: Ready for Placement */}
        <div className="bg-white dark:bg-[#13172E] border border-slate-200/80 dark:border-[#21264A] rounded-2xl p-5 shadow-xs transition-colors flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-[#153427] text-emerald-500 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Ready for Placement
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1 tracking-tight">
              {stats.readyPlacement}
            </div>
            <div className="text-xs text-slate-400 dark:text-slate-400 mt-1 font-medium">
              Score &gt; 80%
            </div>
          </div>
        </div>

      </div>

      {/* 3. Two Column Grid (Active Training Sprints + Partner Interview Queue) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Active Training Sprints */}
        <div className="bg-white dark:bg-[#13172E] border border-slate-200/80 dark:border-[#21264A] rounded-2xl p-6 shadow-xs flex flex-col justify-between transition-colors">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                Active Training Sprints
              </h2>
              <Link
                to="/hr/applications"
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 transition-colors group"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            {/* Sprints List */}
            <div className="space-y-4 mt-5">
              {filteredSprints.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-500">
                  No sprints match "{searchTerm}".
                </div>
              ) : (
                filteredSprints.map((sprint) => (
                  <div
                    key={sprint.id}
                    onClick={() => setSelectedSprint(sprint)}
                    className="bg-slate-50/70 dark:bg-[#181D38]/60 border border-slate-100 dark:border-[#252B4E] rounded-xl p-4 transition-all hover:border-indigo-300 dark:hover:border-indigo-600/80 cursor-pointer group shadow-2xs"
                  >
                    {/* Top Row: Icon + Title/Subtitle + Days Left Badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-100/70 dark:bg-[#252854] text-indigo-600 dark:text-indigo-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          {sprint.icon === 'rocket' ? (
                            <Rocket className="w-5 h-5" />
                          ) : (
                            <Code2 className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {sprint.title}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                            {sprint.subtitle}
                          </p>
                        </div>
                      </div>

                      <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-indigo-50 dark:bg-[#20254D] text-indigo-600 dark:text-indigo-300 border border-indigo-100/60 dark:border-indigo-800/40 shrink-0">
                        {sprint.daysLeft} days left
                      </span>
                    </div>

                    {/* Bottom Row: Curriculum Progress Bar */}
                    <div className="mt-3.5">
                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5 font-medium">
                        <span>Curriculum Progress</span>
                        <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                          View details →
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-slate-200 dark:bg-[#21264A] rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-[#6366F1] h-1.5 rounded-full transition-all duration-500"
                            style={{ width: `${sprint.progress}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 min-w-[28px] text-right">
                          {sprint.progress}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Partner Interview Queue */}
        <div className="bg-white dark:bg-[#13172E] border border-slate-200/80 dark:border-[#21264A] rounded-2xl p-6 shadow-xs flex flex-col justify-between transition-colors">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                Partner Interview Queue
              </h2>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-500">
                <span>Live Feed</span>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>
            </div>

            {/* Candidate Queue List */}
            <div className="space-y-3.5 mt-5">
              {filteredInterviews.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-500">
                  No interview candidates match "{searchTerm}".
                </div>
              ) : (
                filteredInterviews.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedInterview(item)}
                    className="bg-slate-50/70 dark:bg-[#181D38]/60 border border-slate-100 dark:border-[#252B4E] rounded-xl p-3.5 flex items-center justify-between gap-3 transition-all hover:border-indigo-300 dark:hover:border-indigo-600/80 cursor-pointer group shadow-2xs"
                  >
                    {/* Left: Avatar + Candidate Details */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-full font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform ${
                          item.isEmerald
                            ? 'bg-emerald-100 dark:bg-[#17382B] text-emerald-600 dark:text-emerald-400'
                            : 'bg-indigo-100 dark:bg-[#262B54] text-indigo-600 dark:text-indigo-300'
                        }`}
                      >
                        {item.avatarText}
                      </div>

                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {item.candidateName}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate font-medium">
                          {item.companyName} • {item.roleTitle}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-0.5">
                          <Calendar className="w-3.5 h-3.5 shrink-0" />
                          <span>{item.interviewTime}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Status Badge */}
                    <span
                      className={`px-3 py-1 rounded-md text-xs font-semibold shrink-0 border ${
                        item.status === 'Confirmed'
                          ? 'bg-emerald-50 dark:bg-[#16382C] text-emerald-600 dark:text-emerald-300 border-emerald-100/60 dark:border-emerald-800/40'
                          : 'bg-indigo-50 dark:bg-[#20254D] text-indigo-600 dark:text-indigo-300 border-indigo-100/60 dark:border-indigo-800/40'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>

      {/* 4. Candidate Interview Modal / Drawer */}
      {selectedInterview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-[#13172E] border border-slate-200 dark:border-[#21264A] rounded-3xl w-full max-w-xl p-6 sm:p-7 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-full font-bold text-sm flex items-center justify-center shadow-xs ${
                    selectedInterview.isEmerald
                      ? 'bg-emerald-100 dark:bg-[#17382B] text-emerald-600 dark:text-emerald-400'
                      : 'bg-indigo-100 dark:bg-[#262B54] text-indigo-600 dark:text-indigo-300'
                  }`}
                >
                  {selectedInterview.avatarText}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {selectedInterview.candidateName}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {selectedInterview.companyName} • {selectedInterview.roleTitle}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedInterview(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Candidate Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-[#181D38]/60 border border-slate-100 dark:border-[#252B4E] text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Email Address</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedInterview.email || 'Candidate email'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Phone Number</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedInterview.phone || '+91 9876543210'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Institution & Degree</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedInterview.institution || 'University'} • {selectedInterview.degree || 'Degree'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Interview Schedule</span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">{selectedInterview.interviewTime}</span>
              </div>
            </div>

            {/* Skills & Resume */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white">Technical Skills</span>
              <div className="flex flex-wrap gap-1.5">
                {(selectedInterview.skills || ['React', 'Node.js', 'TypeScript', 'MongoDB']).map((s, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-[#20254D] text-indigo-600 dark:text-indigo-300 border border-indigo-100/60 dark:border-indigo-800/40"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Meeting Link & Interviewer */}
            <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-[#1E2248] border border-indigo-100 dark:border-indigo-900/60 flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-300">
                  <Video className="w-4 h-4" />
                  <span>Interview Call Room</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Interviewer: {selectedInterview.interviewer || 'HR Technical Panel'}
                </p>
              </div>
              <a
                href={selectedInterview.linkOrLocation || 'https://meet.google.com'}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-1 shadow-xs transition-colors"
              >
                <span>Join Video Call</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Notes Section */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white">HR & Panel Notes</span>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#181D38]/60 text-xs text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-[#252B4E]">
                {selectedInterview.notes || 'No preliminary notes recorded for this candidate.'}
              </div>

              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder="Add evaluation note..."
                  className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-[#13172E] border border-slate-200 dark:border-[#21264A] text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                />
                <button
                  onClick={handleAddNote}
                  disabled={isSubmittingAction || !newNoteText.trim()}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs font-semibold rounded-xl disabled:opacity-50 transition-colors"
                >
                  Add Note
                </button>
              </div>
            </div>

            {/* Actions Toolbar */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
              <button
                onClick={() => handleUpdateInterviewStatus('rejected')}
                disabled={isSubmittingAction}
                className="px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-colors"
              >
                Reject Candidate
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleUpdateInterviewStatus('interview_completed')}
                  disabled={isSubmittingAction}
                  className="px-4 py-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-[#20254D] hover:bg-indigo-100 dark:hover:bg-[#282E60] rounded-xl transition-colors"
                >
                  Mark Completed
                </button>

                <button
                  onClick={() => handleUpdateInterviewStatus('selected')}
                  disabled={isSubmittingAction}
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Select Candidate</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 5. Sprint Details Modal */}
      {selectedSprint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-[#13172E] border border-slate-200 dark:border-[#21264A] rounded-3xl w-full max-w-lg p-6 sm:p-7 shadow-2xl space-y-6 relative">
            
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-[#252854] text-indigo-600 dark:text-indigo-300 flex items-center justify-center">
                  {selectedSprint.icon === 'rocket' ? <Rocket className="w-6 h-6" /> : <Code2 className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {selectedSprint.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {selectedSprint.subtitle}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSprint(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sprint Stats */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-[#181D38]/60 border border-slate-100 dark:border-[#252B4E] text-center">
              <div>
                <span className="text-[11px] text-slate-400 block">Enrolled Interns</span>
                <span className="text-base font-extrabold text-slate-900 dark:text-white">{selectedSprint.enrolledCount || 18}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">Days Left</span>
                <span className="text-base font-extrabold text-indigo-600 dark:text-indigo-400">{selectedSprint.daysLeft} days</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">Curriculum Progress</span>
                <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">{selectedSprint.progress}%</span>
              </div>
            </div>

            {/* Progress bar */}
            <div>
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1 font-medium">
                <span>Overall Completion</span>
                <span>{selectedSprint.progress}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-[#21264A] rounded-full h-2 overflow-hidden">
                <div className="bg-[#6366F1] h-2 rounded-full" style={{ width: `${selectedSprint.progress}%` }} />
              </div>
            </div>

            {/* Action */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
              <button
                onClick={() => setSelectedSprint(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Close
              </button>
              <Link
                to="/hr/applications"
                onClick={() => setSelectedSprint(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-xs"
              >
                Manage Sprint Interns
              </Link>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
export default HrDashboardPage;

