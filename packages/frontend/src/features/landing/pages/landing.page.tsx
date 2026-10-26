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
  ShieldCheck
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

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

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

  // Video modal state
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Persistent Sticky CTA bar state (slides in after hero scroll)
  const [showStickyCta, setShowStickyCta] = useState(false);

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

  // Dynamic Content from Database (Managed via Admin Dashboard)
  const [publicPartners, setPublicPartners] = useState<PartnerItem[]>([]);
  const [publicTestimonials, setPublicTestimonials] = useState<TestimonialItem[]>([]);

  // Interactive Curriculum Track Showcases for Hero Preview (truthful, educational platform demonstration)
  const trackShowcases = [
    {
      id: 'fullstack',
      trackName: 'PPO Track — Full Stack Engineering',
      curriculum: 'Node.js, React, Microservices & System Design',
      badgeColor: 'bg-blue-600',
      badgeInitial: 'FS',
      progress: 60,
      activeStep: 4,
      currentStage: 'Corporate Matching Sprint',
      currentStageDesc: 'Completing full-stack production pull-request audits before hiring rounds.',
      modules: '12/12',
      projects: '5/5',
      tests: '8/8',
      stipend: '₹35,000 - ₹45,000 / mo',
      ppoTarget: '₹10 - ₹14 LPA Target'
    },
    {
      id: 'cloud',
      trackName: 'PPO Track — Cloud & DevOps Engineering',
      curriculum: 'Docker, Kubernetes, AWS & CI/CD Pipelines',
      badgeColor: 'bg-purple-600',
      badgeInitial: 'CD',
      progress: 85,
      activeStep: 6,
      currentStage: 'Production Internship Sprint',
      currentStageDesc: 'Deploying automated infrastructure with mentor and code reviews.',
      modules: '10/10',
      projects: '4/4',
      tests: '10/10',
      stipend: '₹30,000 - ₹40,000 / mo',
      ppoTarget: '₹9 - ₹12 LPA Target'
    },
    {
      id: 'aids',
      trackName: 'PPO Track — Applied AI & Data Science',
      curriculum: 'Python, PyTorch, LLMs, Vector DBs & ML APIs',
      badgeColor: 'bg-emerald-600',
      badgeInitial: 'AI',
      progress: 100,
      activeStep: 7,
      currentStage: 'PPO Transition & Placement',
      currentStageDesc: 'Graduation capstone submitted; preparing for full-time offer onboarding.',
      modules: '14/14',
      projects: '6/6',
      tests: '12/12',
      stipend: '₹40,000 - ₹50,000 / mo',
      ppoTarget: '₹12 - ₹16 LPA Target'
    }
  ];

  const currentShowcases = (cmsConfig?.hero?.showcases && cmsConfig.hero.showcases.length > 0)
    ? cmsConfig.hero.showcases
    : trackShowcases;

  const [activeTrackIndex, setActiveTrackIndex] = useState(0);
  const currentTrack = currentShowcases[activeTrackIndex] || currentShowcases[0] || trackShowcases[0];

  useEffect(() => {
    const trackTimer = setInterval(() => {
      setActiveTrackIndex((prev) => (prev + 1) % currentShowcases.length);
    }, 6000);
    return () => clearInterval(trackTimer);
  }, [currentShowcases.length]);

  const faqItems = [
    {
      question: 'Is InterHive free for students?',
      answer: 'Yes. Creating an account, taking our readiness assessment, and applying for internships through InterHive is completely free for students. We are committed to keeping career development accessible to all learners.',
    },
    {
      question: 'How does the matching process work?',
      answer: 'Instead of generic keyword matching, we evaluate your practical technical readiness and connect you directly with internships and companies looking for your specific skill profile.',
      link: { text: 'View our programs & tracks', to: '/programs' },
    },
    {
      question: 'What happens if I don\'t get placed?',
      answer: 'If you aren\'t matched right away, you receive actionable feedback on skill gaps along with recommended learning paths on our Programs page so you can level up and re-apply for upcoming cohorts.',
      link: { text: 'Explore learning paths', to: '/programs' },
    },
    {
      question: 'How are companies and interns verified on InterHive?',
      answer: 'We review company postings to verify real project scopes and fair stipends. For candidates, our practical assessments evaluate fundamental engineering skills before connecting them with hiring partners.',
    },
    {
      question: 'Do I need prior experience to apply?',
      answer: 'No prior internship or professional work experience is required. As long as you have learned core fundamentals in your domain, our readiness assessment helps you demonstrate that ability to employers.',
    },
  ];

  const activeFaqItems = (cmsConfig?.faq?.items && cmsConfig.faq.items.length > 0)
    ? cmsConfig.faq.items
    : faqItems;

  // Dynamic Landing Page Metrics from live backend / admin overrides
  const [statsData, setStatsData] = useState<{
    companyCount: number;
    activeInternshipsCount: number;
    studentsPlacedCount: number;
    averageRating: number | null;
  } | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [dynamicLandingStats, setDynamicLandingStats] = useState<LandingStatItem[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const apiBase = import.meta.env.VITE_API_URL ||
          (import.meta.env.PROD ? 'https://interhive-backend.onrender.com/api/v1' : '/api/v1');
        const res = await fetch(`${apiBase}/stats/public`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setStatsData(json.data);
          }
        }
      } catch (err) {
        // Stats fetch failed
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();

    const loadLandingStats = () => {
      // 1. Try reading from cached stat items (API-seeded, admin-verified values only)
      try {
        const cached = localStorage.getItem('interhive_landing_stat_items');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setDynamicLandingStats(parsed);
          }
        }
      } catch (e) {}

      // Legacy localStorage key removed — it contained unverified placeholder values
      // that did not reflect real platform data. Stats are now sourced exclusively
      // from the backend (admin-managed via Admin → Landing Stats).

      // 2. Fetch from backend API
      statsApi.getLandingStats()
        .then(res => {
          if (res.data?.success && Array.isArray(res.data?.data) && res.data.data.length > 0) {
            setDynamicLandingStats(res.data.data);
            try {
              localStorage.setItem('interhive_landing_stat_items', JSON.stringify(res.data.data));
            } catch (e) {}
          }
        })
        .catch(() => {});
    };

    loadLandingStats();

    const handleUpdate = () => loadLandingStats();
    window.addEventListener('landing-stats-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('landing-stats-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // 3D Card Interactive Tilt Mouse Tracking
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const rotateY = ((mouseX - width / 2) / (width / 2)) * 14;
    const rotateX = -((mouseY - height / 2) / (height / 2)) * 14;

    const glareX = (mouseX / width) * 100;
    const glareY = (mouseY / height) * 100;

    setTilt({ x: rotateX, y: rotateY });
    setGlare({ x: glareX, y: glareY, opacity: 0.25 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setGlare({ x: 50, y: 50, opacity: 0 });
  };

  // Company Partner Modal State
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);

  // Fetch live company requirements & published landing content
  useEffect(() => {
    const fetchLandingData = async () => {
      try {
        // Fetch published partners & testimonials
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

        // Fetch live published requirements from registered partner companies
        const res = await companyApi.getAll({ page: 1, limit: 6 });
        if (res.data?.data && res.data.data.length > 0) {
          const reqs: any[] = [];
          for (const comp of res.data.data) {
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

  const displayList = liveRequirements;
  const categories = ['All', 'Software Engineering', 'Frontend', 'AI & Data Science', 'UI/UX Design'];

  const filteredOpportunities = displayList.filter(opp => {
    const titleMatch = (opp.title || opp.position || '').toLowerCase().includes(searchTerm.toLowerCase());
    const companyMatch = (opp.company || opp.companyName || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSearch = titleMatch || companyMatch;

    if (selectedCategory === 'All') return matchesSearch;
    return matchesSearch && (opp.category === selectedCategory || (opp.tags && opp.tags.includes(selectedCategory)));
  });

  return (
    <div className="min-h-screen bg-[#F0F5FA] font-sans antialiased text-slate-800 selection:bg-blue-600 selection:text-white overflow-x-hidden">
      
      {/* Global CSS Animations */}
      <style>{`
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(1deg); }
        }
        @keyframes floatMedium {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-14px) rotate(-1.5deg); }
        }
        @keyframes floatFast {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.08); }
        }
        .animate-float-slow { animation: floatSlow 6s ease-in-out infinite; }
        .animate-float-medium { animation: floatMedium 5s ease-in-out infinite 1s; }
        .animate-float-fast { animation: floatFast 4s ease-in-out infinite 0.5s; }
        .animate-pulse-glow { animation: pulseGlow 8s ease-in-out infinite; }
        .perspective-1000 { perspective: 1000px; transform-style: preserve-3d; }
        .preserve-3d { transform-style: preserve-3d; }
        .handwriting-font { font-family: 'Caveat', 'Brush Script MT', 'Comic Sans MS', cursive; }
      `}</style>

      {/* Header Navigation */}
      <PublicNavbar
        activePage="home"
        onOpenInternshipModal={() => setIsInternshipModalOpen(true)}
        onOpenCompanyModal={() => setIsCompanyModalOpen(true)}
      />

      {/* 100% FULL-BLEED HERO SECTION WITH FULL PAGE COVERAGE */}
      {isSectionVisible('hero') && (
      <section className="relative pt-6 pb-28 overflow-hidden bg-gradient-to-br from-[#EBF3FF] via-[#F4F8FC] to-[#F3E8FF]">
        
        {/* 100% Full-bleed Hero Background Image Spanning Entire Width (inset-0 w-full) */}
        <img
          src={cmsConfig.hero?.background?.url || "/interhive_full_bg.png"}
          alt="InterHive Hero Tech Campus Background"
          width={1920}
          height={1080}
          loading="eager"
          decoding="async"
          style={{ opacity: cmsConfig.hero?.background?.opacity ?? 0.8 }}
          className="absolute inset-0 w-full h-full object-cover object-right-top mix-blend-multiply pointer-events-none z-0 max-w-full"
        />

        {/* Soft Linear Gradient Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#EBF3FF]/90 via-[#F4F8FC]/60 to-transparent pointer-events-none z-0" />

        {/* Soft Dot Matrix Pattern */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#3b82f6_0.8px,transparent_0.8px)] [background-size:26px_26px] z-0" />
        
        {/* Glowing Radial Orbs */}
        <div className="absolute -top-24 left-1/4 w-96 h-96 rounded-full bg-blue-400/20 blur-3xl pointer-events-none animate-pulse-glow z-0" />
        <div className="absolute top-1/2 -right-20 w-96 h-96 rounded-full bg-purple-400/20 blur-3xl pointer-events-none animate-pulse-glow z-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* HERO LEFT CONTENT */}
            <div className="lg:col-span-5 space-y-6 text-center lg:text-left">
              
              {/* Version & PPO Track Badges */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100/90 border border-purple-200/80 text-purple-800 text-xs font-extrabold shadow-sm">
                  <GraduationCap className="w-4 h-4 text-purple-600" />
                  <span>{cmsConfig.hero?.badgeText || '6-Month Structured PPO Track: 2 Months Training + 4 Months Paid Corporate Internship'}</span>
                </div>
              </div>

              {/* Headlines */}
              <div className="space-y-3">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.08]">
                  {cmsConfig.hero?.headlineMain || 'From Campus Selection'} <br />
                  to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">{cmsConfig.hero?.headlineGradient || 'Full-Time PPO.'}</span>
                </h1>

                {/* Instant PPO Explanation for College Students */}
                {cmsConfig.hero?.ppoDefinition && (
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-blue-50/90 border border-blue-200/80 text-blue-900 text-xs font-semibold shadow-2xs text-left max-w-lg mx-auto lg:mx-0">
                    <span className="w-5 h-5 rounded-md bg-blue-600 text-white font-black text-[10px] flex items-center justify-center shrink-0">
                      ℹ
                    </span>
                    <span>
                      {cmsConfig.hero.ppoDefinition}
                    </span>
                  </div>
                )}

                <p className="text-sm sm:text-base text-slate-600 font-semibold max-w-lg mx-auto lg:mx-0">
                  {cmsConfig.hero?.description || 'Practical 2-month industrial training followed by 4-month paid corporate internships with direct PPO conversion. 100% free for all college students.'}
                </p>
              </div>

              {/* 4 Feature Badges from Reference Image */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                <div className="flex flex-col items-center lg:items-start p-2.5 rounded-xl bg-white/80 border border-slate-200/80 shadow-2xs">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-1.5">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-700 leading-snug">Industry Training</span>
                  <span className="text-[9px] text-slate-400 font-semibold">by InterHive</span>
                </div>
                <div className="flex flex-col items-center lg:items-start p-2.5 rounded-xl bg-white/80 border border-slate-200/80 shadow-2xs">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-1.5">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-700 leading-snug">Corporate</span>
                  <span className="text-[9px] text-slate-400 font-semibold">Matching</span>
                </div>
                <div className="flex flex-col items-center lg:items-start p-2.5 rounded-xl bg-white/80 border border-slate-200/80 shadow-2xs">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-1.5">
                    <Users className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-700 leading-snug">Mentorship</span>
                  <span className="text-[9px] text-slate-400 font-semibold">& Real Projects</span>
                </div>
                <div className="flex flex-col items-center lg:items-start p-2.5 rounded-xl bg-white/80 border border-slate-200/80 shadow-2xs">
                  <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center mb-1.5">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-700 leading-snug">Paid Internship</span>
                  <span className="text-[9px] text-slate-400 font-semibold">& PPO Review</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <button
                  onClick={() => {
                    setSelectedProgramTypeForModal('ppo_internship');
                    setIsInternshipModalOpen(true);
                  }}
                  className="px-6 py-3.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>{cmsConfig.hero?.ctaButtons?.[0]?.text || 'Join the PPO Track'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsQuizModalOpen(true)}
                  className="px-5 py-3.5 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200/80 font-bold text-xs sm:text-sm shadow-xs hover:border-blue-300 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>{cmsConfig.hero?.ctaButtons?.[1]?.text || '2-Min Track Quiz'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsVideoModalOpen(true)}
                  className="px-5 py-3.5 rounded-full bg-white text-slate-800 border border-slate-200/90 font-bold text-xs sm:text-sm shadow-xs hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center">
                    <Play className="w-3 h-3 text-slate-700 fill-slate-700 ml-0.5" />
                  </div>
                  <span>Watch Walkthrough</span>
                </button>
              </div>

            </div>

            {/* HERO RIGHT COLUMN (STUDENT DASHBOARD PREVIEW MATCHING REFERENCE IMAGE 1) */}
            <div className="lg:col-span-7 relative perspective-1000 py-4 sm:py-6">
              
              {/* Mobile-Only Feature Badges Strip (Ensures Mobile Visual Attractiveness is 10/10) */}
              <div className="flex sm:hidden items-center justify-center gap-2 mb-3">
                <div className="px-3 py-1.5 rounded-xl bg-white/95 border border-slate-200/90 text-[11px] font-black text-slate-800 flex items-center gap-1.5 shadow-2xs">
                  <div className="w-5 h-5 rounded-md bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-3 h-3" />
                  </div>
                  <span>2 Mos Training</span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-white/95 border border-slate-200/90 text-[11px] font-black text-slate-800 flex items-center gap-1.5 shadow-2xs">
                  <div className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <Briefcase className="w-3 h-3" />
                  </div>
                  <span>4 Mos Paid Internship</span>
                </div>
              </div>
              
              <div 
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="relative mx-auto max-w-2xl lg:max-w-none transition-transform duration-200 ease-out preserve-3d"
                style={{
                  transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.01, 1.01, 1.01)`
                }}
              >
                
                {/* 3D Glass Dashboard Card */}
                <div className="w-full bg-white/95 backdrop-blur-2xl p-5 sm:p-7 rounded-[2.2rem] border border-white/90 shadow-2xl preserve-3d relative z-10">
                  
                  {/* Specular Light Overlay */}
                  <div 
                    className="absolute inset-0 pointer-events-none transition-opacity duration-300 rounded-[2.2rem]"
                    style={{
                      background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.7) 0%, transparent 65%)`,
                      opacity: glare.opacity
                    }}
                  />

                  {/* Header Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 mb-4 gap-2">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-black flex items-center justify-center text-xs shadow-xs">
                          ih
                        </div>
                        <span className="font-extrabold text-slate-900 text-sm">InterHive</span>
                      </div>
                      <div className="h-4 w-px bg-slate-200 hidden sm:block" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1.5 leading-none">
                            Interactive Learning Track Preview 🚀
                          </h4>
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[9px] font-black">
                            <Sparkles className="w-2.5 h-2.5 text-blue-600" />
                            Live Simulation
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
                          {currentTrack.curriculum}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between sm:justify-end gap-2">
                      {/* Interactive Track Switcher Tabs */}
                      <div className="flex items-center gap-1 bg-slate-100/80 p-0.5 rounded-lg border border-slate-200/60">
                        {currentShowcases.map((tr, tIdx) => (
                          <button
                            key={tr.id || tIdx}
                            type="button"
                            onClick={() => setActiveTrackIndex(tIdx)}
                            className={`px-2 py-0.5 rounded-md text-[9px] font-black transition-all cursor-pointer ${
                              tIdx === activeTrackIndex
                                ? 'bg-white text-blue-700 shadow-2xs border border-slate-200/60'
                                : 'text-slate-500 hover:text-slate-800'
                            }`}
                          >
                            {tr.badgeInitial}
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 pl-2 border-l border-slate-100">
                        <div className={`w-7 h-7 rounded-full ${currentTrack.badgeColor || 'bg-blue-600'} text-white text-xs font-black flex items-center justify-center shadow-xs transition-colors`}>
                          {currentTrack.badgeInitial}
                        </div>
                        <span className="text-xs font-bold text-slate-700 hidden sm:inline">
                          {currentTrack.id === 'fullstack' ? 'Full Stack' : currentTrack.id === 'cloud' ? 'DevOps' : 'AI & Data'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Inner Layout with Mini-Sidebar and Track View */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                    
                    {/* Mini Sidebar */}
                    <div className="hidden sm:block sm:col-span-3 space-y-1 border-r border-slate-100 pr-3">
                      <div className="px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-600 font-extrabold text-[11px] flex items-center gap-2 shadow-2xs">
                        <Layers className="w-3.5 h-3.5" />
                        <span>Dashboard</span>
                      </div>
                      <div className="px-2.5 py-1.5 text-slate-500 font-bold text-[11px] flex items-center gap-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
                        <GraduationCap className="w-3.5 h-3.5" />
                        <span>My Program</span>
                      </div>
                      <div className="px-2.5 py-1.5 text-slate-500 font-bold text-[11px] flex items-center gap-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Training</span>
                      </div>
                      <div className="px-2.5 py-1.5 text-slate-500 font-bold text-[11px] flex items-center gap-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
                        <Code className="w-3.5 h-3.5" />
                        <span>Projects</span>
                      </div>
                      <div className="px-2.5 py-1.5 text-slate-500 font-bold text-[11px] flex items-center gap-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
                        <Building2 className="w-3.5 h-3.5" />
                        <span>Company Match</span>
                      </div>
                      <div className="px-2.5 py-1.5 text-slate-500 font-bold text-[11px] flex items-center gap-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
                        <Award className="w-3.5 h-3.5" />
                        <span>Assessments</span>
                      </div>
                      <div className="px-2.5 py-1.5 text-slate-500 font-bold text-[11px] flex items-center gap-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
                        <Users className="w-3.5 h-3.5" />
                        <span>Profile</span>
                      </div>
                    </div>

                    {/* Main Track Progress Area */}
                    <div className="sm:col-span-9 space-y-3.5">
                      
                      {/* PPO Track Card */}
                      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-50 to-blue-50/40 border border-slate-200/70 shadow-2xs">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-extrabold text-slate-900 text-xs sm:text-sm">
                            {currentTrack.trackName}
                          </span>
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                            {currentTrack.currentStage}
                          </span>
                        </div>

                        {/* Progress Bar Dynamic */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-extrabold text-slate-500">
                            <span>Track Completion</span>
                            <span className="text-blue-600">{currentTrack.progress}%</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500" 
                              style={{ width: `${currentTrack.progress}%` }} 
                            />
                          </div>
                        </div>

                        {/* 7-Step Stepper Timeline matching Reference Image 1 */}
                        <div className="pt-3 overflow-x-auto">
                          <div className="flex items-center justify-between min-w-[340px] text-center">
                            
                            {/* Step 1: Applied */}
                            <div className="flex flex-col items-center">
                              <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] shadow-xs">
                                <Check className="w-3 h-3 stroke-[3]" />
                              </div>
                              <span className="text-[8px] font-black text-slate-600 mt-1">Applied</span>
                            </div>
                            <div className="flex-1 h-0.5 bg-emerald-500 mx-1" />

                            {/* Step 2: Selected */}
                            <div className="flex flex-col items-center">
                              <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] shadow-xs">
                                <Check className="w-3 h-3 stroke-[3]" />
                              </div>
                              <span className="text-[8px] font-black text-slate-600 mt-1">Selected</span>
                            </div>
                            <div className="flex-1 h-0.5 bg-emerald-500 mx-1" />

                            {/* Step 3: InterHive Training */}
                            <div className="flex flex-col items-center">
                              <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] shadow-xs">
                                <Check className="w-3 h-3 stroke-[3]" />
                              </div>
                              <span className="text-[8px] font-black text-slate-600 mt-1">Training</span>
                            </div>
                            <div className={`flex-1 h-0.5 mx-1 ${(currentTrack.activeStep ?? 4) >= 4 ? 'bg-emerald-500' : 'bg-slate-200'}`} />

                            {/* Step 4: Company Matching */}
                            <div className="flex flex-col items-center">
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shadow-xs ${
                                (currentTrack.activeStep ?? 4) === 4 
                                  ? 'bg-blue-600 text-white ring-4 ring-blue-100' 
                                  : (currentTrack.activeStep ?? 4) > 4 
                                  ? 'bg-emerald-500 text-white' 
                                  : 'bg-slate-200 text-slate-600'
                              }`}>
                                {(currentTrack.activeStep ?? 4) > 4 ? <Check className="w-3 h-3 stroke-[3]" /> : '4'}
                              </div>
                              <span className="text-[8px] font-black text-slate-600 mt-1">Matching</span>
                            </div>
                            <div className={`flex-1 h-0.5 mx-1 ${(currentTrack.activeStep ?? 4) >= 5 ? 'bg-emerald-500' : 'bg-slate-200'}`} />

                            {/* Step 5: Company Internship */}
                            <div className="flex flex-col items-center">
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shadow-xs ${
                                (currentTrack.activeStep ?? 4) === 5 
                                ? 'bg-blue-600 text-white ring-4 ring-blue-100' 
                                : (currentTrack.activeStep ?? 4) > 5 
                                ? 'bg-emerald-500 text-white' 
                                : 'bg-slate-200 text-slate-600 opacity-60'
                            }`}>
                                {(currentTrack.activeStep ?? 4) > 5 ? <Check className="w-3 h-3 stroke-[3]" /> : '5'}
                              </div>
                              <span className="text-[8px] font-bold text-slate-500 mt-1">Internship</span>
                            </div>
                            <div className={`flex-1 h-0.5 mx-1 ${(currentTrack.activeStep ?? 4) >= 6 ? 'bg-emerald-500' : 'bg-slate-200'}`} />

                            {/* Step 6: Evaluation */}
                            <div className="flex flex-col items-center">
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shadow-xs ${
                                (currentTrack.activeStep ?? 4) === 6 
                                  ? 'bg-blue-600 text-white ring-4 ring-blue-100' 
                                  : (currentTrack.activeStep ?? 4) > 6 
                                  ? 'bg-emerald-500 text-white' 
                                  : 'bg-slate-200 text-slate-600 opacity-60'
                            }`}>
                                {(currentTrack.activeStep ?? 4) > 6 ? <Check className="w-3 h-3 stroke-[3]" /> : '6'}
                              </div>
                              <span className="text-[8px] font-bold text-slate-500 mt-1">Evaluation</span>
                            </div>
                            <div className={`flex-1 h-0.5 mx-1 ${(currentTrack.activeStep ?? 4) >= 7 ? 'bg-emerald-500' : 'bg-slate-200'}`} />

                            {/* Step 7: PPO */}
                            <div className="flex flex-col items-center">
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shadow-xs ${
                                (currentTrack.activeStep ?? 4) === 7 
                                  ? 'bg-emerald-600 text-white ring-4 ring-emerald-100' 
                                  : 'bg-slate-200 text-slate-600 opacity-60'
                              }`}>
                                7
                              </div>
                              <span className="text-[8px] font-black text-slate-700 mt-1">PPO</span>
                            </div>

                          </div>
                        </div>

                      </div>

                      {/* 2 Subcards Side by Side from Reference Image 1 */}
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                        
                        {/* Current Stage Card */}
                        <div className="sm:col-span-7 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[9px] font-black tracking-wider text-slate-400 uppercase block">
                                Active Sprint
                              </span>
                              <span className="text-[9px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                                Cohort Phase
                              </span>
                            </div>
                            <div className="flex items-start gap-2.5">
                              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                <Building2 className="w-5 h-5" />
                              </div>
                              <div>
                                <h5 className="font-black text-slate-900 text-xs">
                                  {currentTrack.currentStage}
                                </h5>
                                <p className="text-[10px] text-slate-500 leading-tight mt-0.5 font-medium">
                                  {currentTrack.currentStageDesc}
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-slate-100">
                            <span className="text-[10px] font-bold text-slate-600">
                              Stipend Track: <strong className="text-slate-900">{currentTrack.stipend}</strong>
                            </span>
                            <span className="text-[10px] font-black text-emerald-600">
                              {currentTrack.ppoTarget}
                            </span>
                          </div>
                        </div>

                        {/* Training Completion Card */}
                        <div className="sm:col-span-5 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-black tracking-wider text-slate-400 uppercase">
                                Standard Milestones
                              </span>
                              <span className="text-[10px] font-black text-emerald-600">
                                {currentTrack.progress === 100 ? '100% PPO' : 'On Track'}
                              </span>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-slate-100 mt-1.5 overflow-hidden">
                              <div 
                                className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                                style={{ width: `${currentTrack.progress}%` }} 
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-1 pt-2 text-center border-t border-slate-100 mt-2">
                            <div>
                              <span className="block text-[8px] text-slate-400 font-bold uppercase">Modules</span>
                              <span className="text-[10px] font-black text-slate-800">
                                {currentTrack.modules}
                              </span>
                            </div>
                            <div>
                              <span className="block text-[8px] text-slate-400 font-bold uppercase">Projects</span>
                              <span className="text-[10px] font-black text-slate-800">
                                {currentTrack.projects}
                              </span>
                            </div>
                            <div>
                              <span className="block text-[8px] text-slate-400 font-bold uppercase">Tests</span>
                              <span className="text-[10px] font-black text-slate-800">
                                {currentTrack.tests}
                              </span>
                            </div>
                          </div>
                        </div>

                      </div>

                    </div>

                  </div>

                </div>

                {/* Floating 3D Pills */}
                <div 
                  className="hidden sm:block absolute -top-4 -right-2 z-30 animate-float-slow"
                  style={{ transform: 'translateZ(50px)' }}
                >
                  <div className="px-4 py-2 rounded-2xl bg-white/95 backdrop-blur-xl shadow-xl border border-white/90 text-xs font-black text-slate-800 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                      <GraduationCap className="w-3.5 h-3.5" />
                    </div>
                    <span>2 Months Training</span>
                  </div>
                </div>

                <div 
                  className="hidden sm:block absolute bottom-4 -left-4 z-30 animate-float-medium"
                  style={{ transform: 'translateZ(65px)' }}
                >
                  <div className="px-4 py-2 rounded-2xl bg-white/95 backdrop-blur-xl shadow-xl border border-white/90 text-xs font-black text-slate-800 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                      <Trophy className="w-3.5 h-3.5" />
                    </div>
                    <span>Pre-Placement Offer</span>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>

        {/* BOTTOM FLOWING SVG WAVE CURVE DIVIDER */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none pointer-events-none z-10">
          <svg 
            className="relative block w-full h-12 text-[#F0F5FA]" 
            viewBox="0 0 1200 120" 
            preserveAspectRatio="none" 
            fill="currentColor"
          >
            <path d="M0,0 C150,90 350,-40 500,40 C650,120 900,10 1200,50 L1200,120 L0,120 Z"></path>
          </svg>
        </div>

      </section>
      )}

      {/* ============================================================== */}
      {/* 1. YOUR JOURNEY TO A PPO (MATCHING REFERENCE IMAGE 1)          */}
      {/* ============================================================== */}
      {isSectionVisible('journey') && (
      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              Your Journey to a PPO
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-semibold mt-1">
              A structured 6-month pathway designed for your success.
            </p>
          </div>
          <Link
            to="/programs"
            className="text-xs sm:text-sm font-extrabold text-blue-600 hover:text-blue-700 flex items-center gap-1 group shrink-0"
          >
            <span>See Detailed Program</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 7 Horizontal Step Cards with Progression Connectors — Optimized for Mobile Touch & Desktop */}
        <div className="flex overflow-x-auto pb-4 gap-3 snap-x snap-mandatory lg:grid lg:grid-cols-7 scrollbar-thin">
          
          {/* Step 1: Apply & Assessment */}
          <div className="min-w-[210px] sm:min-w-0 flex-1 snap-start bg-blue-50/70 border border-blue-200/70 rounded-2xl p-4 flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shadow-2xs">
                  <Target className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-black text-blue-700 bg-white px-2 py-0.5 rounded-full border border-blue-200/80">
                  01
                </span>
              </div>
              <h4 className="text-xs font-black text-slate-900 mb-1 leading-snug">
                Apply & Assessment
              </h4>
              <p className="text-[10px] text-slate-600 font-medium leading-relaxed">
                Create your profile and complete AI + skill assessments.
              </p>
            </div>
          </div>

          {/* Step 2: Selection */}
          <div className="min-w-[210px] sm:min-w-0 flex-1 snap-start bg-purple-50/70 border border-purple-200/70 rounded-2xl p-4 flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shadow-2xs">
                  <UserCheck className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-black text-purple-700 bg-white px-2 py-0.5 rounded-full border border-purple-200/80">
                  02
                </span>
              </div>
              <h4 className="text-xs font-black text-slate-900 mb-1 leading-snug">
                Selection
              </h4>
              <p className="text-[10px] text-slate-600 font-medium leading-relaxed">
                Qualified students enter the PPO Track.
              </p>
            </div>
          </div>

          {/* Step 3: 2-Month Training */}
          <div className="min-w-[210px] sm:min-w-0 flex-1 snap-start bg-emerald-50/70 border border-emerald-200/70 rounded-2xl p-4 flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-2xs">
                  <BookOpen className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-black text-emerald-700 bg-white px-2 py-0.5 rounded-full border border-emerald-200/80">
                  03
                </span>
              </div>
              <h4 className="text-xs font-black text-slate-900 mb-1 leading-snug">
                2-Month Training at InterHive
              </h4>
              <p className="text-[10px] text-slate-600 font-medium leading-relaxed">
                Industry-focused training, real projects and mentorship.
              </p>
            </div>
          </div>

          {/* Step 4: Company Matching */}
          <div className="min-w-[210px] sm:min-w-0 flex-1 snap-start bg-amber-50/70 border border-amber-200/70 rounded-2xl p-4 flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shadow-2xs">
                  <Building2 className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-black text-amber-700 bg-white px-2 py-0.5 rounded-full border border-amber-200/80">
                  04
                </span>
              </div>
              <h4 className="text-xs font-black text-slate-900 mb-1 leading-snug">
                Company Matching
              </h4>
              <p className="text-[10px] text-slate-600 font-medium leading-relaxed">
                Get matched with our partner companies.
              </p>
            </div>
          </div>

          {/* Step 5: 4-Month Company Internship */}
          <div className="min-w-[210px] sm:min-w-0 flex-1 snap-start bg-rose-50/70 border border-rose-200/70 rounded-2xl p-4 flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shadow-2xs">
                  <Briefcase className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-black text-rose-700 bg-white px-2 py-0.5 rounded-full border border-rose-200/80">
                  05
                </span>
              </div>
              <h4 className="text-xs font-black text-slate-900 mb-1 leading-snug">
                4-Month Company Internship
              </h4>
              <p className="text-[10px] text-slate-600 font-medium leading-relaxed">
                Work on real-world projects at the partner company.
              </p>
            </div>
          </div>

          {/* Step 6: Performance Evaluation */}
          <div className="min-w-[210px] sm:min-w-0 flex-1 snap-start bg-indigo-50/70 border border-indigo-200/70 rounded-2xl p-4 flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shadow-2xs">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-black text-indigo-700 bg-white px-2 py-0.5 rounded-full border border-indigo-200/80">
                  06
                </span>
              </div>
              <h4 className="text-xs font-black text-slate-900 mb-1 leading-snug">
                Performance Evaluation
              </h4>
              <p className="text-[10px] text-slate-600 font-medium leading-relaxed">
                Ongoing reviews and final evaluation.
              </p>
            </div>
          </div>

          {/* Step 7: PPO */}
          <div className="min-w-[210px] sm:min-w-0 flex-1 snap-start bg-blue-100/70 border border-blue-300/80 rounded-2xl p-4 flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-2xs">
                  <Trophy className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-black text-blue-800 bg-white px-2 py-0.5 rounded-full border border-blue-300">
                  07
                </span>
              </div>
              <h4 className="text-xs font-black text-blue-900 mb-1 leading-snug">
                PPO
              </h4>
              <p className="text-[10px] text-blue-800 font-medium leading-relaxed">
                Receive a Pre-Placement Offer based on performance.
              </p>
            </div>
          </div>

        </div>

        {/* 4 Feature Pills Below Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-extrabold text-slate-900 text-xs">Verified Partner Network</h5>
              <p className="text-[10px] text-slate-500 font-medium">Direct corporate internship scopes</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-extrabold text-slate-900 text-xs">Industry-Ready Training</h5>
              <p className="text-[10px] text-slate-500 font-medium">Hands-on, practical learning</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-extrabold text-slate-900 text-xs">Real Project Experience</h5>
              <p className="text-[10px] text-slate-500 font-medium">Build a strong portfolio</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-extrabold text-slate-900 text-xs">Dedicated Mentorship</h5>
              <p className="text-[10px] text-slate-500 font-medium">Guidance from industry experts</p>
            </div>
          </div>
        </div>

      </section>
      )}

      {/* ============================================================== */}
      {/* 1.5 INTERACTIVE PLACEMENT CALCULATOR & TRANSPARENCY PILLARS    */}
      {/* ============================================================== */}
      {isSectionVisible('timelineCalculator') && (
      <PlacementTimelineCalculator
        onApplyForBatch={(progKey) => {
          setSelectedProgramTypeForModal(progKey);
          setIsInternshipModalOpen(true);
        }}
      />
      )}

      {/* ============================================================== */}
      {/* STRUCTURED INDUSTRY-READINESS PROGRAMS (1, 2, 3 & 4 YEAR)     */}
      {/* ============================================================== */}
      {isSectionVisible('programs') && (
      <section id="our-programs" className="py-14 bg-gradient-to-b from-white via-slate-50/50 to-white border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-8 space-y-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100/90 border border-blue-200/80 text-blue-800 text-xs font-extrabold shadow-xs">
              <GraduationCap className="w-4 h-4 text-blue-600" />
              <span>Structured Academic Pathways</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Our Industry-Readiness Programs
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-semibold max-w-2xl mx-auto">
              Choose a program aligned with your academic year — designed to take you progressively from company readiness to industrial training, internships, and full-time hiring.
            </p>
          </div>

          {/* Academic Year Filter Tabs */}
          <div className="flex items-center justify-center gap-2 flex-wrap mb-8">
            {[
              { id: 'ALL', label: 'All Programs' },
              { id: 'four_year', label: '1st Year (2028 Batch)' },
              { id: 'three_year', label: '2nd Year (2027 Batch)' },
              { id: 'two_year', label: '3rd Year (2026 Batch — Primary PPO)' },
              { id: 'one_year', label: 'Final Year (2025 Batch)' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedYearFilter(tab.id)}
                className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                  selectedYearFilter === tab.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* 4 Program Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(Object.values(PROGRAM_CONFIGS) as any[])
              .filter((prog) => selectedYearFilter === 'ALL' || prog.id === selectedYearFilter)
              .map((prog) => (
              <div
                key={prog.id}
                className="bg-white rounded-[20px] p-6 border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200/80">
                      {prog.badge}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">
                      {prog.duration}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-slate-900 mb-1">
                    {prog.title}
                  </h3>
                  
                  <p className="text-[12px] font-semibold text-purple-700 mb-3">
                    Target: {prog.targetAcademicYear}
                  </p>

                  <p className="text-xs text-slate-600 font-medium leading-relaxed mb-4">
                    {prog.shortDescription}
                  </p>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 mb-5">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Roadmap Target</span>
                    <span className="text-[12px] font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      {prog.summaryTarget}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveDetailsProgramType(prog.id as ProgramTypeKey);
                      setIsDetailsModalOpen(true);
                    }}
                    className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                    <span>View Program Roadmap</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedProgramTypeForModal(prog.id);
                      setIsInternshipModalOpen(true);
                    }}
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Enroll Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Disclaimer Note */}
          <div className="mt-8 p-4 rounded-xl bg-slate-100/80 border border-slate-200/80 text-[12px] text-slate-600 font-medium text-center max-w-4xl mx-auto">
            {PROGRAM_DISCLAIMER}
          </div>

        </div>
      </section>
      )}

      {/* ============================================================== */}
      {/* 2. DYNAMIC PLATFORM STATS STRIP                                */}
      {/* Only rendered when admin has configured and published stats.   */}
      {/* Hidden if no backend data is available (no fake defaults).     */}
      {/* ============================================================== */}
      {isSectionVisible('stats') && dynamicLandingStats.filter(s => typeof s.value === 'number' ? s.value > 0 : Boolean(s.value)).length > 0 && (
        <section className="py-8 bg-slate-50/70 border-y border-slate-200/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {dynamicLandingStats.filter(s => typeof s.value === 'number' ? s.value > 0 : Boolean(s.value)).map((stat, idx) => {
                const iconMap: Record<string, { comp: any; color: string }> = {
                  students_trained: { comp: Users, color: 'bg-blue-50 text-blue-600' },
                  internships_provided: { comp: Briefcase, color: 'bg-indigo-50 text-indigo-600' },
                  partner_companies: { comp: Building2, color: 'bg-purple-50 text-purple-600' },
                  ppo_conversion: { comp: Trophy, color: 'bg-emerald-50 text-emerald-600' },
                };
                const meta = iconMap[stat.key] || { comp: Trophy, color: 'bg-blue-50 text-blue-600' };
                const IconComponent = meta.comp;
                const formattedVal = typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value;

                return (
                  <div key={stat.key || idx} className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-xl ${meta.color} flex items-center justify-center shrink-0`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block font-black text-slate-900 text-lg sm:text-xl leading-none">
                        {formattedVal}{stat.suffix || ''}
                      </span>
                      <span className="text-[11px] text-slate-500 font-bold mt-0.5 block">
                        {stat.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
      {/* ============================================================== */}
      {/* 2.1 OUR PARTNER COMPANIES (ONLY VISIBLE IF ADMIN ADDS PARTNERS) */}
      {/* ============================================================== */}
      {isSectionVisible('partners') && publicPartners.length > 0 && (
        <section className="py-12 bg-white border-b border-slate-200/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold shadow-2xs mb-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Enterprise Placement Network</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Our Hiring Partners & Placement Ecosystem
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5 max-w-2xl">
                  Students train on production-grade codebases and transition directly into industrial internships across verified partners.
                </p>
              </div>
              <button
                onClick={() => setIsCompanyModalOpen(true)}
                className="text-xs font-extrabold text-blue-600 hover:text-blue-700 flex items-center gap-1 group shrink-0 cursor-pointer"
              >
                <span>Partner with Us</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
              {publicPartners.map((partner) => (
                <div
                  key={partner._id}
                  className="bg-white rounded-xl p-4 border border-slate-200/80 flex items-center justify-center h-16 shadow-2xs hover:shadow-md transition-shadow group"
                >
                  {partner.logo ? (
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="max-h-8 max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                    />
                  ) : (
                    <span className="font-black text-slate-800 text-sm tracking-wide">
                      {partner.name}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}



      {/* 2. WHY INTERHIVE / TRUST & DIFFERENTIATION SECTION */}
      {isSectionVisible('whyUs') && (
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-extrabold text-blue-600 tracking-widest uppercase">
            TRUST & DIFFERENTIATION
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Why InterHive?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-semibold max-w-xl mx-auto">
            Honest, outcome-driven preparation connecting motivated students with forward-thinking companies.
          </p>
        </div>

        {/* 3 Trust Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Structured Readiness Assessment */}
          <div className="bg-white rounded-[2rem] p-7 border border-slate-200/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-13 h-13 rounded-2xl bg-indigo-50 border border-indigo-200/80 text-indigo-600 flex items-center justify-center font-bold mb-5 shadow-xs group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">
                Structured Readiness Assessment
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                We don't just list roles — we help you prepare for them first.
              </p>
            </div>
          </div>

          {/* Curated, Matched Opportunities */}
          <div className="bg-white rounded-[2rem] p-7 border border-slate-200/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-13 h-13 rounded-2xl bg-blue-50 border border-blue-200/80 text-blue-600 flex items-center justify-center font-bold mb-5 shadow-xs group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">
                Curated, Matched Opportunities
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                Roles matched to your actual skills, not a generic job board.
              </p>
            </div>
          </div>

          {/* Real, Project-Based Experience */}
          <div className="bg-white rounded-[2rem] p-7 border border-slate-200/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-13 h-13 rounded-2xl bg-purple-50 border border-purple-200/80 text-purple-600 flex items-center justify-center font-bold mb-5 shadow-xs group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">
                Real, Project-Based Experience
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                Internships built around real work, so companies get interns who are actually ready to contribute.
              </p>
            </div>
          </div>

        </div>

        {/* Small "Learn our story ->" Link */}
        <div className="mt-8 text-center">
          <Link
            to="/about"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
          >
            <span>Learn our story</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
      )}

      {/* FEATURE GRID SECTION */}
      {isSectionVisible('features') && (
      <section id="features" className="pt-16 pb-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-2">
          <span className="text-xs font-extrabold text-blue-600 tracking-widest uppercase">
            PLATFORM FOR A BETTER TOMORROW
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Everything You Need to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
              Build Your Career
            </span>
          </h2>
        </div>

        {/* 4 Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Internships */}
          <div className="bg-white rounded-[2rem] p-7 border border-slate-200/80 shadow-xs hover:shadow-2xl hover:-translate-y-2 hover:rotate-1 transition-all duration-300 group flex flex-col justify-between">
            <div>
              <div className="w-13 h-13 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold mb-6 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-xs">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">Internships</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                Get hands-on experience with real-world projects from top companies.
              </p>
            </div>
            <div className="pt-6 flex justify-end">
              <a 
                href="#explore-opportunities" 
                className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Jobs */}
          <div className="bg-white rounded-[2rem] p-7 border border-slate-200/80 shadow-xs hover:shadow-2xl hover:-translate-y-2 hover:-rotate-1 transition-all duration-300 group flex flex-col justify-between">
            <div>
              <div className="w-13 h-13 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold mb-6 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-xs">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">Jobs</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                Find full-time opportunities and kickstart your professional journey.
              </p>
            </div>
            <div className="pt-6 flex justify-end">
              <a 
                href="#explore-opportunities" 
                className="w-9 h-9 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Top Companies */}
          <div className="bg-white rounded-[2rem] p-7 border border-slate-200/80 shadow-xs hover:shadow-2xl hover:-translate-y-2 hover:rotate-1 transition-all duration-300 group flex flex-col justify-between">
            <div>
              <div className="w-13 h-13 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-6 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-xs">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">Top Companies</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                Work with the best. From startups to global tech giants.
              </p>
            </div>
            <div className="pt-6 flex justify-end">
              <button 
                onClick={() => setIsCompanyModalOpen(true)} 
                className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Skill Development */}
          <div className="bg-white rounded-[2rem] p-7 border border-slate-200/80 shadow-xs hover:shadow-2xl hover:-translate-y-2 hover:-rotate-1 transition-all duration-300 group flex flex-col justify-between">
            <div>
              <div className="w-13 h-13 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold mb-6 group-hover:scale-110 group-hover:bg-amber-600 group-hover:text-white transition-all shadow-xs">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">Skill Development</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                Access curated learning paths, workshops and resources.
              </p>
            </div>
            <div className="pt-6 flex justify-end">
              <button 
                type="button"
                onClick={() => setIsVideoModalOpen(true)} 
                className="w-9 h-9 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors cursor-pointer"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Cursive Handwriting Accent Callout */}
        <div className="mt-6 mb-2 text-right pr-4 sm:pr-8 relative z-20 overflow-visible">
          <div className="inline-block transform -rotate-1 hover:rotate-0 transition-transform origin-right">
            <span className="handwriting-font text-xl sm:text-2xl md:text-3xl text-blue-600 tracking-wide font-bold block">
              Real Projects. Real Experience. Real Growth.
            </span>
            <svg className="w-full h-3 text-blue-600 mt-0.5" viewBox="0 0 200 12" fill="none" preserveAspectRatio="none">
              <path d="M4 8 C60 2, 140 10, 196 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

      </section>
      )}

      {/* EXPLORE OPPORTUNITIES SECTION */}
      {isSectionVisible('opportunities') && (
      <section id="explore-opportunities" className="pt-6 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <span className="text-xs font-extrabold text-blue-600 tracking-widest uppercase block mb-1">
              FEATURED OPPORTUNITIES
            </span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Featured Opportunities & Roles
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 font-semibold">
              Explore curated roles designed to give you real-world, industry-standard experience.
            </p>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                    : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {filteredOpportunities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredOpportunities.map(opp => (
              <div
                key={opp.id || opp._id}
                className="bg-white rounded-[2rem] p-7 border border-slate-200/80 shadow-xs hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      {(() => {
                        const compName = opp.company || opp.companyName || 'Opportunity';
                        const words = compName.split(' ').filter(Boolean);
                        const initials = words.length >= 2
                          ? `${words[0][0]}${words[1][0]}`.toUpperCase()
                          : compName.slice(0, 2).toUpperCase();
                        
                        const hash = compName.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
                        const palettes = [
                          { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
                          { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
                          { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
                          { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
                          { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
                        ];
                        const theme = palettes[hash % palettes.length];

                        return (
                          <div className={`w-12 h-12 rounded-2xl ${theme.bg} border ${theme.border} flex items-center justify-center overflow-hidden shrink-0 shadow-xs`}>
                            <span className={`font-black ${theme.text} text-sm tracking-wider`}>
                              {initials}
                            </span>
                          </div>
                        );
                      })()}
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <h4 className="font-extrabold text-slate-900 text-base leading-snug group-hover:text-blue-600 transition-colors">
                            {opp.title || opp.position}
                          </h4>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-slate-600 font-bold">
                            {opp.company || opp.companyName || 'Corporate Partner'}
                          </p>
                          {opp.partnerTier && (
                            <span className="text-[10px] font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200/80">
                              {opp.partnerTier}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      {opp.featured && (
                        <span className="px-3 py-1 rounded-full text-[10px] font-black bg-amber-50 text-amber-700 border border-amber-200 shadow-2xs">
                          ★ Featured
                        </span>
                      )}
                      {opp.ppoExpectation && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {opp.ppoExpectation}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 mb-4 font-semibold">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{opp.location || opp.workType || 'Remote'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Wallet className="w-3.5 h-3.5 text-slate-400" />
                      <span>{opp.stipend?.max ? `₹${opp.stipend.max}/mo` : opp.stipend || '₹40,000 / month'}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {(opp.tags || opp.requiredSkills || ['React', 'Node.js', 'Problem Solving']).map((tag: string, tIdx: number) => (
                      <span
                        key={tIdx}
                        className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 text-[11px] font-bold"
                      >
                        {typeof tag === 'string' ? tag : (tag as any).name || 'Skill'}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    Direct InterHive Application
                  </span>
                  <button
                    onClick={() => {
                      setSelectedProgramCategory(opp.category || opp.title || 'Software Engineering');
                      setIsInternshipModalOpen(true);
                    }}
                    className="px-5 py-2 rounded-full bg-blue-50 text-blue-600 font-extrabold text-xs hover:bg-blue-600 hover:text-white hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Apply Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-10 border border-slate-200/80 shadow-2xs text-center max-w-2xl mx-auto space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-xs">
              <Briefcase className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">Upcoming Cohort Roles Opening Soon</h3>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1 leading-relaxed max-w-md mx-auto">
                Company requirements for the next internship cohort are currently being prepared. Complete your assessment to receive early notification when applications open.
              </p>
            </div>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => {
                  setSelectedProgramTypeForModal('ppo_internship');
                  setIsInternshipModalOpen(true);
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer"
              >
                Apply for Next Cohort
              </button>
              <button
                onClick={() => setIsCompanyModalOpen(true)}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer"
              >
                Hire Interns as a Company
              </button>
            </div>
          </div>
        )}

      </section>
      )}

      {/* ============================================================== */}
      {/* 2.5 VERIFIED STUDENT STORIES & PPO PLACEMENTS                 */}
      {/* (ONLY RENDERED IF ADMIN ADDS REAL TESTIMONIALS IN ADMIN SETTINGS) */}
      {/* ============================================================== */}
      {isSectionVisible('testimonials') && publicTestimonials.length > 0 && (
        <section className="py-16 bg-gradient-to-b from-slate-50/80 via-white to-slate-50/60 border-y border-slate-200/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Section Header */}
            <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100/90 border border-blue-200/80 text-blue-800 text-xs font-extrabold shadow-xs">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>Verified Student Experiences</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                From College Campuses to Full-Time Careers
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-semibold max-w-2xl mx-auto">
                Read authentic feedback from students who transformed practical skills into verified internship and job opportunities.
              </p>
            </div>

            {/* Dynamic Student Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {publicTestimonials.map((t) => (
                <div
                  key={t._id}
                  className="bg-white rounded-[2rem] p-7 border border-slate-200/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        {t.avatar ? (
                          <img
                            src={t.avatar}
                            alt={t.name}
                            className="w-12 h-12 rounded-2xl object-cover shrink-0 border border-slate-200"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-base shadow-md shadow-blue-500/20 shrink-0">
                            {t.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-extrabold text-slate-900 text-base leading-snug">
                              {t.name}
                            </h4>
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          </div>
                          <p className="text-xs text-slate-500 font-semibold">
                            {t.college}{t.branch ? ` • ${t.branch}` : ''}
                          </p>
                        </div>
                      </div>

                      {t.package && (
                        <span className="px-3 py-1 rounded-full text-[11px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0 shadow-2xs">
                          {t.package}
                        </span>
                      )}
                    </div>

                    {(t.company || t.role) && (
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 mb-4 flex items-center justify-between">
                        {t.company && (
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Placed At</span>
                            <span className="text-xs font-black text-slate-800">{t.company}</span>
                          </div>
                        )}
                        {t.role && (
                          <span className="text-[10px] font-extrabold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-full">
                            {t.role}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="relative mb-4">
                      <Quote className="w-6 h-6 text-slate-200 absolute -top-2 -left-1 pointer-events-none" />
                      <p className="text-xs text-slate-700 leading-relaxed font-medium pl-6 italic">
                        "{t.review}"
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-500">
                    <span className="flex items-center gap-1 text-emerald-600">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Verified Review
                    </span>
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(t.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>
      )}

      {/* Equal Opportunity Trust Guarantee Banner */}
      {isSectionVisible('equalOpportunity') && (
      <section className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-50/90 via-white to-indigo-50/90 border border-blue-200/70 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h5 className="font-extrabold text-slate-900 text-sm sm:text-base">
                100% Equal Opportunity • Merit & Practical Skills First
              </h5>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                Whether you are from a tier-1 institute or a tier-3 college, your practical assessment scores and demonstrated project work determine your company matching.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setSelectedProgramTypeForModal('ppo_internship');
              setIsInternshipModalOpen(true);
            }}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-md shadow-blue-500/20 transition-all shrink-0 cursor-pointer"
          >
            Start Free Assessment →
          </button>
        </div>
      </section>
      )}

      {/* 3. "FOR STUDENTS" VS "FOR COMPANIES" TRUST BLOCK */}
      {isSectionVisible('dualTarget') && (
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Left Card — For Students */}
          <div className="bg-white rounded-[2.2rem] p-8 sm:p-10 border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-13 h-13 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200/80 flex items-center justify-center font-bold mb-6 shadow-xs">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="text-xs font-black text-blue-600 tracking-wider uppercase block mb-1">
                FOR ASPIRING TALENT
              </span>
              <h3 className="text-2xl font-black text-slate-900 mb-3">
                For Students
              </h3>
              <p className="text-sm text-slate-600 font-medium leading-relaxed mb-6">
                Build real, job-ready skills and get matched to internships that actually lead somewhere.
              </p>
            </div>

            <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
              <a
                href="#explore-opportunities"
                className="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Explore Internships</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <Link
                to="/programs"
                className="text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors"
              >
                View training tracks & programs →
              </Link>
            </div>
          </div>

          {/* Right Card — For Companies */}
          <div className="bg-white rounded-[2.2rem] p-8 sm:p-10 border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-13 h-13 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-200/80 flex items-center justify-center font-bold mb-6 shadow-xs">
                <Building2 className="w-6 h-6" />
              </div>
              <span className="text-xs font-black text-indigo-600 tracking-wider uppercase block mb-1">
                FOR HIRING PARTNERS
              </span>
              <h3 className="text-2xl font-black text-slate-900 mb-3">
                For Companies
              </h3>
              <p className="text-sm text-slate-600 font-medium leading-relaxed mb-6">
                Hire interns who've already been trained and assessed — not just resumes, but real, demonstrated skills.
              </p>
            </div>

            <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
              <button
                onClick={() => setIsCompanyModalOpen(true)}
                className="px-6 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <Building2 className="w-4 h-4 text-blue-400" />
                <span>Hire Interns</span>
              </button>
              <Link
                to="/contact"
                className="text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors"
              >
                Learn about hiring partnership →
              </Link>
            </div>
          </div>

        </div>
      </section>
      )}

      {/* 4. FAQ SECTION */}
      {isSectionVisible('faq') && (
      <section className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-10 space-y-2">
          <span className="text-xs font-extrabold text-blue-600 tracking-widest uppercase">
            COMMON QUESTIONS
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-semibold">
            Clear, honest answers about how InterHive works.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {activeFaqItems.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden transition-all duration-200 shadow-2xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/60 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="font-extrabold text-slate-900 text-sm sm:text-base">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-blue-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium border-t border-slate-100">
                    <p>{faq.answer}</p>
                    {faq.link && (
                      <div className="mt-2.5">
                        <Link
                          to={faq.link.to}
                          className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline"
                        >
                          <span>{faq.link.text}</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Small Outbound Help Link */}
        <div className="mt-6 text-center text-xs text-slate-500 font-medium">
          Have more questions?{' '}
          <Link to="/contact" className="text-blue-600 font-bold hover:underline">
            Reach out to our team
          </Link>
        </div>
      </section>
      )}

      {/* 5. NEWSLETTER / COHORT PLACEMENT ALERTS */}
      {isSectionVisible('newsletter') && (
      <section className="py-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-50/80 via-indigo-50/60 to-purple-50/80 rounded-3xl p-6 sm:p-8 border border-blue-100/90 text-center shadow-xs">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-blue-200/60 text-blue-700 text-[11px] font-bold shadow-2xs mb-3">
            <Bell className="w-3.5 h-3.5 text-blue-600" />
            <span>Placement & Batch Alerts</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-2">
            Never Miss a New Cohort or Corporate Opening
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 font-semibold mb-6 max-w-md mx-auto">
            Get instant email alerts when new internship roles, assessment windows, and hiring drives open for your college batch.
          </p>

          {newsletterSubscribed ? (
            <div className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>You're subscribed! We'll alert you the moment new cohort roles open.</span>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-2.5 max-w-md mx-auto">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your college email address"
                className="w-full sm:w-72 px-4 py-3 rounded-full bg-white border border-slate-200/90 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-2xs"
              />
              <button
                type="submit"
                disabled={newsletterLoading}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all shrink-0 cursor-pointer disabled:opacity-60"
              >
                <span>Get Role Alerts</span>
              </button>
            </form>
          )}
        </div>
      </section>
      )}

      {/* RESTORED: COMPANY OUTREACH CONNECT BAR (ABOVE FOOTER) */}
      {isSectionVisible('companyBar') && (
      <div className="py-6 bg-slate-900 text-center border-t border-slate-800">
        <button
          onClick={() => setIsCompanyModalOpen(true)}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs sm:text-sm font-bold transition-all shadow-sm hover:scale-105 active:scale-95 cursor-pointer"
        >
          <Building2 className="w-4 h-4 text-blue-400" />
          <span>Are you a company looking to connect? Click here →</span>
        </button>
      </div>
      )}

      {/* FOOTER */}
      <PublicFooter
        onOpenInternshipModal={() => setIsInternshipModalOpen(true)}
        onOpenCompanyModal={() => setIsCompanyModalOpen(true)}
      />

      {/* Company Connection Modal */}
      <CompanyInquiryModal
        isOpen={isCompanyModalOpen}
        onClose={() => setIsCompanyModalOpen(false)}
      />

      {/* Controlled-Access Internship Application Modal */}
      <InternshipApplicationModal
        isOpen={isInternshipModalOpen}
        onClose={() => setIsInternshipModalOpen(false)}
        preselectedCategory={selectedProgramCategory}
        preselectedProgramType={selectedProgramTypeForModal}
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
          setSelectedProgramTypeForModal('ppo_internship');
          setIsInternshipModalOpen(true);
        }}
      />

      {/* 2-Minute Quick Readiness Quiz Modal */}
      <QuickReadinessQuizModal
        isOpen={isQuizModalOpen}
        onClose={() => setIsQuizModalOpen(false)}
        onStartTrackApplication={(trackCat, progType) => {
          setSelectedProgramCategory(trackCat);
          setSelectedProgramTypeForModal(progType);
          setIsInternshipModalOpen(true);
        }}
      />

      {/* Sticky Persistent CTA Bar (Slides in smoothly after scrolling past hero) */}
      {showStickyCta && isSectionVisible('stickyCta') && (
        <aside aria-label="Quick application" className="fixed bottom-4 left-0 right-0 z-40 px-4 pointer-events-none animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="max-w-3xl mx-auto bg-slate-900/95 backdrop-blur-xl text-white rounded-2xl p-3 sm:p-3.5 shadow-2xl border border-slate-700/60 flex items-center justify-between gap-3 pointer-events-auto">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shrink-0 shadow-sm shadow-blue-500/30">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-xs sm:text-sm text-white">6-Month PPO Track</span>
                  <span className="text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full">
                    100% Free
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">
                  2 Months Training + 4 Months Company Internship • Direct PPO Evaluation
                </p>
              </div>
              <div className="sm:hidden">
                <span className="font-extrabold text-xs text-white block">6-Month PPO Track</span>
                <span className="text-[10px] text-slate-300 block">Training + Internship + PPO</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSelectedProgramTypeForModal('ppo_internship');
                  setIsInternshipModalOpen(true);
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm shadow-md shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5"
              >
                <span>Apply Free</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </aside>
      )}

    </div>
  );
};
