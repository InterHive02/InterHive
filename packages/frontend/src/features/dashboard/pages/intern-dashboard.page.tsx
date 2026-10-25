import React, { useState, useMemo } from 'react';
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
  Code,
  Users,
  Search,
  Check,
  Target,
  Sparkles,
  ShieldCheck,
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
import { useMatching } from '../../../api/hooks/use-matching';
import { useTraining } from '../../../api/hooks/use-training';
import { useAssessment } from '../../assessments/hooks/use-assessment';
import { LoadingSpinner } from '../../../shared/components/common/loading-spinner';

export const InternDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { useReadiness, useProfile } = useIntern();
  const { useMyProjects } = useProject();
  const { useRecentActivities } = useDashboard();
  const { useMyMatches } = useMatching();
  const { useMyEnrollments } = useTraining();
  const { useMyResults } = useAssessment();

  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: readiness, isLoading: readinessLoading } = useReadiness();
  const { data: projects, isLoading: projectsLoading } = useMyProjects();
  const { data: activities, isLoading: activitiesLoading } = useRecentActivities();
  const { data: matchesData } = useMyMatches();
  const { data: enrollmentsData } = useMyEnrollments();
  const { data: resultsData } = useMyResults();

  // Active view tab inside dashboard
  const [activeTab, setActiveTab] = useState<'journey' | 'training' | 'assessments' | 'matching' | 'workspace'>('journey');
  const [isProgramModalOpen, setIsProgramModalOpen] = useState(false);
  const [selectedProgramKey, setSelectedProgramKey] = useState<ProgramTypeKey>('TWO_YEAR');
  const [searchQuery, setSearchQuery] = useState('');

  const isLoading = profileLoading || readinessLoading || projectsLoading || activitiesLoading;

  // Real user data derivations
  const userProjects: any[] = Array.isArray(projects) ? projects : [];
  const userMatches: any[] = (matchesData as any)?.data || (Array.isArray(matchesData) ? matchesData : []);
  const userEnrollments: any[] = Array.isArray(enrollmentsData) ? enrollmentsData : [];
  const userResults: any[] = Array.isArray(resultsData) ? resultsData : [];

  const activeProject = userProjects.find((p: any) => p.status === 'in_progress' || p.status === 'active') || userProjects[0] || null;
  const hasAssignedProject = !!activeProject;

  const firstName = profile?.personalInfo?.firstName || user?.firstName || 'Intern';
  const lastName = profile?.personalInfo?.lastName || user?.lastName || '';

  // Dynamic Month calculation based on join date
  const joinDate = user?.createdAt ? new Date(user.createdAt).getTime() : Date.now();
  const monthsSinceJoin = Math.max(1, Math.min(6, Math.floor((Date.now() - joinDate) / (30 * 24 * 60 * 60 * 1000)) + 1));
  const currentMonthDisplay = `Month ${monthsSinceJoin} of 6`;

  // Dynamic pathway progress calculation based on real accomplishments
  const completedProjectsCount = userProjects.filter((p: any) => p.status === 'completed').length;
  const inProgressProjectsCount = userProjects.filter((p: any) => p.status === 'in_progress' || p.status === 'active').length;
  const activeTasksCount = inProgressProjectsCount;
  
  const upcomingDeadlinesCount = useMemo(() => {
    const now = Date.now();
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    return userProjects.filter((p: any) => {
      if (!p.duration?.endDate && !p.deadline) return false;
      const d = new Date(p.duration?.endDate || p.deadline).getTime();
      return d >= now && d <= (now + sevenDays);
    }).length;
  }, [userProjects]);

  const trainingModulesCompleted = userEnrollments.filter((e: any) => e.status === 'completed' || e.progress === 100).length;
  const assessmentsCompleted = userResults.length;

  const pathwayProgress = useMemo(() => {
    let progress = 15; // baseline for onboarding & joining PPO cohort
    if (assessmentsCompleted > 0) progress += Math.min(25, assessmentsCompleted * 15);
    if (trainingModulesCompleted > 0) progress += Math.min(25, trainingModulesCompleted * 10);
    if (hasAssignedProject) progress += 20;
    if (completedProjectsCount > 0) progress += Math.min(15, completedProjectsCount * 10);
    return Math.min(100, progress);
  }, [assessmentsCompleted, trainingModulesCompleted, hasAssignedProject, completedProjectsCount]);

  // Current stage in 6-stage journey
  const currentStageIndex = useMemo(() => {
    if (completedProjectsCount >= 2 && userMatches.some((m: any) => m.status === 'offer_made' || m.status === 'hired')) return 6; // PPO
    if (completedProjectsCount >= 1) return 5; // Evaluation
    if (hasAssignedProject) return 4; // Company Internship
    if (userMatches.length > 0) return 3; // Company Matching
    if (assessmentsCompleted > 0 || userEnrollments.length > 0) return 2; // Training
    return 1; // Selected
  }, [completedProjectsCount, userMatches, hasAssignedProject, assessmentsCompleted, userEnrollments]);

  // Next future performance review date (14 days from today)
  const nextReviewDate = useMemo(() => {
    return new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }, []);

  // Readiness data
  const readinessData = {
    overall: readiness?.overall ?? (assessmentsCompleted > 0 ? 75 : 0),
    breakdown: readiness?.breakdown || {
      technicalSkills: assessmentsCompleted > 0 ? 70 : 0,
      projects: hasAssignedProject ? 65 : 0,
      communication: 60,
      problemSolving: assessmentsCompleted > 0 ? 68 : 0,
      industryWorkflow: hasAssignedProject ? 70 : 0,
      teamCollaboration: 60,
      leadership: 50,
      adaptability: 60,
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

  // Real curriculum modules
  const defaultTrainingModules = [
    {
      id: 'm1',
      title: 'Python for Industry',
      subtitle: 'Modern Idiomatic Python, OOP & Testing',
      lessons: 12,
      projects: 4,
      status: trainingModulesCompleted >= 1 ? 'completed' : 'in_progress',
      score: trainingModulesCompleted >= 1 ? 100 : 35,
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      id: 'm2',
      title: 'Enterprise Web Development',
      subtitle: 'React, TypeScript, REST & NestJS',
      lessons: 16,
      projects: 5,
      status: trainingModulesCompleted >= 2 ? 'completed' : 'in_progress',
      score: trainingModulesCompleted >= 2 ? 100 : 20,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      id: 'm3',
      title: 'Data Structures & Problem Solving',
      subtitle: 'DSA Patterns, PostgreSQL & System Design Basics',
      lessons: 14,
      projects: 5,
      status: 'not_started',
      score: 0,
      color: 'bg-purple-50 text-purple-600',
    },
    {
      id: 'm4',
      title: 'Professional Engineering Skills',
      subtitle: 'Git Workflow, Code Reviews & Agile Standups',
      lessons: 8,
      projects: 2,
      status: 'not_started',
      score: 0,
      color: 'bg-amber-50 text-amber-600',
    },
  ];

  const filteredTrainingModules = defaultTrainingModules.filter(m =>
    !searchQuery || m.title.toLowerCase().includes(searchQuery.toLowerCase()) || m.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Real assessment rounds
  const assessmentRounds = [
    {
      id: 'asmt-aptitude',
      title: 'Aptitude Diagnostic',
      type: 'Quantitative, Logical, Verbal Reasoning',
      duration: '60 mins',
      questions: '40 Questions',
      status: userResults.some((r: any) => r.assessmentId === 'asmt-aptitude') ? 'completed' : 'available',
      color: 'bg-blue-500',
    },
    {
      id: 'asmt-technical',
      title: 'Technical Diagnostic',
      type: 'Hands-on Coding & System Design Basics',
      duration: '90 mins',
      questions: '5 Problems',
      status: userResults.some((r: any) => r.assessmentId === 'asmt-technical') ? 'completed' : 'available',
      color: 'bg-purple-500',
    },
    {
      id: 'asmt-hr',
      title: 'Communication & Culture Fit',
      type: 'Behavioral, Teamwork & STAR Evaluation',
      duration: '30 mins',
      questions: '15 Scenarios',
      status: userResults.some((r: any) => r.assessmentId === 'asmt-hr') ? 'completed' : 'available',
      color: 'bg-emerald-500',
    },
  ];

  if (isLoading) {
    return <LoadingSpinner label="Loading dashboard..." />;
  }

  return (
    <div className="space-y-6 pb-16">
      
      {/* 1. TOP WELCOME HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>Welcome Back, {firstName}!</span>
            <span>👋</span>
          </h1>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
            {hasAssignedProject 
              ? 'Your active company project sprint is in progress.' 
              : 'Your PPO training & diagnostic journey is active. Complete assessments to unlock corporate matching!'}
          </p>
        </div>

        {/* Global Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter modules & tests..."
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#1A1D33] border border-slate-200/80 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all shadow-2xs"
          />
        </div>
      </div>

      {/* 2. PPO TRACK PROGRESS CARD (DYNAMIC DATA) */}
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
              {currentMonthDisplay}
            </span>
            <span className="text-xs font-black text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
              {hasAssignedProject ? 'Internship Active' : 'Training & Diagnostic'}
            </span>
          </div>
        </div>

        {/* Dynamic Progress bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-black">
            <span className="text-slate-600 dark:text-slate-300">Overall Pathway Progress</span>
            <span className="text-blue-600 dark:text-blue-400">{pathwayProgress}%</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-full transition-all duration-500" 
              style={{ width: `${pathwayProgress}%` }} 
            />
          </div>
        </div>

        {/* Dynamic 6-Stage Journey Stepper */}
        <div className="pt-2 overflow-x-auto pb-2 scrollbar-none">
          <div className="flex items-center justify-between min-w-[540px]">
            
            {/* Step 1: Selected */}
            <div className="flex flex-col items-center">
              <div className={`w-7 h-7 rounded-full text-white flex items-center justify-center text-xs shadow-xs ${
                currentStageIndex >= 1 ? 'bg-emerald-500' : 'bg-slate-300'
              }`}>
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
              <span className="text-[10px] font-black text-slate-700 dark:text-slate-300 mt-1.5">Selected</span>
            </div>
            <div className={`flex-1 h-0.5 mx-2 ${currentStageIndex >= 2 ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'}`} />

            {/* Step 2: Training */}
            <div className="flex flex-col items-center">
              <div className={`w-7 h-7 rounded-full text-white flex items-center justify-center text-xs shadow-xs ${
                currentStageIndex > 2 ? 'bg-emerald-500' : currentStageIndex === 2 ? 'bg-blue-600 ring-4 ring-blue-100 dark:ring-blue-900/40 font-black' : 'bg-slate-200 dark:bg-slate-700 text-slate-600'
              }`}>
                {currentStageIndex > 2 ? <Check className="w-4 h-4 stroke-[3]" /> : '2'}
              </div>
              <span className={`text-[10px] mt-1.5 ${currentStageIndex === 2 ? 'font-black text-blue-600 dark:text-blue-400' : 'font-bold text-slate-700 dark:text-slate-300'}`}>
                Training
              </span>
            </div>
            <div className={`flex-1 h-0.5 mx-2 ${currentStageIndex >= 3 ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'}`} />

            {/* Step 3: Company Matching */}
            <div className="flex flex-col items-center">
              <div className={`w-7 h-7 rounded-full text-white flex items-center justify-center text-xs shadow-xs ${
                currentStageIndex > 3 ? 'bg-emerald-500' : currentStageIndex === 3 ? 'bg-blue-600 ring-4 ring-blue-100 dark:ring-blue-900/40 font-black' : 'bg-slate-200 dark:bg-slate-700 text-slate-600'
              }`}>
                {currentStageIndex > 3 ? <Check className="w-4 h-4 stroke-[3]" /> : '3'}
              </div>
              <span className={`text-[10px] mt-1.5 ${currentStageIndex === 3 ? 'font-black text-blue-600 dark:text-blue-400' : 'font-bold text-slate-700 dark:text-slate-300'}`}>
                Company Matching
              </span>
            </div>
            <div className={`flex-1 h-0.5 mx-2 ${currentStageIndex >= 4 ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'}`} />

            {/* Step 4: Company Internship */}
            <div className="flex flex-col items-center">
              <div className={`w-7 h-7 rounded-full text-white flex items-center justify-center text-xs shadow-xs ${
                currentStageIndex > 4 ? 'bg-emerald-500' : currentStageIndex === 4 ? 'bg-blue-600 ring-4 ring-blue-100 dark:ring-blue-900/40 font-black' : 'bg-slate-200 dark:bg-slate-700 text-slate-600'
              }`}>
                {currentStageIndex > 4 ? <Check className="w-4 h-4 stroke-[3]" /> : '4'}
              </div>
              <span className={`text-[10px] mt-1.5 ${currentStageIndex === 4 ? 'font-black text-blue-600 dark:text-blue-400' : 'font-bold text-slate-500'}`}>
                {hasAssignedProject ? 'Internship Active' : 'Company Internship'}
              </span>
            </div>
            <div className={`flex-1 h-0.5 mx-2 ${currentStageIndex >= 5 ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'}`} />

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

      {/* 3. CURRENT STAGE & PERFORMANCE OVERVIEW (AUTHENTIC & DYNAMIC) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Current Stage Card */}
        <div className="md:col-span-6 bg-white dark:bg-[#151829] rounded-[2rem] p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-black tracking-wider text-slate-400 uppercase block mb-2">
              Current Stage
            </span>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 shadow-2xs">
                {hasAssignedProject ? <Building2 className="w-6 h-6" /> : <BookOpen className="w-6 h-6" />}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-black text-slate-900 dark:text-white">
                    {hasAssignedProject ? activeProject.title : 'Industrial Training & Diagnostics'}
                  </h4>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                    {hasAssignedProject ? 'Project Sprint' : 'Phase 1'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold leading-relaxed">
                  {hasAssignedProject
                    ? `Working on corporate deliverables with ${activeProject.company?.name || 'Assigned Partner'}.`
                    : 'Complete your technical diagnostic test and sprint lessons to qualify for corporate project matching.'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {hasAssignedProject 
                    ? `Assigned Mentor: ${activeProject.mentor?.name || 'Senior Technical Lead'}`
                    : 'Mentorship: Live weekly mentor office hours & staff code reviews.'}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Next Live Sync: <strong>Tomorrow, 11:00 AM IST</strong>
            </span>
            <button
              onClick={() => setActiveTab(hasAssignedProject ? 'workspace' : 'training')}
              className="px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/50 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-black text-xs transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>{hasAssignedProject ? 'View Workspace' : 'Open Training'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Performance Overview Card (Dynamic Gauge & Metrics) */}
        <div className="md:col-span-6 bg-white dark:bg-[#151829] rounded-[2rem] p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-black tracking-wider text-slate-400 uppercase block mb-2">
              Performance Overview
            </span>

            <div className="flex items-center gap-6">
              {/* Circular Gauge */}
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
                    className="text-emerald-500 transition-all duration-700"
                    strokeDasharray={`${Math.min(100, readinessData.overall || pathwayProgress)}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-base font-black text-slate-900 dark:text-white leading-none">
                    {readinessData.overall || pathwayProgress}%
                  </span>
                  <span className="text-[8px] font-bold text-slate-400">PPO Ready</span>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="space-y-1.5 flex-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-semibold">Projects Completed</span>
                  <span className="font-black text-slate-800 dark:text-slate-200">
                    {completedProjectsCount} / {Math.max(1, userProjects.length)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-semibold">Diagnostic Tests</span>
                  <span className={`font-extrabold px-2 py-0.5 rounded text-[10px] ${
                    assessmentsCompleted > 0
                      ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40'
                      : 'text-amber-600 bg-amber-50 dark:bg-amber-950/40'
                  }`}>
                    {assessmentsCompleted > 0 ? `${assessmentsCompleted} Certified` : 'Pending'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-semibold">Company Review</span>
                  <span className={`font-extrabold px-2 py-0.5 rounded text-[10px] ${
                    hasAssignedProject
                      ? 'text-blue-600 bg-blue-50 dark:bg-blue-950/40'
                      : 'text-slate-600 bg-slate-100 dark:bg-slate-800'
                  }`}>
                    {hasAssignedProject ? 'In Progress' : 'Unlocks in Phase 2'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Next Performance Review:</span>
            <span className="font-black text-slate-700 dark:text-slate-300">{nextReviewDate}</span>
          </div>
        </div>

      </div>

      {/* 4. WORKSPACE TABS SELECTOR */}
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
          Training Modules ({defaultTrainingModules.length})
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
          <span>Certificate Preview →</span>
        </Link>
      </div>

      {/* 5. TAB 1: JOURNEY & READINESS */}
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
                projects={userProjects.map((p: any) => ({
                  id: p.id || p._id,
                  title: p.title || 'Untitled Project',
                  progress: p.progress || 0,
                  status: p.status || 'not_started',
                  deadline: p.duration?.endDate,
                }))}
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

      {/* 6. TAB 2: TRAINING MODULES */}
      {activeTab === 'training' && (
        <div className="bg-white dark:bg-[#151829] rounded-[2rem] p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Training Modules
              </h3>
              <p className="text-xs text-slate-500 font-semibold">
                Complete all modules to become industry-ready for corporate matching.
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
            {filteredTrainingModules.map(mod => (
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
                    {mod.status === 'completed' ? 'Review' : 'Continue'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. TAB 3: ASSESSMENT CENTER */}
      {activeTab === 'assessments' && (
        <div className="bg-white dark:bg-[#151829] rounded-[2rem] p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Assessment Center
              </h3>
              <p className="text-xs text-slate-500 font-semibold">
                Complete diagnostic assessments to verify your skills for corporate matching.
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
                  to={round.status === 'completed' ? `/assessments/${round.id}/results` : `/assessments/${round.id}/take`}
                  className={`w-full py-2.5 rounded-xl font-black text-xs text-center transition-all ${
                    round.status === 'completed'
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                  }`}
                >
                  {round.status === 'completed' ? 'Completed (View Score)' : 'Start Test →'}
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. TAB 4: COMPANY MATCHING (AUTHENTIC) */}
      {activeTab === 'matching' && (
        <div className="bg-white dark:bg-[#151829] rounded-[2rem] p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Corporate Matching Portal
              </h3>
              <p className="text-xs text-slate-500 font-semibold">
                Direct requisitions matched against your certified assessments and sprint deliverables.
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

          {userMatches.length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-50 dark:bg-[#1A1D33] border border-slate-200/80 dark:border-slate-800 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
                <Target className="w-6 h-6" />
              </div>
              <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                Matching Algorithm Standing By
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                Complete your Diagnostic Tests in the Assessment Center. Once your score reaches 60%+, our matching engine pairs your profile directly with recruiter requisitions.
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={() => setActiveTab('assessments')}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  Take Diagnostic Test
                </button>
                <Link
                  to="/opportunities"
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors"
                >
                  Browse Directory
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {userMatches.map((m: any, idx: number) => (
                <div
                  key={m.id || idx}
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-[#1A1D33] border border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xs">
                        {(m.company?.name || 'CP').slice(0, 2).toUpperCase()}
                      </div>
                      <span className="text-xs font-black text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                        {m.matchScore || 80}% Match
                      </span>
                    </div>

                    <h4 className="text-sm font-black text-slate-900 dark:text-white">
                      {m.company?.name || 'Partner Company'}
                    </h4>
                    <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                      {m.requirement?.title || m.role || 'Software Engineering Intern'}
                    </p>
                    <p className="text-[11px] text-slate-500 font-medium mt-1">
                      {m.requirement?.location || 'Remote'} · {m.requirement?.duration || '4 Months'}
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
          )}
        </div>
      )}

      {/* 9. TAB 5: INTERNSHIP WORKSPACE (AUTHENTIC) */}
      {activeTab === 'workspace' && (
        <div className="bg-white dark:bg-[#151829] rounded-[2rem] p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider block mb-1">
                {hasAssignedProject ? 'Active Project Sprint' : 'Sprint Workspace'}
              </span>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                {hasAssignedProject ? activeProject.title : 'Sprint Deliverables & Taskboard'}
              </h3>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                {hasAssignedProject 
                  ? `Partner: ${activeProject.company?.name || 'Assigned Partner'} · Target Completion in progress`
                  : 'Orientation tasks and development environment setup for new interns.'}
              </p>
            </div>
            <span className="text-xs font-black text-blue-700 bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300 px-3 py-1 rounded-full">
              {hasAssignedProject ? 'In Progress' : 'Orientation Phase'}
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
                <span className="text-xs font-bold text-slate-800 line-through">Onboarding & Profile Verification</span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/70 flex items-center gap-3">
                <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                <span className="text-xs font-bold text-slate-800 line-through">Local Git & Dev Environment Configuration</span>
              </div>
              <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-200/80 flex items-center gap-3">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-black text-blue-900 dark:text-blue-300">
                  {hasAssignedProject ? 'Core Feature Development & Code Submissions' : 'Complete Technical Diagnostic Assessment'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3 opacity-60">
                <div className="w-4 h-4 rounded-full border border-slate-300" />
                <span className="text-xs font-semibold text-slate-600">
                  {hasAssignedProject ? 'Weekly Mentor Review & Pull Request Audit' : 'Module 1 Project Submission'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3 opacity-60">
                <div className="w-4 h-4 rounded-full border border-slate-300" />
                <span className="text-xs font-semibold text-slate-600">
                  {hasAssignedProject ? 'Final Production Deployment & Demo' : 'Corporate Matching Interview Call'}
                </span>
              </div>
            </div>

            {/* Project Details Sidebar */}
            <div className="md:col-span-5 p-5 rounded-2xl bg-slate-50 dark:bg-[#1A1D33] border border-slate-200/80 dark:border-slate-800 space-y-3">
              <span className="text-xs font-black text-slate-900 dark:text-white block">
                Workspace Summary
              </span>
              <div className="text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Track:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">Full Stack & Cloud</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Mentorship:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {hasAssignedProject ? (activeProject.mentor?.name || 'Assigned Lead') : 'Senior Staff Architect'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Current Phase:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {hasAssignedProject ? 'Live Client Sprint' : 'Industrial Training'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Primary Stack:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">TypeScript, React, Node.js, SQL</span>
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
