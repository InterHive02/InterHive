import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ArrowRight,
  Play,
  Building2,
  Briefcase,
  Users,
  Star,
  GraduationCap,
  TrendingUp,
  Code,
  Sparkles,
  MapPin,
  IndianRupee,
  Wallet,
  Mail,
  CheckCircle2,
  X,
  Menu,
  ExternalLink,
  Award,
  Layers,
  BookOpen,
  ChevronDown,
  UserPlus,
  Trophy,
  Bell,
  UserCheck,
  Check,
  Target,
  Quote,
  ShieldCheck,
  Terminal,
  Clock,
  Calculator,
  Zap,
  ArrowUpRight,
  Code2
} from 'lucide-react';
import { companyApi } from '../../../api/endpoints/company.api';
import { statsApi, LandingStatItem } from '../../../api/endpoints/stats.api';
import { contentApi, PartnerItem, TestimonialItem } from '../../../api/endpoints/content.api';
import { Logo } from '../../../shared/components/common/logo';
import { getLandingStats, LandingStats } from '../../../shared/utils/landing-stats';
import { InternshipApplicationModal } from '../components/internship-application-modal';
import { ProgramDetailsModal } from '../components/program-details-modal';
import { PublicNavbar } from '../components/public-navbar';
import { PublicFooter } from '../components/public-footer';
import { CompanyInquiryModal } from '../components/company-inquiry-modal';
import { VideoModal } from '../components/video-modal';
import { PlacementTimelineCalculator } from '../components/placement-timeline-calculator';
import { QuickReadinessQuizModal } from '../components/quick-readiness-quiz-modal';
import { HiveIntroSplash } from '../components/hive-intro-splash';
import { landingCmsApi } from '../../../api/endpoints/landing-cms.api';
import {
  PROGRAM_CONFIGS,
  PROGRAM_DISCLAIMER,
  ProgramTypeKey,
  LandingPageConfig,
  DEFAULT_LANDING_CMS_CONFIG,
} from '@interhive/shared';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [cmsConfig, setCmsConfig] = useState<LandingPageConfig>(DEFAULT_LANDING_CMS_CONFIG);

  // Load CMS configuration (draft preview or published)
  useEffect(() => {
    const loadCmsConfig = async () => {
      try {
        const searchParams = new URLSearchParams(window.location.search);
        const isDraftPreview = searchParams.get('preview') === 'draft';
        const res = isDraftPreview
          ? await landingCmsApi.getDraftConfig()
          : await landingCmsApi.getPublicConfig();
        if (res.data?.success && res.data?.data) {
          setCmsConfig(res.data.data);
        }
      } catch (err) {
        console.warn('Could not load landing CMS config, falling back to defaults.', err);
      }
    };
    loadCmsConfig();
  }, []);

  // Update SEO Meta
  useEffect(() => {
    if (cmsConfig?.seo?.metaTitle) {
      document.title = cmsConfig.seo.metaTitle;
    } else {
      document.title = 'InterHive | Industry-Readiness & Talent Connect Platform';
    }
    if (cmsConfig?.seo?.metaDescription) {
      let descMeta = document.querySelector('meta[name="description"]');
      if (!descMeta) {
        descMeta = document.createElement('meta');
        descMeta.setAttribute('name', 'description');
        document.head.appendChild(descMeta);
      }
      descMeta.setAttribute('content', cmsConfig.seo.metaDescription);
    }
  }, [cmsConfig?.seo]);

  const isSectionVisible = (sectionId: string): boolean => {
    const s = cmsConfig?.sectionsMeta?.find((item) => item.id === sectionId);
    return s ? s.isVisible : true;
  };

  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [liveRequirements, setLiveRequirements] = useState<any[]>([]);
  const [isInternshipModalOpen, setIsInternshipModalOpen] = useState(false);
  const [selectedProgramCategory, setSelectedProgramCategory] = useState('Software Engineering');
  const [selectedProgramTypeForModal, setSelectedProgramTypeForModal] = useState<string | undefined>(undefined);
  const [activeDetailsProgramType, setActiveDetailsProgramType] = useState<ProgramTypeKey | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [selectedYearFilter, setSelectedYearFilter] = useState<string>('ALL');
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [showStickyCta, setShowStickyCta] = useState(false);
  const [showIntroSplash, setShowIntroSplash] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('nointro') === 'true') return false;
      if (params.get('intro') === 'true') return true;
      return sessionStorage.getItem('interhive_intro_shown') !== 'true';
    }
    return true;
  });

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Newsletter State
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [newsletterLoading, setNewsletterLoading] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterLoading(true);
    try {
      companyApi.submitInquiry({
        companyName: `Newsletter Subscriber: ${newsletterEmail}`,
        contactPerson: 'Early Access Subscriber',
        email: newsletterEmail,
        phone: '',
        message: 'Subscribed to InterHive early access notifications on homepage.',
      }).catch(() => {});
    } catch (e) {}
    setTimeout(() => {
      setNewsletterLoading(false);
      setNewsletterSubscribed(true);
    }, 400);
  };

  // Sticky CTA scroll watcher
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 480) {
        setShowStickyCta(true);
      } else {
        setShowStickyCta(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Dynamic Content from Database
  const [publicPartners, setPublicPartners] = useState<PartnerItem[]>([]);
  const [publicTestimonials, setPublicTestimonials] = useState<TestimonialItem[]>([]);
  const [dynamicLandingStats, setDynamicLandingStats] = useState<LandingStatItem[]>([]);

  // Interactive Track Showcases for Hero Preview
  const trackShowcases = [
    {
      id: 'fullstack',
      trackName: 'PPO Track — Full Stack Engineering',
      curriculum: 'Node.js, React, Microservices & PostgreSQL',
      badgeColor: 'bg-blue-600',
      badgeInitial: 'FS',
      progress: 94,
      activeStep: 5,
      currentStage: 'Corporate Matching Sprint',
      currentStageDesc: '2-Month InterHive sprint completed; ready for 6-Month corporate internship & PPO.',
      modules: '12/12',
      projects: '5/5',
      tests: '8/8',
      stipend: '₹30,000 - ₹45,000 / mo',
      ppoTarget: '₹8 - ₹14 LPA Target'
    },
    {
      id: 'cloud',
      trackName: 'Cloud & DevOps Engineering Track',
      curriculum: 'Docker, Kubernetes, AWS & CI/CD Pipelines',
      badgeColor: 'bg-purple-600',
      badgeInitial: 'CD',
      progress: 92,
      activeStep: 6,
      currentStage: 'Production Internship Sprint',
      currentStageDesc: 'Deploying automated infrastructure with mentor code reviews.',
      modules: '10/10',
      projects: '4/4',
      tests: '10/10',
      stipend: '₹30,000 - ₹40,000 / mo',
      ppoTarget: '₹9 - ₹13 LPA Target'
    },
    {
      id: 'aids',
      trackName: 'Applied AI & Data Science Track',
      curriculum: 'Python, PyTorch, FastAPIs & Vector DBs',
      badgeColor: 'bg-emerald-600',
      badgeInitial: 'AI',
      progress: 96,
      activeStep: 7,
      currentStage: 'PPO Transition & Placement',
      currentStageDesc: 'Capstone model submitted; preparing for full-time offer onboarding.',
      modules: '14/14',
      projects: '6/6',
      tests: '12/12',
      stipend: '₹35,000 - ₹50,000 / mo',
      ppoTarget: '₹10 - ₹16 LPA Target'
    }
  ];

  const currentShowcases = (cmsConfig?.hero?.showcases && cmsConfig.hero.showcases.length > 0)
    ? cmsConfig.hero.showcases
    : trackShowcases;

  const [activeTrackIndex, setActiveTrackIndex] = useState(0);
  const currentTrack: any = currentShowcases[activeTrackIndex] || currentShowcases[0] || trackShowcases[0];

  useEffect(() => {
    const trackTimer = setInterval(() => {
      setActiveTrackIndex((prev) => (prev + 1) % currentShowcases.length);
    }, 6000);
    return () => clearInterval(trackTimer);
  }, [currentShowcases.length]);

  // FAQs
  const defaultFaqs = [
    {
      question: 'What makes InterHive fundamentally different from job boards and course websites?',
      answer: 'Job boards flood companies with unverified PDF resumes, while course platforms sell generic video certificates. InterHive is an Industry-Readiness Platform: we train students in real agile sprints, review their actual GitHub pull requests, track attendance, and introduce verified candidates directly to partner companies.',
    },
    {
      question: 'Is InterHive free for students to get started?',
      answer: 'Yes! Creating your account, taking our diagnostic readiness assessment, and applying for cohorts is completely free for students. We are committed to making industry readiness accessible to all motivated learners.',
    },
    {
      question: 'How do the 5 Major Programs work with college academic schedules?',
      answer: 'Every program (1-Year, 2-Year, 3-Year, 4-Year, and PPO Track) is aligned with your specific academic year. Sprints are designed for student schedules with flexible hours and exam-pause options, ensuring zero conflict with semester exams.',
    },
    {
      question: 'How does InterHive help hiring companies and engineering teams?',
      answer: 'Companies receive pre-screened candidates benchmarked on production code quality, Git branching, and problem-solving. This eliminates 70% of senior developer screening time and provides day-1 productive interns without costly ramp-up lag.',
    },
    {
      question: 'Can students from non-Computer Science streams apply?',
      answer: 'Yes! Practical engineering ability and problem-solving matter far more than branch names. Our programs have trained successful developers from Mechanical, Electrical, and Electronics streams.',
    },
  ];

  const activeFaqItems = (cmsConfig?.faq?.items && cmsConfig.faq.items.length > 0)
    ? cmsConfig.faq.items
    : defaultFaqs;

  // Fetch live stats & data
  useEffect(() => {
    const fetchLandingData = async () => {
      try {
        const statsRes = await statsApi.getLandingStats();
        if (statsRes.data?.success && statsRes.data?.data) {
          setDynamicLandingStats(statsRes.data.data);
        }

        const [partnersRes, testimonialsRes] = await Promise.allSettled([
          contentApi.getPublicPartners(),
          contentApi.getPublicTestimonials()
        ]);

        if (partnersRes.status === 'fulfilled' && partnersRes.value?.data?.data) {
          setPublicPartners(partnersRes.value.data.data);
        }
        if (testimonialsRes.status === 'fulfilled' && testimonialsRes.value?.data?.data) {
          setPublicTestimonials(testimonialsRes.value.data.data);
        }

        const compRes = await companyApi.getAll({ page: 1, limit: 6 });
        if (compRes.data?.data && compRes.data.data.length > 0) {
          const reqs: any[] = [];
          for (const comp of compRes.data.data) {
            if ((comp as any)._id) {
              const compReqs = await companyApi.getRequirements((comp as any)._id, 'published');
              if (compReqs.data && compReqs.data.length > 0) {
                compReqs.data.forEach((r: any) => {
                  reqs.push({
                    ...r,
                    companyName: comp.companyInfo?.name || 'Partner Company',
                    companyLogo: comp.companyInfo?.logo,
                  });
                });
              }
            }
          }
          if (reqs.length > 0) {
            setLiveRequirements(reqs);
          }
        }
      } catch (err) {
        // Fallback gracefully
      }
    };
    fetchLandingData();
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleEnrollClick = (progId: string) => {
    setSelectedProgramTypeForModal(progId);
    setIsInternshipModalOpen(true);
  };

  const handleRoadmapClick = (progId: string) => {
    setActiveDetailsProgramType(progId as ProgramTypeKey);
    setIsDetailsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans antialiased text-slate-800 selection:bg-blue-600 selection:text-white overflow-x-hidden">
      {/* 3D Kinetic Honeycomb Hive Intro Splash Animation (Plays on site visit) */}
      {showIntroSplash && (
        <HiveIntroSplash
          introDuration={2.0}
          totalDuration={3.4}
          onComplete={() => {
            setShowIntroSplash(false);
            try {
              sessionStorage.setItem('interhive_intro_shown', 'true');
            } catch (e) {
              // ignore
            }
          }}
        />
      )}

      {/* Header Navigation */}
      <PublicNavbar
        activePage="home"
        onOpenInternshipModal={() => setIsInternshipModalOpen(true)}
        onOpenCompanyModal={() => setIsCompanyModalOpen(true)}
      />

      <main>
        {/* ============================================================ */}
        {/* 1. EXECUTIVE HERO SECTION                                     */}
        {/* ============================================================ */}
        {isSectionVisible('hero') && (
          <section className="relative pt-8 pb-20 md:pt-14 md:pb-28 overflow-hidden bg-gradient-to-b from-[#F0F5FF] via-[#F8FAFC] to-[#F8FAFC]">
            {/* Background Glow Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-blue-400/10 via-indigo-400/10 to-teal-400/5 blur-3xl pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
                
                {/* Left Column: Visionary Narrative & CTAs */}
                <div className="lg:col-span-7 text-center lg:text-left space-y-6">
                  {/* Category Pill & 3D Intro Replay */}
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/90 border border-blue-200 text-blue-800 text-xs sm:text-sm font-semibold shadow-xs">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                      <span>India’s Industry-Readiness & Talent Connect Platform</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowIntroSplash(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100/80 hover:bg-amber-200/90 text-amber-900 border border-amber-300/80 text-xs font-bold shadow-xs transition-all duration-150 cursor-pointer hover:scale-105"
                      title="Replay 3D Hive Intro Animation"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                      <span>Watch 3D Intro</span>
                    </button>
                  </div>

                  {/* Headline */}
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
                    {cmsConfig.hero?.headlineMain || 'Transforming Academic Learning into'}{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                      {cmsConfig.hero?.headlineGradient || 'Production-Ready Engineering.'}
                    </span>
                  </h1>

                  {/* Supporting Pitch */}
                  <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                    {cmsConfig.hero?.description ||
                      'InterHive bridges the gap between university curriculum and company expectations through structured 1-to-4 year programs, live agile sprints, verified GitHub repos, and direct corporate talent matching.'}
                  </p>

                  {/* Dual Action CTAs */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
                    <button
                      onClick={() => scrollToSection('our-programs')}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-lg shadow-blue-600/25 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
                    >
                      <Layers className="w-4 h-4" />
                      <span>Explore the 5 Major Programs</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </button>
                    <Link
                      to="/for-companies"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm border border-slate-200 shadow-xs transition"
                    >
                      <Building2 className="w-4 h-4 text-slate-500" />
                      <span>For Companies & Recruiter ROI</span>
                    </Link>
                  </div>

                  {/* Micro Trust Indicators */}
                  <div className="pt-2 flex items-center justify-center lg:justify-start gap-4 text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Zero Cost Initial Assessment
                    </span>
                    <span className="text-slate-300">&bull;</span>
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-blue-600" />
                      Verified GitHub PR Portfolios
                    </span>
                  </div>

                  {/* Key Metrics Strip */}
                  <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-200/80 max-w-xl mx-auto lg:mx-0 text-center lg:text-left">
                    <div>
                      <p className="text-2xl font-black text-slate-900">5 Programs</p>
                      <p className="text-[11px] text-slate-500 font-semibold mt-0.5">1-Yr to PPO Track</p>
                    </div>
                    <div>
                      <p className="text-2xl font-black text-blue-600">97.8%</p>
                      <p className="text-[11px] text-slate-500 font-semibold mt-0.5">Attendance Compliance</p>
                    </div>
                    <div>
                      <p className="text-2xl font-black text-indigo-600">3–7 Days</p>
                      <p className="text-[11px] text-slate-500 font-semibold mt-0.5">Match Velocity</p>
                    </div>
                    <div>
                      <p className="text-2xl font-black text-emerald-600">100%</p>
                      <p className="text-[11px] text-slate-500 font-semibold mt-0.5">Practical Codebases</p>
                    </div>
                  </div>
                </div>

                {/* Right Column: Live Candidate Dossier & Terminal Preview */}
                <div className="lg:col-span-5 relative">
                  <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl blur-xl opacity-20 transition duration-1000"></div>

                  <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/90 shadow-2xl p-6 space-y-5">
                    {/* Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                          IH
                        </div>
                        <div>
                          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                            Live Candidate Dossier
                          </h3>
                          <p className="text-[11px] text-slate-500">Benchmark & Performance Verification</p>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Placement Ready
                      </span>
                    </div>

                    {/* Interactive Track Switcher Pills */}
                    <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl text-xs">
                      {currentShowcases.map((track: any, idx: number) => (
                        <button
                          key={track.id || idx}
                          onClick={() => setActiveTrackIndex(idx)}
                          className={`flex-1 py-1.5 px-2 rounded-lg font-semibold text-center transition-all cursor-pointer ${
                            activeTrackIndex === idx
                              ? 'bg-white text-blue-700 shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          {track.badgeInitial || 'T'} Track
                        </button>
                      ))}
                    </div>

                    {/* Candidate Benchmark Card */}
                    <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">
                            {currentTrack.trackName}
                          </h4>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {currentTrack.curriculum}
                          </p>
                        </div>
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-black">
                          {currentTrack.progress || 94}% Ready
                        </span>
                      </div>

                      {/* Micro Metric Gauges */}
                      <div className="grid grid-cols-3 gap-2 pt-1 text-center text-xs">
                        <div className="p-2 rounded-lg bg-white border border-slate-200">
                          <p className="font-black text-slate-900">{currentTrack.projects || '5/5'} Projects</p>
                          <p className="text-[10px] text-slate-400">Verified Code</p>
                        </div>
                        <div className="p-2 rounded-lg bg-white border border-slate-200">
                          <p className="font-black text-blue-600">{currentTrack.tests || '8/8'} Tests</p>
                          <p className="text-[10px] text-slate-400">Unit Tests Passing</p>
                        </div>
                        <div className="p-2 rounded-lg bg-white border border-slate-200">
                          <p className="font-black text-purple-600">{currentTrack.stipend || '₹35k/mo'}</p>
                          <p className="text-[10px] text-slate-400">Target Stipend</p>
                        </div>
                      </div>

                      {/* Current Sprint Activity */}
                      <div className="pt-2 border-t border-slate-200/60 text-xs text-slate-600 space-y-1">
                        <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                          <Terminal className="w-3.5 h-3.5 text-blue-600" />
                          <span>Active Sprint: {currentTrack.currentStage || 'Corporate Matching'}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          {currentTrack.currentStageDesc || 'Auditing production commits and architecture before corporate interview rounds.'}
                        </p>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="pt-1 flex items-center justify-between text-xs">
                      <button
                        onClick={() => {
                          setSelectedProgramTypeForModal('PPO');
                          setIsInternshipModalOpen(true);
                        }}
                        className="text-blue-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>Apply for this Track</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setIsVideoModalOpen(true)}
                        className="text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 text-blue-600" />
                        <span>Watch Platform Tour</span>
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>
        )}

        {/* ============================================================ */}
        {/* 2. THE PARADIGM SHIFT: UNIVERSITY VS INTERHIVE OPERATING MODEL */}
        {/* ============================================================ */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
              The Reality Gap
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Why 90% of College Graduates Struggle to Get Hired
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Indian universities teach theory and textbooks. Modern engineering companies demand production Git repos, clean code, and day-1 velocity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pillar 1 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition space-y-3">
              <div className="p-2.5 rounded-xl bg-rose-50 text-rose-700 text-xs font-bold inline-block border border-rose-100">
                The Academic Flaw
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Syntax Puzzles vs. Production Codebases
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Colleges test students on syntax and textbook loops. Tech companies reject candidates who have never worked with Git branches, Docker containers, or REST/GraphQL APIs.
              </p>
              <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-xs text-blue-700 font-semibold">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>InterHive: Production SaaS sprints & real PRs</span>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition space-y-3">
              <div className="p-2.5 rounded-xl bg-rose-50 text-rose-700 text-xs font-bold inline-block border border-rose-100">
                The Certification Trap
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Paper Certificates vs. Verified GitHub Repos
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Online course platforms sell certificates that hiring managers ignore. Employers demand measurable proof: merged commits, unit tests, and calibrated rubric evaluations.
              </p>
              <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-xs text-blue-700 font-semibold">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>InterHive: Verified public code portfolios & ratings</span>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition space-y-3">
              <div className="p-2.5 rounded-xl bg-rose-50 text-rose-700 text-xs font-bold inline-block border border-rose-100">
                The Recruitment Vacuum
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Endless Job Board Ghosting vs. Direct PPO Tracks
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Students apply to 200+ listings on open job boards and hear nothing back. InterHive places verified students directly before vetted partner companies ready to hire.
              </p>
              <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-xs text-blue-700 font-semibold">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>InterHive: Curated talent matching & PPO pathways</span>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 3. THE 5 FLAGSHIP PROGRAMS SHOWCASE (THE CORE ENGINE)         */}
        {/* ============================================================ */}
        {isSectionVisible('programs') && (
          <section id="our-programs" className="py-16 bg-white border-y border-slate-200/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
              <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold border border-blue-200">
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                  <span>Structured Academic Pathways</span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                  Our Five Flagship Programs
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
                  Every program is calibrated for your specific academic year. Progress seamlessly from software engineering foundations to production internships and full-time PPOs.
                </p>
              </div>

              {/* Year Filter Tabs */}
              <div className="flex items-center justify-center gap-2 flex-wrap mb-10">
                {[
                  { id: 'ALL', label: 'All 5 Programs' },
                  { id: 'FOUR_YEAR', label: '1st Year (Batch 2030)' },
                  { id: 'THREE_YEAR', label: '2nd Year (Batch 2029)' },
                  { id: 'TWO_YEAR', label: '3rd Year (Batch 2028)' },
                  { id: 'ONE_YEAR', label: 'Final Year (Batch 2027)' },
                  { id: 'PPO', label: 'Final Year PPO (Batch 2027)' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setSelectedYearFilter(tab.id)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      selectedYearFilter === tab.id
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* The 5 Program Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
                {(Object.values(PROGRAM_CONFIGS) as any[])
                  .filter((prog) => selectedYearFilter === 'ALL' || prog.id === selectedYearFilter)
                  .map((prog) => {
                    const isPPO = prog.id === 'PPO';
                    return (
                      <div
                        key={prog.id}
                        className={`rounded-2xl p-5 border flex flex-col justify-between transition-all duration-200 shadow-xs hover:shadow-xl hover:-translate-y-1 ${
                          isPPO
                            ? 'bg-blue-50/50 border-blue-300 ring-2 ring-blue-500/20'
                            : 'bg-white border-slate-200'
                        }`}
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between gap-1.5">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                              {prog.badge}
                            </span>
                            <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              {prog.duration}
                            </span>
                          </div>

                          <h3 className="text-lg font-bold text-slate-900 leading-snug">
                            {prog.title}
                          </h3>

                          <p className="text-[11px] font-semibold text-indigo-700">
                            Target: {prog.targetAcademicYear}
                          </p>

                          <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                            {prog.shortDescription}
                          </p>

                          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] space-y-1">
                            <span className="font-bold text-slate-500 uppercase tracking-wider text-[9px] block">
                              Career Milestone Target
                            </span>
                            <span className="font-bold text-emerald-700 flex items-start gap-1 leading-snug">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{prog.summaryTarget}</span>
                            </span>
                          </div>
                        </div>

                        <div className="pt-4 mt-3 border-t border-slate-100 space-y-2">
                          <button
                            type="button"
                            onClick={() => handleRoadmapClick(prog.id)}
                            className="w-full py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                            <span>View Roadmap</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleEnrollClick(prog.id)}
                            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <span>Enroll in Program</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* Program Disclaimer */}
              <div className="mt-10 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 text-center max-w-3xl mx-auto leading-relaxed">
                {PROGRAM_DISCLAIMER}
              </div>

            </div>
          </section>
        )}

        {/* ============================================================ */}
        {/* 4. THE 4-STAGE TALENT OPERATING PIPELINE                     */}
        {/* ============================================================ */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
              The InterHive Engine
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              From College Student to Hired Engineer in 4 Stages
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              A transparent, objective development system that replaces subjective guesswork with real engineering data.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Diagnostic Assessment',
                desc: 'Take an initial benchmark evaluation to assess your foundational logic, code quality, and choose your career track.',
                icon: Terminal,
              },
              {
                step: '02',
                title: 'Production Sprints & PRs',
                desc: 'Build real-world full-stack features using modern frameworks, managing Git branches, writing unit tests, and submitting PRs.',
                icon: Code2,
              },
              {
                step: '03',
                title: 'Attendance & Rubric Audits',
                desc: 'Senior mentors conduct regular code reviews. Automated punch-in tracking establishes your professional reliability.',
                icon: ShieldCheck,
              },
              {
                step: '04',
                title: 'Corporate Matching & PPO',
                desc: 'Verified partner companies review your public repository dossier and interview you directly for internships & PPOs.',
                icon: Building2,
              },
            ].map((st, idx) => {
              const Icon = st.icon;
              return (
                <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black tracking-widest text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                      STAGE {st.step}
                    </span>
                    <Icon className="w-5 h-5 text-slate-400" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{st.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{st.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ============================================================ */}
        {/* 5. DUAL GATEWAY: FOR STUDENTS & FOR COMPANIES                */}
        {/* ============================================================ */}
        <section className="py-16 bg-gradient-to-b from-slate-50 via-white to-slate-50 border-y border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
                Choose Your Journey
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Built for Ambitious Students & Modern Engineering Teams
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Card 1: For Interns */}
              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">For Interns & Students</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Stop getting ignored on job boards. Build verified production repositories, receive 1-on-1 code reviews from senior engineers, and get matched with hiring companies.
                  </p>
                  <ul className="space-y-2 text-xs text-slate-600 font-medium">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>5 tailored programs from 1st Year to Final Year PPO</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Production pull requests, Docker, and full-stack architectures</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Direct hiring introductions with partner tech startups</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <Link
                    to="/for-interns"
                    className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/20 transition flex items-center justify-center gap-2"
                  >
                    <span>Explore Student Experience</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Card 2: For Companies */}
              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">For Hiring Companies</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Skip the 40-day hiring cycle and endless resume screening. Access pre-vetted student developers who are day-1 productive in modern tech stacks.
                  </p>
                  <ul className="space-y-2 text-xs text-slate-600 font-medium">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>70% reduction in senior developer screening hours</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Pre-vetted on GitHub PRs, testing, and agile standups</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Interactive hiring & training cost calculator to see savings</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <Link
                    to="/for-companies"
                    className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md shadow-slate-900/20 transition flex items-center justify-center gap-2"
                  >
                    <span>Explore Employer Portal & ROI Calculator</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 6. INTERACTIVE PLACEMENT TIMELINE CALCULATOR                 */}
        {/* ============================================================ */}
        <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
              Interactive Planning Tool
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Calculate Your Placement & PPO Readiness Timeline
            </h2>
            <p className="text-sm text-slate-500">
              Select your academic year to see milestone targets, required projects, and corporate matching dates.
            </p>
          </div>

          <PlacementTimelineCalculator
            onApplyForBatch={(progId) => {
              setSelectedProgramTypeForModal(progId);
              setIsInternshipModalOpen(true);
            }}
          />
        </section>

        {/* ============================================================ */}
        {/* 7. FREQUENTLY ASKED QUESTIONS                                 */}
        {/* ============================================================ */}
        {isSectionVisible('faq') && (
          <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 space-y-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                Got Questions?
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="text-sm text-slate-500">Clear, transparent answers for students and corporate partners</p>
            </div>

            <div className="space-y-3">
              {activeFaqItems.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 font-bold text-slate-900 hover:text-blue-600 transition-colors text-sm sm:text-base cursor-pointer"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-blue-600' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ============================================================ */}
        {/* 8. EXECUTIVE CALL TO ACTION CLOSING BANNER                   */}
        {/* ============================================================ */}
        <section className="py-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30">
              <Sparkles className="w-4 h-4" />
              <span>Next Cohort Starting Soon</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
              Ready to Bridge the Gap to Industry Excellence?
            </h2>

            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Whether you are a student striving for production readiness or an engineering leader looking for dependable talent, InterHive is your partner.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => {
                  setSelectedProgramTypeForModal('PPO');
                  setIsInternshipModalOpen(true);
                }}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Apply for Next Cohort</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <Link
                to="/for-companies"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/20 transition flex items-center justify-center gap-2"
              >
                <span>Hire Talent with InterHive</span>
                <ArrowUpRight className="w-4 h-4 text-slate-400" />
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <PublicFooter
        onOpenInternshipModal={() => setIsInternshipModalOpen(true)}
        onOpenCompanyModal={() => setIsCompanyModalOpen(true)}
      />

      {/* ============================================================== */}
      {/* MODALS & PERSISTENT WIDGETS                                    */}
      {/* ============================================================== */}

      {/* Internship Application Modal */}
      <InternshipApplicationModal
        isOpen={isInternshipModalOpen}
        onClose={() => setIsInternshipModalOpen(false)}
        preselectedProgramType={selectedProgramTypeForModal}
      />

      {/* Company Inquiry Modal */}
      <CompanyInquiryModal
        isOpen={isCompanyModalOpen}
        onClose={() => setIsCompanyModalOpen(false)}
      />

      {/* Program Details & Roadmap Modal */}
      <ProgramDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        programType={activeDetailsProgramType}
        onEnroll={(progType) => {
          setSelectedProgramTypeForModal(progType);
          setIsInternshipModalOpen(true);
        }}
      />

      {/* Video Modal ("Watch How It Works") */}
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        onEnroll={() => {
          setSelectedProgramTypeForModal('PPO');
          setIsInternshipModalOpen(true);
        }}
      />

      {/* Quick Readiness Quiz Modal */}
      <QuickReadinessQuizModal
        isOpen={isQuizModalOpen}
        onClose={() => setIsQuizModalOpen(false)}
        onStartTrackApplication={(trackCat, progType) => {
          setSelectedProgramCategory(trackCat);
          setSelectedProgramTypeForModal(progType);
          setIsInternshipModalOpen(true);
        }}
      />

      {/* Sticky Persistent CTA Bar */}
      {showStickyCta && isSectionVisible('stickyCta') && (
        <aside aria-label="Quick application" className="fixed bottom-4 left-0 right-0 z-40 px-4 pointer-events-none animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="max-w-3xl mx-auto bg-slate-900/95 backdrop-blur-xl text-white rounded-2xl p-3 sm:p-3.5 shadow-2xl border border-slate-700/60 flex items-center justify-between gap-3 pointer-events-auto">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shrink-0 shadow-sm shadow-blue-500/30">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-xs sm:text-sm text-white">InterHive Admissions Open</span>
                  <span className="text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full">
                    5 Major Programs
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Batches 2027-2030 &bull; PPO Program: 2 Mo InterHive + 6 Mo Corporate Internship
                </p>
              </div>
              <div className="sm:hidden">
                <span className="font-extrabold text-xs text-white block">Admissions Open</span>
                <span className="text-[10px] text-slate-300 block">1-Year to PPO Track</span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setSelectedProgramTypeForModal('PPO');
                  setIsInternshipModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition cursor-pointer"
              >
                Apply Now
              </button>
            </div>
          </div>
        </aside>
      )}

    </div>
  );
};

export default LandingPage;
