import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  BookOpen,
  Briefcase,
  Award,
  CheckCircle2,
  TrendingUp,
  Clock,
  ArrowRight,
  ChevronRight,
  ExternalLink,
  Code,
  Users,
  Search,
  Check,
  Trophy,
  Layers,
  FileCheck,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { ReadinessScoreCard } from '../components/readiness-score-card';
import { SkillBreakdown } from '../components/skill-breakdown';
import { ProjectProgress } from '../components/project-progress';
import { RecentActivity } from '../components/recent-activity';
import { ProgramDetailsModal } from '../../landing/components/program-details-modal';
import { PROGRAM_CONFIGS, PROGRAM_DISCLAIMER, ProgramTypeKey } from '@interhive/shared';
import { useIntern } from '../../../api/hooks/use-intern';
import { useProject } from '../../../api/hooks/use-project';
import { useDashboard } from '../hooks/use-dashboard';
import { useAuth } from '../../../api/hooks/use-auth';
import { LoadingSpinner } from '../../../shared/components/common/loading-spinner';

export const InternDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { useReadiness, useProfile } = useIntern();
  const { useMyProjects } = useProject();
  const { useRecentActivities } = useDashboard();

  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: readiness, isLoading: readinessLoading } = useReadiness();
  const { data: projects, isLoading: projectsLoading } = useMyProjects();
  const { data: activities, isLoading: activitiesLoading } = useRecentActivities();

  // Active view tab inside dashboard
  const [activeTab, setActiveTab] = useState<'journey' | 'training' | 'assessments' | 'matching' | 'workspace'>('journey');
  const [isProgramModalOpen, setIsProgramModalOpen] = useState(false);
  const [selectedProgramKey, setSelectedProgramKey] = useState<ProgramTypeKey>('TWO_YEAR');

  const isLoading = profileLoading || readinessLoading || projectsLoading || activitiesLoading;

  if (isLoading) {
    return <LoadingSpinner label="Loading dashboard..." />;
  }

  const firstName = profile?.personalInfo?.firstName || user?.firstName || 'Ankit';
  const lastName = profile?.personalInfo?.lastName || user?.lastName || 'Soni';

  // Readiness data
  const readinessData = {
    overall: readiness?.overall || 78,
    breakdown: readiness?.breakdown || {
      technicalSkills: 82,
      projects: 85,
      communication: 75,
      problemSolving: 80,
      industryWorkflow: 78,
      teamCollaboration: 74,
      leadership: 68,
      adaptability: 76,
    },
  };

  const skillData = readinessData.breakdown
    ? Object.entries(readinessData.breakdown).map(([key, value]) => ({
        category: key.replace(/([A-Z])/g, ' $1').trim(),
        score: Number(value) || 0,
        fullMark: 100,
      }))
    : [];

  const totalSkills = skillData.length;
  const skillsCompleted = skillData.filter(s => s.score >= 70).length;
  const activeTasksCount = (projects as any[])?.filter((p: any) => p.status === 'in_progress').length || 1;
  const upcomingDeadlinesCount = 2;

  // Training modules matching Image 2
  const trainingModules = [
    {
      id: 'm1',
      title: 'Python for Industry',
      subtitle: 'Basics to Advanced',
      lessons: 12,
      projects: 4,
      status: 'completed',
      score: 100,
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      id: 'm2',
      title: 'Web Development',
      subtitle: 'React, Node.js, APIs',
      lessons: 16,
      projects: 5,
      status: 'in_progress',
      score: 65,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      id: 'm3',
      title: 'Data Structures & Problem Solving',
      subtitle: 'DSA, SQL, System Design Basics',
      lessons: 14,
      projects: 5,
      status: 'not_started',
      score: 0,
      color: 'bg-purple-50 text-purple-600',
    },
    {
      id: 'm4',
      title: 'Professional Skills',
      subtitle: 'Communication, Teamwork, Resume',
      lessons: 8,
      projects: 2,
      status: 'not_started',
      score: 0,
      color: 'bg-amber-50 text-amber-600',
    },
  ];

  // Assessments matching Image 2
  const assessmentRounds = [
    {
      id: 'a1',
      title: 'Aptitude Test',
      type: 'Quantitative, Logical, Verbal',
      duration: '60 mins',
      questions: '40 Questions',
      status: 'available',
      color: 'bg-blue-500',
    },
    {
      id: 'a2',
      title: 'Technical Assessment',
      type: 'Stack-specific coding test',
      duration: '90 mins',
      questions: '5 Problems',
      status: 'available',
      color: 'bg-purple-500',
    },
    {
      id: 'a3',
      title: 'HR Round',
      type: 'Behavioral and communication',
      duration: '30 mins',
      questions: 'Video Interview',
      status: 'scheduled',
      color: 'bg-rose-500',
    },
  ];

  // Company Matches matching Image 2
  const companyMatches = [
    {
      company: 'Tata Technologies',
      role: 'Software Engineering Intern',
      mode: 'Remote',
      duration: '4 Months',
      matchScore: 85,
      badge: 'Top Match',
    },
    {
      company: 'Infosys',
      role: 'Backend Developer Intern',
      mode: 'Bangalore (Hybrid)',
      duration: '4 Months',
      matchScore: 78,
      badge: 'Recommended',
    },
    {
      company: 'Deloitte',
      role: 'Data Analyst Intern',
      mode: 'Remote',
      duration: '6 Months',
      matchScore: 72,
      badge: 'Recommended',
    },
  ];

  return (
    <div className="space-y-6 pb-16">
      
      {/* ============================================================== */}
      {/* 1. TOP WELCOME HEADER BAR (MATCHING REFERENCE IMAGE 2)        */}
      {/* ============================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>Welcome Back, {firstName}!</span>
            <span>👋</span>
          </h1>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
            Your PPO journey is in progress. Keep going!
          </p>
        </div>

        {/* Global Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search anything..."
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#1A1D33] border border-slate-200/80 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all shadow-2xs"
          />
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. PPO TRACK PROGRESS CARD (MATCHING REFERENCE IMAGE 2)        */}
      {/* ============================================================== */}
      <div className="bg-white dark:bg-[#151829] rounded-[2rem] p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
        
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-0.5">
              Current Enrollment
            </span>
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              PPO Track — Software Engineering
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsProgramModalOpen(true)}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer mr-2"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>View Full Roadmap</span>
            </button>
            <span className="text-xs font-black text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800">
              Month 2 of 6
            </span>
            <span className="text-xs font-black text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
              In Progress
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-black">
            <span className="text-slate-600 dark:text-slate-300">Overall Pathway Progress</span>
            <span className="text-blue-600 dark:text-blue-400">60%</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-full transition-all duration-500" 
              style={{ width: '60%' }} 
            />
          </div>
        </div>

        {/* 6-Stage Journey Stepper */}
        <div className="pt-2 overflow-x-auto pb-2 scrollbar-none">
          <div className="flex items-center justify-between min-w-[540px]">
            
            {/* Step 1: Selected */}
            <div className="flex flex-col items-center">
              <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs shadow-xs">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
              <span className="text-[10px] font-black text-slate-700 dark:text-slate-300 mt-1.5">Selected</span>
            </div>
            <div className="flex-1 h-0.5 bg-emerald-500 mx-2" />

            {/* Step 2: Training */}
            <div className="flex flex-col items-center">
              <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs shadow-xs">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
              <span className="text-[10px] font-black text-slate-700 dark:text-slate-300 mt-1.5">Training</span>
            </div>
            <div className="flex-1 h-0.5 bg-emerald-500 mx-2" />

            {/* Step 3: Company Matching */}
            <div className="flex flex-col items-center">
              <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs shadow-xs">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
              <span className="text-[10px] font-black text-slate-700 dark:text-slate-300 mt-1.5">Company Matching</span>
            </div>
            <div className="flex-1 h-0.5 bg-blue-600 mx-2" />

            {/* Step 4: Company Internship (ACTIVE) */}
            <div className="flex flex-col items-center">
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-black shadow-md ring-4 ring-blue-100 dark:ring-blue-900/40">
                4
              </div>
              <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 mt-1.5">
                Company Internship (Month 2/4)
              </span>
            </div>
            <div className="flex-1 h-0.5 bg-slate-200 dark:bg-slate-700 mx-2" />

            {/* Step 5: Evaluation */}
            <div className="flex flex-col items-center opacity-60">
              <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center text-xs font-bold">
                5
              </div>
              <span className="text-[10px] font-bold text-slate-500 mt-1.5">Evaluation</span>
            </div>
            <div className="flex-1 h-0.5 bg-slate-200 dark:bg-slate-700 mx-2" />

            {/* Step 6: PPO */}
            <div className="flex flex-col items-center opacity-60">
              <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center text-xs font-bold">
                6
              </div>
              <span className="text-[10px] font-bold text-slate-500 mt-1.5">PPO</span>
            </div>

          </div>
        </div>

      </div>

      {/* ============================================================== */}
      {/* 3. CURRENT STAGE & PERFORMANCE OVERVIEW (MATCHING IMAGE 2)     */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Current Stage Card */}
        <div className="md:col-span-6 bg-white dark:bg-[#151829] rounded-[2rem] p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-black tracking-wider text-slate-400 uppercase block mb-2">
              Current Stage
            </span>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 shadow-2xs">
                <Building2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-black text-slate-900 dark:text-white">
                    Company Internship
                  </h4>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                    Month 2 of 4
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold leading-relaxed">
                  You are currently working with <strong>Tata Technologies</strong> on client deliverables.
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Assigned Mentor: <strong>Rahul Verma</strong> (Senior Engineering Lead)
                </p>
              </div>
            </div>
          </div>

          <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Next Sync: <strong>Today, 4:00 PM IST</strong>
            </span>
            <button
              onClick={() => setActiveTab('workspace')}
              className="px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/50 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-black text-xs transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>View Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Performance Overview Card */}
        <div className="md:col-span-6 bg-white dark:bg-[#151829] rounded-[2rem] p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-black tracking-wider text-slate-400 uppercase block mb-2">
              Performance Overview
            </span>

            <div className="flex items-center gap-6">
              {/* Circular Gauge 60% */}
              <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-100 dark:text-slate-800"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-emerald-500"
                    strokeDasharray="60, 100"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-base font-black text-slate-900 dark:text-white leading-none">60%</span>
                  <span className="text-[8px] font-bold text-slate-400">PPO Ready</span>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="space-y-1.5 flex-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-semibold">Projects Completed</span>
                  <span className="font-black text-slate-800 dark:text-slate-200">4/5</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-semibold">Mentor Review</span>
                  <span className="font-extrabold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded text-[10px]">
                    Completed
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-semibold">Company Review</span>
                  <span className="font-extrabold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded text-[10px]">
                    Pending
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Next Performance Review:</span>
            <span className="font-black text-slate-700 dark:text-slate-300">October 10, 2026</span>
          </div>
        </div>

      </div>

      {/* ============================================================== */}
      {/* 4. WORKSPACE TABS SELECTOR (IMAGE 2 SUITE)                    */}
      {/* ============================================================== */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800 scrollbar-none">
        <button
          onClick={() => setActiveTab('journey')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'journey'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white dark:bg-[#151829] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
          }`}
        >
          Journey & Readiness
        </button>
        <button
          onClick={() => setActiveTab('training')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'training'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white dark:bg-[#151829] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
          }`}
        >
          Training Modules
        </button>
        <button
          onClick={() => setActiveTab('assessments')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'assessments'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white dark:bg-[#151829] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
          }`}
        >
          Assessment Center
        </button>
        <button
          onClick={() => setActiveTab('matching')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'matching'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white dark:bg-[#151829] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
          }`}
        >
          Company Matching
        </button>
        <button
          onClick={() => setActiveTab('workspace')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'workspace'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white dark:bg-[#151829] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
          }`}
        >
          Internship Workspace
        </button>
        <Link
          to="/certificate"
          className="px-4 py-2 rounded-xl text-xs font-black bg-white dark:bg-[#151829] text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 hover:bg-purple-50 transition-colors whitespace-nowrap flex items-center gap-1.5"
        >
          <Award className="w-3.5 h-3.5" />
          <span>Certificate of Completion →</span>
        </Link>
      </div>

      {/* ============================================================== */}
      {/* 5. TAB 1: JOURNEY & READINESS                                  */}
      {/* ============================================================== */}
      {activeTab === 'journey' && (
        <div className="space-y-6">
          <ReadinessScoreCard
            score={readinessData.overall}
            breakdown={readinessData.breakdown}
            trend={5}
            skillsCompleted={skillsCompleted}
            totalSkills={totalSkills}
            activeTasksCount={activeTasksCount}
            upcomingDeadlinesCount={upcomingDeadlinesCount}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-4">
              <ProjectProgress
                projects={(projects as any[])?.map((p: any) => ({
                  id: p.id || p._id,
                  title: p.title || 'Untitled Project',
                  progress: p.progress || 0,
                  status: p.status || 'not_started',
                  deadline: p.duration?.endDate,
                })) || []}
              />
            </div>

            <div className="lg:col-span-4">
              <RecentActivity activities={activities || []} />
            </div>

            <div className="lg:col-span-4">
              <SkillBreakdown skills={skillData} />
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 6. TAB 2: TRAINING MODULES (MATCHING IMAGE 2 MIDDLE-RIGHT)    */}
      {/* ============================================================== */}
      {activeTab === 'training' && (
        <div className="bg-white dark:bg-[#151829] rounded-[2rem] p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Training Modules
              </h3>
              <p className="text-xs text-slate-500 font-semibold">
                Complete all modules to become industry-ready.
              </p>
            </div>
            <Link
              to="/training"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>Full LMS View</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {trainingModules.map(mod => (
              <div
                key={mod.id}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-[#1A1D33] border border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl ${mod.color} flex items-center justify-center shrink-0`}>
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white">
                      {mod.title}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium">
                      {mod.subtitle} · {mod.lessons} Lessons · {mod.projects} Projects
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="block text-xs font-black text-slate-800 dark:text-slate-200">
                      {mod.score}% Completed
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      mod.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                      mod.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {mod.status === 'completed' ? 'Completed' : mod.status === 'in_progress' ? 'In-Progress' : 'Not Started'}
                    </span>
                  </div>

                  <Link
                    to="/training"
                    className="px-4 py-2 rounded-xl bg-white dark:bg-[#151829] border border-slate-200 dark:border-slate-800 text-xs font-black text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-colors shadow-2xs"
                  >
                    {mod.status === 'completed' ? 'View' : 'Continue'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 7. TAB 3: ASSESSMENT CENTER (MATCHING IMAGE 2 BOTTOM 1)        */}
      {/* ============================================================== */}
      {activeTab === 'assessments' && (
        <div className="bg-white dark:bg-[#151829] rounded-[2rem] p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Assessment Center
              </h3>
              <p className="text-xs text-slate-500 font-semibold">
                Complete assessments to verify your skills for the PPO Track.
              </p>
            </div>
            <Link
              to="/assessments"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>View All Tests</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {assessmentRounds.map(round => (
              <div
                key={round.id}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-[#1A1D33] border border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl ${round.color} text-white flex items-center justify-center shadow-xs`}>
                      <Award className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-white dark:bg-[#151829] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                      {round.duration}
                    </span>
                  </div>

                  <h4 className="text-sm font-black text-slate-900 dark:text-white">
                    {round.title}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {round.type}
                  </p>
                  <span className="text-[11px] font-bold text-slate-400 block mt-2">
                    {round.questions}
                  </span>
                </div>

                <Link
                  to="/assessments"
                  className={`w-full py-2.5 rounded-xl font-black text-xs text-center transition-all ${
                    round.status === 'scheduled'
                      ? 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                  }`}
                >
                  {round.status === 'scheduled' ? 'Scheduled' : 'Start Test →'}
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 8. TAB 4: COMPANY MATCHING (MATCHING IMAGE 2 BOTTOM 2)         */}
      {/* ============================================================== */}
      {activeTab === 'matching' && (
        <div className="bg-white dark:bg-[#151829] rounded-[2rem] p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Company Matching
              </h3>
              <p className="text-xs text-slate-500 font-semibold">
                Based on your skills and performance, we match you with vetted partner companies.
              </p>
            </div>
            <Link
              to="/opportunities"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>Explore All Opportunities</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {companyMatches.map((m, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-[#1A1D33] border border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xs">
                      {m.company.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="text-xs font-black text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                      {m.matchScore}% Match
                    </span>
                  </div>

                  <h4 className="text-sm font-black text-slate-900 dark:text-white">
                    {m.company}
                  </h4>
                  <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                    {m.role}
                  </p>
                  <p className="text-[11px] text-slate-500 font-medium mt-1">
                    {m.mode} · {m.duration}
                  </p>
                </div>

                <Link
                  to="/opportunities"
                  className="w-full py-2 rounded-xl bg-white dark:bg-[#151829] border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 text-center hover:bg-slate-50 transition-colors shadow-2xs"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 9. TAB 5: INTERNSHIP WORKSPACE (MATCHING IMAGE 2 BOTTOM 3)     */}
      {/* ============================================================== */}
      {activeTab === 'workspace' && (
        <div className="bg-white dark:bg-[#151829] rounded-[2rem] p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider block mb-1">
                Active Project Sprint
              </span>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Project: Inventory Management System
              </h3>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                Partner: Tata Technologies · Due: October 15, 2026
              </p>
            </div>
            <span className="text-xs font-black text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
              In Progress
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Task Checklist */}
            <div className="md:col-span-7 space-y-2">
              <span className="text-xs font-black text-slate-900 dark:text-white block mb-2">
                Deliverables Checklist
              </span>
              
              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/70 flex items-center gap-3">
                <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                <span className="text-xs font-bold text-slate-800 line-through">Requirement Analysis</span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/70 flex items-center gap-3">
                <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                <span className="text-xs font-bold text-slate-800 line-through">Database Schema Design (PostgreSQL)</span>
              </div>
              <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-200/80 flex items-center gap-3">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-black text-blue-900">API Development & Microservices (In Progress)</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3 opacity-60">
                <div className="w-4 h-4 rounded-full border border-slate-300" />
                <span className="text-xs font-semibold text-slate-600">Frontend React Dashboard Integration</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3 opacity-60">
                <div className="w-4 h-4 rounded-full border border-slate-300" />
                <span className="text-xs font-semibold text-slate-600">Testing & Cloud Deployment (Docker)</span>
              </div>
            </div>

            {/* Project Details Sidebar */}
            <div className="md:col-span-5 p-5 rounded-2xl bg-slate-50 dark:bg-[#1A1D33] border border-slate-200/80 dark:border-slate-800 space-y-3">
              <span className="text-xs font-black text-slate-900 dark:text-white block">
                Project Details
              </span>
              <div className="text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Company:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">Tata Technologies</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Mentor:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">Rahul Verma</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Team:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">3 Interns</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Stack:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">Python, React, PostgreSQL</span>
                </div>
              </div>

              <Link
                to="/projects"
                className="mt-4 w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs text-center block transition-colors shadow-xs"
              >
                Open Full Project Board →
              </Link>
            </div>

          </div>
        </div>
      )}

      {/* Program Details Modal */}
      <ProgramDetailsModal
        isOpen={isProgramModalOpen}
        onClose={() => setIsProgramModalOpen(false)}
        programType={selectedProgramKey}
        onEnroll={() => setIsProgramModalOpen(false)}
      />
    </div>
  );
};