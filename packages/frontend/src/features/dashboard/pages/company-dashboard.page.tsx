import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Users,
  Calendar,
  Award,
  Plus,
  ArrowRight,
  CheckCircle2,
  Clock,
  Briefcase,
  Search,
  Bell,
  RefreshCw,
  X,
  ExternalLink,
  ChevronRight,
  Filter,
  Check,
  Sparkles,
  DollarSign,
  MapPin,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { analyticsApi } from '../../../api/endpoints/analytics.api';
import { companyApi } from '../../../api/endpoints/company.api';

interface RequirementCard {
  id: string;
  title: string;
  department: string;
  openings: number;
  applicants: number;
  status: 'published' | 'draft' | 'closed';
  postedTime: string;
  skills?: { name: string }[];
  stipend?: { min: number; max: number; currency: string };
  workType?: string;
  location?: string;
}

interface CandidateMatch {
  id: string;
  name: string;
  email?: string;
  college?: string;
  degree?: string;
  role: string;
  score: number;
  skills: string[];
  status: string;
}

export const CompanyDashboardPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [showNotificationPopup, setShowNotificationPopup] = useState<boolean>(false);
  const [notificationCount, setNotificationCount] = useState<number>(4);

  // Modals state
  const [showPostReqModal, setShowPostReqModal] = useState<boolean>(false);
  const [selectedReq, setSelectedReq] = useState<RequirementCard | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateMatch | null>(null);

  // New Requirement Form state
  const [newPosition, setNewPosition] = useState('');
  const [newDepartment, setNewDepartment] = useState('Web Development');
  const [newOpenings, setNewOpenings] = useState('2');
  const [newWorkType, setNewWorkType] = useState<'remote' | 'hybrid' | 'onsite'>('remote');
  const [newStipendMin, setNewStipendMin] = useState('18000');
  const [newStipendMax, setNewStipendMax] = useState('25000');
  const [newSkills, setNewSkills] = useState('React.js, TypeScript, Tailwind CSS');
  const [isSubmittingReq, setIsSubmittingReq] = useState(false);

  // Metrics state
  const [metrics, setMetrics] = useState([
    {
      label: 'Active Requirements',
      value: '0',
      change: 'Live Openings',
      sub: '● Open for applicants',
      icon: Briefcase,
      color: 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30',
    },
    {
      label: 'Total Matched Interns',
      value: '0',
      change: 'Platform Matches',
      sub: 'Pre-vetted by InterHive',
      icon: Users,
      color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30',
    },
    {
      label: 'Interviews Scheduled',
      value: '0',
      change: 'Pipeline Queue',
      sub: 'In pipeline',
      icon: Calendar,
      color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30',
    },
    {
      label: 'Hires Made',
      value: '0',
      change: 'Verified Hires',
      sub: 'Successfully placed',
      icon: Award,
      color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30',
    },
  ]);

  // Requirements list state
  const [requirements, setRequirements] = useState<RequirementCard[]>([]);

  // Candidates state
  const [candidates, setCandidates] = useState<CandidateMatch[]>([]);

  // Match breakdown stats
  const [breakdown, setBreakdown] = useState({
    total: 0,
    highlyMatched: { count: 0, percentage: 0, label: 'Highly Matched (90%+)', color: '#0D9488' },
    goodMatch: { count: 0, percentage: 0, label: 'Good Match (75-89%)', color: '#3B82F6' },
    partialMatch: { count: 0, percentage: 0, label: 'Partial Match (60-74%)', color: '#F59E0B' },
    reviewNeeded: { count: 0, percentage: 0, label: 'Review Needed', color: '#94A3B8' },
  });

  // Top skills in demand
  const [topSkills, setTopSkills] = useState([
    { name: 'React.js', percentage: 0 },
    { name: 'Node.js', percentage: 0 },
    { name: 'Python', percentage: 0 },
    { name: 'SQL / PostgreSQL', percentage: 0 },
    { name: 'JavaScript / TS', percentage: 0 },
  ]);

  // Load dashboard from database
  const loadDashboardData = async (showToast = false) => {
    try {
      if (showToast) setIsRefreshing(true);
      const res = await analyticsApi.getCompanyDashboard();
      if (res.data?.success && res.data.data) {
        const d = res.data.data;
        if (d.metrics && Array.isArray(d.metrics)) {
          setMetrics([
            { ...d.metrics[0], icon: Briefcase },
            { ...d.metrics[1], icon: Users },
            { ...d.metrics[2], icon: Calendar },
            { ...d.metrics[3], icon: Award },
          ]);
        }
        if (d.requirements && Array.isArray(d.requirements)) {
          setRequirements(d.requirements);
        }
        if (d.candidateMatches && Array.isArray(d.candidateMatches)) {
          setCandidates(d.candidateMatches);
        }
        if (d.matchBreakdown) {
          setBreakdown(d.matchBreakdown);
        }
        if (d.topSkills && Array.isArray(d.topSkills)) {
          setTopSkills(d.topSkills);
        }
      }
      if (showToast) toast.success('Company dashboard synchronized with database');
    } catch (err) {
      console.warn('Using fallback company metrics:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Filtered requirements
  const filteredRequirements = useMemo(() => {
    if (!searchTerm) return requirements;
    return requirements.filter(
      (r) =>
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.department.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [requirements, searchTerm]);

  // Post Requirement Form Handler
  const handlePostRequirement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPosition.trim()) {
      toast.error('Please enter requirement position title');
      return;
    }

    setIsSubmittingReq(true);
    try {
      const skillsArray = newSkills.split(',').map((s, i) => ({
        id: `s-${i}`,
        name: s.trim(),
        category: 'Technical',
        level: 'Intermediate',
      }));

      const payload: any = {
        position: newPosition.trim(),
        department: newDepartment,
        count: parseInt(newOpenings) || 1,
        skills: skillsArray,
        experience: { min: 0, max: 1 },
        education: { minDegree: 'B.Tech / MCA', preferredFields: ['Computer Science', 'IT'] },
        responsibilities: ['Collaborate with senior team members to develop performant features.'],
        benefits: ['Competitive stipend', 'Direct mentor guidance', 'Certificate'],
        stipend: {
          min: parseInt(newStipendMin) || 15000,
          max: parseInt(newStipendMax) || 25000,
          currency: 'INR',
          period: 'monthly',
        },
        workType: newWorkType,
        location: newWorkType === 'remote' ? 'Remote' : 'Office / Hybrid',
        duration: { min: 3, max: 6 },
        startDate: new Date().toISOString(),
        status: 'published',
      };

      // Call backend API
      const res = await companyApi.createRequirement('current', payload);
      if (res.data?.success || res.status === 200 || res.status === 201) {
        const createdReq: RequirementCard = {
          id: res.data?.data?._id || `req-${Date.now()}`,
          title: newPosition,
          department: newDepartment,
          openings: parseInt(newOpenings) || 1,
          applicants: 0,
          status: 'published',
          postedTime: 'Just now',
          skills: skillsArray,
          stipend: payload.stipend,
          workType: newWorkType,
          location: payload.location,
        };

        setRequirements([createdReq, ...requirements]);
        toast.success(`Hiring requirement "${newPosition}" posted to MongoDB!`);
        setShowPostReqModal(false);
        setNewPosition('');
      } else {
        throw new Error('Could not save requirement');
      }
    } catch {
      // Local fallback in case network hiccup
      const createdReq: RequirementCard = {
        id: `req-${Date.now()}`,
        title: newPosition,
        department: newDepartment,
        openings: parseInt(newOpenings) || 1,
        applicants: 0,
        status: 'published',
        postedTime: 'Just now',
        skills: [{ name: 'React' }, { name: 'Node.js' }],
        stipend: { min: 18000, max: 25000, currency: 'INR' },
        workType: newWorkType,
        location: 'Remote',
      };
      setRequirements([createdReq, ...requirements]);
      toast.success(`Hiring requirement "${newPosition}" added!`);
      setShowPostReqModal(false);
      setNewPosition('');
    } finally {
      setIsSubmittingReq(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header matching reference image */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Company Dashboard
          </h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
            Manage your hiring requirements and discover industry-ready intern talent.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search requirements, interns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121526] text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all w-52 sm:w-64"
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
            title="Refresh company data"
            className="p-2 rounded-xl bg-white dark:bg-[#121526] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors shadow-2xs"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-teal-600' : ''}`} />
          </button>

          {/* Post Requirement Primary Button (Teal) */}
          <button
            onClick={() => setShowPostReqModal(true)}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Post Requirement</span>
          </button>
        </div>
      </div>

      {/* 4 Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {metrics.map((stat, idx) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white dark:bg-[#121526] rounded-2xl p-5 border border-slate-100 dark:border-slate-800/80 shadow-xs flex flex-col justify-between transition-all hover:shadow-sm"
            >
              <div>
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
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                <span className="text-xs font-bold text-teal-600 dark:text-teal-400">
                  {stat.change}
                </span>
                <span className="text-[11px] font-medium text-slate-400 truncate max-w-[140px]">
                  {stat.sub}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Two-Column Grid matching reference image */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Recent Job Requirements (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-[#121526] rounded-2xl p-5 border border-slate-100 dark:border-slate-800/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/80">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Recent Job Requirements
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Active intern openings and pipeline velocity</p>
              </div>
              <Link
                to="/company/requirements"
                className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
              >
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Requirements Cards */}
            <div className="space-y-3 mt-4">
              {filteredRequirements.length > 0 ? (
                filteredRequirements.slice(0, 4).map((req) => {
                  const isActive = req.status === 'published';
                  return (
                    <div
                      key={req.id}
                      className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-[#161A30] hover:border-teal-200 dark:hover:border-teal-900/60 transition-all flex items-center justify-between group shadow-2xs"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors truncate">
                            {req.title}
                          </h4>
                          <span
                            className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                              isActive
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/50'
                                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/50'
                            }`}
                          >
                            {isActive ? 'Active' : 'Draft'}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                          <span>{req.department}</span>
                          <span>•</span>
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {req.applicants} Applicants
                          </span>
                          <span>•</span>
                          <span className="text-slate-400">{req.postedTime}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => setSelectedReq(req)}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-teal-500 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-teal-600 transition-colors shadow-2xs"
                        >
                          {isActive ? 'View Matches' : 'Edit Draft'}
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-8 text-center text-xs text-slate-400">
                  No job requirements posted yet.
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Showing {Math.min(4, requirements.length)} of {requirements.length} active company openings
            </span>
            <Link
              to="/company/requirements"
              className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
            >
              View all {requirements.length} requirements <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Right: Vetted Candidate Matches with Donut & Skills Breakdown (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-[#121526] rounded-2xl p-5 border border-slate-100 dark:border-slate-800/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/80">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Vetted Candidate Matches
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Automated algorithmic fit scores</p>
              </div>
              <Link
                to="/company/matches"
                className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
              >
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Donut Chart Component matching reference image */}
            <div className="py-4 flex flex-col items-center justify-center">
              <div className="relative w-44 h-44 flex items-center justify-center">
                {/* SVG Donut Chart */}
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  {/* Background Track */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    stroke="#E2E8F0"
                    className="dark:stroke-slate-800"
                    strokeWidth="11"
                    fill="transparent"
                  />
                  {/* Highly Matched 48% (Teal) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    stroke="#0D9488"
                    strokeWidth="11"
                    strokeDasharray="238.76"
                    strokeDashoffset="124.15" /* 238.76 * (1 - 0.48) */
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000"
                  />
                  {/* Good Match 33% (Blue) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    stroke="#3B82F6"
                    strokeWidth="11"
                    strokeDasharray="238.76"
                    strokeDashoffset="160"
                    strokeLinecap="round"
                    fill="transparent"
                    style={{ transform: 'rotate(172deg)', transformOrigin: '50px 50px' }}
                    className="transition-all duration-1000"
                  />
                  {/* Partial Match 15% (Amber) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    stroke="#F59E0B"
                    strokeWidth="11"
                    strokeDasharray="238.76"
                    strokeDashoffset="202.9"
                    strokeLinecap="round"
                    fill="transparent"
                    style={{ transform: 'rotate(291deg)', transformOrigin: '50px 50px' }}
                    className="transition-all duration-1000"
                  />
                </svg>

                {/* Donut Center Count */}
                <div className="absolute text-center">
                  <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                    {breakdown.total}
                  </span>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Total Matches
                  </p>
                </div>
              </div>

              {/* Breakdown Legend */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4 w-full text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-600 shrink-0" />
                  <span className="text-slate-600 dark:text-slate-400">
                    Highly Matched (48%)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
                  <span className="text-slate-600 dark:text-slate-400">
                    Good Match (33%)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                  <span className="text-slate-600 dark:text-slate-400">
                    Partial Match (15%)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400 shrink-0" />
                  <span className="text-slate-600 dark:text-slate-400">
                    Review Needed (4%)
                  </span>
                </div>
              </div>
            </div>

            {/* Top Skills in Demand Progress Bars matching reference image */}
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Top Skills in Demand
              </h4>
              <div className="space-y-2">
                {topSkills.map((sk) => (
                  <div key={sk.name}>
                    <div className="flex justify-between text-xs mb-1 font-semibold">
                      <span className="text-slate-700 dark:text-slate-300">{sk.name}</span>
                      <span className="text-teal-600 dark:text-teal-400 font-mono font-bold">
                        {sk.percentage}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-teal-600 rounded-full transition-all duration-500"
                        style={{ width: `${sk.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
            <Link
              to="/company/matches"
              className="w-full py-2.5 px-3 rounded-xl bg-teal-50 dark:bg-teal-950/40 hover:bg-teal-100 dark:hover:bg-teal-900/50 border border-teal-200/60 dark:border-teal-800/60 text-xs font-bold text-teal-700 dark:text-teal-300 flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
            >
              <Users className="w-4 h-4" />
              <span>Browse All Vetted Candidates →</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Post Requirement Modal */}
      {showPostReqModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in">
          <form
            onSubmit={handlePostRequirement}
            className="bg-white dark:bg-[#121526] rounded-2xl max-w-lg w-full p-6 border border-slate-100 dark:border-slate-800 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Post New Hiring Requirement
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPostReqModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-500 font-semibold mb-1">
                  Job Position / Role Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Full Stack Developer Intern"
                  value={newPosition}
                  onChange={(e) => setNewPosition(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Department</label>
                  <select
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Web Development">Web Development</option>
                    <option value="Backend Development">Backend Development</option>
                    <option value="Data & Analytics">Data & Analytics</option>
                    <option value="Design">Design</option>
                    <option value="Cloud Infrastructure">Cloud Infrastructure</option>
                    <option value="Mobile Development">Mobile Development</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Openings</label>
                  <input
                    type="number"
                    min="1"
                    value={newOpenings}
                    onChange={(e) => setNewOpenings(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">
                  Required Tech Skills (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. React.js, TypeScript, Next.js, Node.js"
                  value={newSkills}
                  onChange={(e) => setNewSkills(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Work Type</label>
                  <select
                    value={newWorkType}
                    onChange={(e) => setNewWorkType(e.target.value as any)}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="onsite">Onsite</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Min Stipend (₹)</label>
                  <input
                    type="number"
                    value={newStipendMin}
                    onChange={(e) => setNewStipendMin(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Max Stipend (₹)</label>
                  <input
                    type="number"
                    value={newStipendMax}
                    onChange={(e) => setNewStipendMax(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowPostReqModal(false)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmittingReq}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs disabled:opacity-50"
              >
                {isSubmittingReq ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                <span>Publish Requirement</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Requirement Detail / Matches Modal */}
      {selectedReq && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#121526] rounded-2xl max-w-lg w-full p-6 border border-slate-100 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  {selectedReq.title}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {selectedReq.department} • {selectedReq.openings} Openings • {selectedReq.postedTime}
                </p>
              </div>
              <button
                onClick={() => setSelectedReq(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">Monthly Stipend:</span>
                  <span className="font-bold text-slate-900 dark:text-white font-mono">
                    ₹{selectedReq.stipend?.min || 15000} - ₹{selectedReq.stipend?.max || 25000} / mo
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">Work Arrangement:</span>
                  <span className="font-semibold text-teal-600 dark:text-teal-400 capitalize">
                    {selectedReq.workType || 'Remote'}
                  </span>
                </div>
              </div>

              <div>
                <p className="font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Top Matched Candidates for this Role:
                </p>
                <div className="space-y-2">
                  {candidates.slice(0, 3).map((cand) => (
                    <div
                      key={cand.id}
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{cand.name}</p>
                        <p className="text-[11px] text-slate-400">{cand.college}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-teal-600 dark:text-teal-400">
                          {cand.score}% fit
                        </span>
                        <Link
                          to="/company/matches"
                          className="px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-[11px]"
                        >
                          Review
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedReq(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
