import React, { useState } from 'react';
import { useAuth } from '../../../api/hooks/use-auth';
import { InternshipApplicationModal } from '../../landing/components/internship-application-modal';
import { ProgramDetailsModal } from '../../landing/components/program-details-modal';
import { PROGRAM_CONFIGS, PROGRAM_DISCLAIMER, ProgramTypeKey } from '@interhive/shared';
import {
  Sparkles,
  GraduationCap,
  Award,
  Briefcase,
  CheckCircle2,
  Lock,
  ArrowRight,
  FileText,
  Users,
  Target,
  ChevronRight,
  BookOpen,
  TrendingUp,
  Clock,
  ShieldCheck,
  HelpCircle,
  Zap,
  Download,
  ExternalLink,
  Star,
  Building2,
  Check,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export const FreeStudentDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [selectedProgramTypeForModal, setSelectedProgramTypeForModal] = useState<string | undefined>(undefined);
  const [activeDetailsProgramType, setActiveDetailsProgramType] = useState<ProgramTypeKey | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Check local storage for application submission state
  const hasAppliedLocal = typeof window !== 'undefined' ? localStorage.getItem('hasAppliedPpo') === 'true' : false;
  const [hasApplied, setHasApplied] = useState(hasAppliedLocal);

  const studentName = user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Student';
  const studentEmail = user?.email || 'student@interhive.in';

  const handleOpenApplicationModal = () => {
    setIsModalOpen(true);
  };

  const handleApplicationSuccess = () => {
    setHasApplied(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('hasAppliedPpo', 'true');
    }
  };

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const ppoHighlights = [
    {
      icon: Briefcase,
      title: 'Real Corporate Projects',
      description: 'Work on live microservices, AI pipelines, and web applications for real tech partners.',
      badge: '100% Practical',
    },
    {
      icon: Users,
      title: '1-on-1 Staff Mentorship',
      description: 'Weekly code reviews and direct guidance from senior software engineers and architects.',
      badge: 'Dedicated Mentor',
    },
    {
      icon: Building2,
      title: '50+ Hiring Partners',
      description: 'Direct placement referrals to TechCorp, CloudWave, Nexus FinTech, and 50+ corporate partners.',
      badge: 'Guaranteed Matching',
    },
    {
      icon: TrendingUp,
      title: 'Stipends & Performance Perks',
      description: 'Earn competitive monthly stipends based on milestone achievements and code contributions.',
      badge: 'Paid Program',
    },
  ];

  const lockedFeatures = [
    {
      title: 'Live Engineering Workspace',
      category: 'Projects & Tasks',
      description: 'Submit pull requests, access Jira-style sprint task boards, and join live daily standups.',
      icon: Briefcase,
    },
    {
      title: 'Industry Sprint Modules',
      category: 'Hands-on Training',
      description: 'Structured 45-day technical sprint tracks in Full Stack, Cloud, DevOps, and Data Engineering.',
      icon: BookOpen,
    },
    {
      title: 'Skill Readiness Score & AI Analysis',
      category: 'Assessments',
      description: 'Real-time corporate readiness scoring with benchmark radars and personalized skill fixes.',
      icon: TrendingUp,
    },
    {
      title: 'Partner Company Matching Portal',
      category: 'Corporate Hiring',
      description: 'AI matching engine connecting your profile directly to active recruiter requisitions.',
      icon: Target,
    },
    {
      title: 'Verified Certificate & LOR',
      category: 'Credentials',
      description: 'QR-verifiable corporate completion certificate and signed Letter of Recommendation.',
      icon: Award,
    },
  ];

  const faqs = [
    {
      q: 'What is the InterHive PPO (Pre-Placement Offer) Program?',
      a: 'The InterHive PPO Program is an intensive, career-oriented corporate training and internship track designed to bridge the gap between academic education and industry hiring standards. Selected students work on live production codebases with 1-on-1 mentorship, earn stipends, and get directly interviewed for full-time job offers at our 50+ partner companies.',
    },
    {
      q: 'How do I get selected for the PPO Program?',
      a: 'To get selected into the PPO Program, you must submit the official Internship Application Form (via the button above) with your academic details, branch, degree, resume, and statement of intent. Once submitted, our HR team screens your profile and schedules a 1-on-1 technical and behavioral interview.',
    },
    {
      q: 'Is this free student dashboard permanent?',
      a: 'Yes! Your free account allows you to stay connected with InterHive, access public masterclasses, receive placement updates, and apply or re-apply for the PPO Program anytime.',
    },
    {
      q: 'What happens after I submit my application form?',
      a: 'Our HR team evaluates applications within 24-48 hours. Eligible candidates will receive an email notification with an interview slot confirmation. Upon clearing the interview, your account will be upgraded to full PPO Intern status.',
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Welcome & Account Status Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-2xl border border-indigo-500/20">
        {/* Glowing background circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              <span>InterHive Student Network • Free Access Tier</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-200 to-pink-300">{studentName}</span> 👋
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              You are currently logged into the <strong className="text-white font-semibold">InterHive Free Student Dashboard</strong>. 
              Explore our flaghip <strong className="text-indigo-300">Corporate PPO Program</strong> below and take the first step towards your dream tech career!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-end gap-3 shrink-0">
            <button
              onClick={handleOpenApplicationModal}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <GraduationCap className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span>{hasApplied ? 'Submit Another Application' : 'Apply for PPO Program Now'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <div className="text-xs text-slate-400 text-center md:text-right">
              Registered Email: <span className="text-slate-200 font-mono">{studentEmail}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Application Status Tracker Box */}
      <div className="rounded-2xl bg-white dark:bg-[#121526] border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
              hasApplied 
                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20' 
                : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20'
            }`}>
              {hasApplied ? <Clock className="w-6 h-6 animate-spin-slow" /> : <FileText className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-base">PPO Program Selection Status</h3>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  hasApplied
                    ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700'
                }`}>
                  {hasApplied ? 'Application Under HR Review' : 'Not Applied Yet'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                {hasApplied
                  ? 'Your application form has been received! Our HR team is screening your profile for interview scheduling.'
                  : 'To unlock full PPO intern privileges (live projects, stipends, corporate certificates), you must complete the application form and clear the interview.'}
              </p>
            </div>
          </div>

          <button
            onClick={handleOpenApplicationModal}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
              hasApplied
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20'
            }`}
          >
            <span>{hasApplied ? 'View / Update Details' : 'Start Application'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2.5. Industry-Readiness Programs (1, 2, 3 & 4 Year) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>InterHive Industry-Readiness Programs</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Select your academic program level to build company readiness, industrial training, and placement opportunities.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {(Object.values(PROGRAM_CONFIGS) as any[]).map((prog) => (
            <div
              key={prog.id}
              className="rounded-2xl bg-white dark:bg-[#121526] border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between hover:border-indigo-300 dark:hover:border-indigo-700 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60">
                    {prog.badge}
                  </span>
                  <span className="text-[11px] text-slate-400 font-semibold">{prog.duration}</span>
                </div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-lg mb-1">{prog.title}</h3>
                <p className="text-[11.5px] font-bold text-purple-600 dark:text-purple-400 mb-2">
                  Target: {prog.targetAcademicYear}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                  {prog.shortDescription}
                </p>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 mb-4">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Roadmap Milestone</span>
                  <span className="text-[11.5px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    {prog.summaryTarget}
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setActiveDetailsProgramType(prog.id as ProgramTypeKey);
                    setIsDetailsModalOpen(true);
                  }}
                  className="w-full py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>View Roadmap</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedProgramTypeForModal(prog.id);
                    setIsModalOpen(true);
                  }}
                  className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md shadow-indigo-600/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Enroll in Program</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-[12px] text-slate-500 dark:text-slate-400 font-medium text-center">
          {PROGRAM_DISCLAIMER}
        </div>
      </div>

      {/* 3. The PPO Program Selection Journey (2-Step Process) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>How To Get Selected for the PPO Program</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Follow our official 2-step candidate onboarding process to join the elite PPO track.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Step 1 */}
          <div className="relative rounded-2xl bg-white dark:bg-[#121526] border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs transition-all hover:border-indigo-300 dark:hover:border-indigo-700">
            <div className="flex items-center justify-between mb-4">
              <span className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 font-extrabold text-sm flex items-center justify-center">
                01
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-md border border-indigo-200/50 dark:border-indigo-800/50">
                Step 1: Application
              </span>
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">Fill Application Form</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
              Submit your academic details, branch, semester, degree, PIN code, and your response to our screening question.
            </p>
            <button
              onClick={handleOpenApplicationModal}
              className="w-full py-2 px-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/80 text-indigo-600 dark:text-indigo-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>{hasApplied ? 'Submitted' : 'Fill Form Now'}</span>
              {hasApplied ? <Check className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Step 2 */}
          <div className="relative rounded-2xl bg-white dark:bg-[#121526] border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs transition-all hover:border-purple-300 dark:hover:border-purple-700">
            <div className="flex items-center justify-between mb-4">
              <span className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 font-extrabold text-sm flex items-center justify-center">
                02
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2.5 py-1 rounded-md border border-purple-200/50 dark:border-purple-800/50">
                Step 2: Interview
              </span>
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">HR & Tech Interview</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
              Clear a 1-on-1 interview session with InterHive HR & technical evaluators to verify your technical background.
            </p>
            <div className="w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 font-semibold text-xs flex items-center justify-center gap-1.5">
              <span>{hasApplied ? 'Waiting for Schedule' : 'Requires Step 1'}</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative rounded-2xl bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-950 text-white p-5 shadow-md border border-indigo-500/30">
            <div className="flex items-center justify-between mb-4">
              <span className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 font-extrabold text-sm flex items-center justify-center border border-emerald-500/30">
                03
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/30">
                Selection & Onboarding
              </span>
            </div>
            <h3 className="font-bold text-white text-base mb-1">Unlock PPO Intern Dashboard</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Get assigned to live client projects, receive 1-on-1 mentor guidance, earn stipends, and unlock direct hiring referrals!
            </p>
            <div className="w-full py-2 px-3 rounded-xl bg-emerald-500/20 text-emerald-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Full Dashboard Access</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. What the PPO Program Offers */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500" />
            <span>Why Join the InterHive PPO Program?</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Designed to transform promising students into industry-ready software engineers and product leaders.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ppoHighlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white dark:bg-[#121526] border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs hover:shadow-md transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-full border border-indigo-200/50 dark:border-indigo-800/50">
                    {item.badge}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">{item.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Teaser Grid of Locked PPO Features */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Locked Features (Available Upon PPO Selection)</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              The full intern workspace below will be unlocked once you clear the interview round.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lockedFeatures.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="relative overflow-hidden rounded-2xl bg-white dark:bg-[#121526] border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs group"
              >
                {/* Lock Overlay Badge */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[11px] font-bold border border-slate-200 dark:border-slate-700">
                  <Lock className="w-3 h-3 text-amber-500" />
                  <span>PPO Exclusive</span>
                </div>

                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5" />
                </div>

                <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block mb-1">
                  {feat.category}
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">{feat.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Free Resources & Masterclass Access */}
      <div className="rounded-3xl bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/30 dark:via-purple-950/20 dark:to-slate-900 border border-indigo-100 dark:border-indigo-900/50 p-6 sm:p-8">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-600 text-white text-xs font-bold">
            <GiftIcon className="w-3.5 h-3.5" />
            <span>Included With Free Access</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Free Student Career Resources & Preparation
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            While you prepare for your PPO interview, explore our free learning guides, resume templates, and upcoming corporate webinars.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-4 rounded-2xl bg-white dark:bg-[#121526] border border-indigo-100 dark:border-slate-800 space-y-1">
              <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Tech Resume Guide</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Download proven developer resume formats.</p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-[#121526] border border-indigo-100 dark:border-slate-800 space-y-1">
              <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Weekly Masterclass</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Live Q&A with tech leads & senior managers.</p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-[#121526] border border-indigo-100 dark:border-slate-800 space-y-1">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Interview Prep Kit</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Top 50 Data Structure & React questions.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 7. FAQ Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Frequently Asked Questions</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Everything you need to know about candidate registration and the PPO Program.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-white dark:bg-[#121526] border border-slate-200/80 dark:border-slate-800 overflow-hidden transition-colors"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full p-4 sm:p-5 text-left font-bold text-slate-900 dark:text-white text-sm sm:text-base flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50"
              >
                <span>{faq.q}</span>
                <ChevronRight
                  className={`w-5 h-5 text-slate-400 shrink-0 transition-transform ${
                    activeFaq === idx ? 'rotate-90 text-indigo-600' : ''
                  }`}
                />
              </button>
              {activeFaq === idx && (
                <div className="px-4 pb-5 sm:px-5 sm:pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 8. Bottom Sticky / Final CTA Banner */}
      <div className="rounded-3xl bg-indigo-600 text-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-xl font-extrabold">Ready to start your corporate journey?</h3>
          <p className="text-indigo-100 text-xs sm:text-sm">
            Fill out the application form today and take your HR screening interview.
          </p>
        </div>
        <button
          onClick={handleOpenApplicationModal}
          className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-indigo-600 font-extrabold text-sm shadow-lg transition-all shrink-0 flex items-center gap-2 cursor-pointer"
        >
          <span>{hasApplied ? 'Update PPO Application' : 'Apply for PPO Program'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Application Modal Popup */}
      <InternshipApplicationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          handleApplicationSuccess();
        }}
        preselectedProgramType={selectedProgramTypeForModal}
      />

      {/* Program Details Modal */}
      <ProgramDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        programType={activeDetailsProgramType}
        onEnroll={(progType) => {
          setSelectedProgramTypeForModal(progType);
          setIsModalOpen(true);
        }}
      />
    </div>
  );
};

function GiftIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <path d="M12 8v13" />
      <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
      <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 4.8 0 0 1 12 8a4.8 4.8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
    </svg>
  );
}
