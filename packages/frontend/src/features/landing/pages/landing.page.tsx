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
  ChevronRight,
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
  Target
} from 'lucide-react';
import { companyApi } from '../../../api/endpoints/company.api';
import { statsApi, LandingStatItem } from '../../../api/endpoints/stats.api';
import { Logo } from '../../../shared/components/common/logo';
import { getLandingStats, LandingStats } from '../../../shared/utils/landing-stats';
import { InternshipApplicationModal } from '../components/internship-application-modal';
import { ProgramDetailsModal } from '../components/program-details-modal';
import { PublicNavbar } from '../components/public-navbar';
import { PublicFooter } from '../components/public-footer';
import { CompanyInquiryModal } from '../components/company-inquiry-modal';
import { PROGRAM_CONFIGS, PROGRAM_DISCLAIMER, ProgramTypeKey } from '@interhive/shared';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [liveRequirements, setLiveRequirements] = useState<any[]>([]);
  const [isInternshipModalOpen, setIsInternshipModalOpen] = useState(false);
  const [selectedProgramCategory, setSelectedProgramCategory] = useState('Software Engineering');
  const [selectedProgramTypeForModal, setSelectedProgramTypeForModal] = useState<string | undefined>(undefined);
  const [activeDetailsProgramType, setActiveDetailsProgramType] = useState<ProgramTypeKey | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

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

  const howItWorksSteps = [
    {
      step: '01',
      label: 'Step 1',
      title: 'Choose Your Year Program',
      desc: 'Select the program matched to your current college year (1st Year CRT foundation, 2nd/3rd Year industrial training, or Final Year placement sprint).',
      icon: GraduationCap,
      color: 'bg-blue-50 text-blue-600 border-blue-200/80',
      hoverBg: 'group-hover:bg-blue-600',
    },
    {
      step: '02',
      label: 'Step 2',
      title: 'Get Screened & Approved',
      desc: 'Undergo our skill evaluation and HR assessment to activate your official Premium Intern account.',
      icon: UserCheck,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-200/80',
      hoverBg: 'group-hover:bg-indigo-600',
    },
    {
      step: '03',
      label: 'Step 3',
      title: 'Build with Industry Mentors',
      desc: 'Join team cohorts with dedicated Manager & HR communication, agile task boards, and daily work verification.',
      icon: Users,
      color: 'bg-purple-50 text-purple-600 border-purple-200/80',
      hoverBg: 'group-hover:bg-purple-600',
    },
    {
      step: '04',
      label: 'Step 4',
      title: 'Partner Company Hiring',
      desc: 'Graduate with portfolio-grade work, verified project certificates, and direct interview opportunities with hiring partners.',
      icon: Briefcase,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200/80',
      hoverBg: 'group-hover:bg-emerald-600',
    },
  ];

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
      // 1. Try reading from cached stat items
      try {
        const cached = localStorage.getItem('interhive_landing_stat_items');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setDynamicLandingStats(parsed);
          }
        }
      } catch (e) {}

      // 2. Try reading from legacy landing stats editor key (topCompanies, activeInternships, etc)
      try {
        const legacy = localStorage.getItem('interhive_landing_stats');
        if (legacy) {
          const parsed = JSON.parse(legacy);
          if (parsed) {
            setDynamicLandingStats([
              { key: 'students_trained', label: 'Students Trained', value: parsed.studentsPlaced || '50K+', suffix: '', icon: 'Users', order: 1, useManualValue: true, manualValue: null, lastManualEditAt: null, lastEditedBy: null },
              { key: 'internships_provided', label: 'Internships Provided', value: parsed.activeInternships || '10K+', suffix: '', icon: 'Briefcase', order: 2, useManualValue: true, manualValue: null, lastManualEditAt: null, lastEditedBy: null },
              { key: 'partner_companies', label: 'Partner Companies', value: parsed.topCompanies || '500+', suffix: '', icon: 'Building2', order: 3, useManualValue: true, manualValue: null, lastManualEditAt: null, lastEditedBy: null },
              { key: 'ppo_conversion', label: 'User Rating / Conversion', value: parsed.userRating || '4.8/5', suffix: '', icon: 'Trophy', order: 4, useManualValue: true, manualValue: null, lastManualEditAt: null, lastEditedBy: null },
            ]);
          }
        }
      } catch (e) {}

      // 3. Fetch from backend API
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

  // Fetch live company requirements
  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
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
        // Fallback
      }
    };

    fetchOpportunities();
  }, []);

  const defaultOpportunities = [
    {
      id: '1',
      title: 'Full Stack Software Engineer Intern',
      company: 'NovaTech Solutions',
      logo: '',
      location: 'Remote / Hybrid',
      stipend: '₹45,000 / month',
      category: 'Software Engineering',
      requiredSkills: ['React.js', 'TypeScript', 'Node.js', 'System Design'],
      featured: true,
    },
    {
      id: '2',
      title: 'Frontend Developer Intern',
      company: 'Brightwave Digital',
      logo: '',
      location: 'Bangalore, India',
      stipend: '₹40,000 / month',
      category: 'Frontend',
      requiredSkills: ['React', 'Next.js', 'Tailwind CSS', 'Redux'],
      featured: true,
    },
    {
      id: '3',
      title: 'AI & Data Science Intern',
      company: 'Zenith Labs',
      logo: '',
      location: 'Hyderabad, India',
      stipend: '₹50,000 / month',
      category: 'AI & Data Science',
      requiredSkills: ['Python', 'PyTorch', 'SQL', 'Machine Learning'],
      featured: true,
    },
    {
      id: '4',
      title: 'UI/UX Product Design Intern',
      company: 'InterHive Studio',
      logo: '',
      location: 'Remote',
      stipend: '₹35,000 / month',
      category: 'UI/UX Design',
      requiredSkills: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
      featured: false,
    },
  ];

  const displayList = liveRequirements.length > 0 ? liveRequirements : defaultOpportunities;
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
      <section className="relative pt-6 pb-28 overflow-hidden bg-gradient-to-br from-[#EBF3FF] via-[#F4F8FC] to-[#F3E8FF]">
        
        {/* 100% Full-bleed Hero Background Image Spanning Entire Width (inset-0 w-full) */}
        <img
          src="/interhive_full_bg.png"
          alt="InterHive Hero Tech Campus Background"
          width={1920}
          height={1080}
          loading="eager"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover object-right-top opacity-80 mix-blend-multiply pointer-events-none z-0 max-w-full"
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
              
              {/* PPO Track Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100/90 border border-purple-200/80 text-purple-800 text-xs font-extrabold shadow-sm">
                <GraduationCap className="w-4 h-4 text-purple-600" />
                <span>6-Month PPO Track: 2 Months Training + 4 Months Company Internship</span>
              </div>

              {/* Headlines */}
              <div className="space-y-2">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.08]">
                  From Selection <br />
                  to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">PPO.</span>
                </h1>
                <p className="text-sm sm:text-base text-slate-600 font-semibold max-w-lg mx-auto lg:mx-0">
                  We prepare you, connect you with partner companies, and create a clear pathway to your full-time career.
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
                  <span className="text-[11px] font-bold text-slate-700 leading-snug">Partner</span>
                  <span className="text-[9px] text-slate-400 font-semibold">Companies</span>
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
                  <span className="text-[11px] font-bold text-slate-700 leading-snug">PPO</span>
                  <span className="text-[9px] text-slate-400 font-semibold">Opportunity</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => setIsInternshipModalOpen(true)}
                  className="px-7 py-3.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Join the PPO Track</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href="#how-it-works"
                  className="px-6 py-3.5 rounded-full bg-white text-slate-800 border border-slate-200/90 font-bold text-xs sm:text-sm shadow-xs hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center gap-2"
                >
                  <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center">
                    <Play className="w-3 h-3 text-slate-700 fill-slate-700 ml-0.5" />
                  </div>
                  <span>Watch How It Works</span>
                </a>
              </div>

            </div>

            {/* HERO RIGHT COLUMN (STUDENT DASHBOARD PREVIEW MATCHING REFERENCE IMAGE 1) */}
            <div className="lg:col-span-7 relative perspective-1000 py-6">
              
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
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-black flex items-center justify-center text-xs shadow-xs">
                          ih
                        </div>
                        <span className="font-extrabold text-slate-900 text-sm">InterHive</span>
                      </div>
                      <div className="h-4 w-px bg-slate-200 hidden sm:block" />
                      <div>
                        <h4 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1.5 leading-none">
                          Welcome, Ankit 👋
                        </h4>
                        <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
                          Your PPO journey is in progress. Keep going!
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                        <Bell className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex items-center gap-1.5 pl-2 border-l border-slate-100">
                        <div className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shadow-xs">
                          A
                        </div>
                        <span className="text-xs font-bold text-slate-700 hidden sm:inline">Ankit Soni</span>
                        <ChevronDown className="w-3 h-3 text-slate-400" />
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
                            PPO Track — Software Engineering
                          </span>
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                            In Progress
                          </span>
                        </div>

                        {/* Progress Bar 60% */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-extrabold text-slate-500">
                            <span>Journey Progress</span>
                            <span className="text-blue-600">60%</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500" style={{ width: '60%' }} />
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
                              <span className="text-[8px] font-black text-slate-600 mt-1">InterHive Training</span>
                            </div>
                            <div className="flex-1 h-0.5 bg-blue-600 mx-1" />

                            {/* Step 4: Company Matching (ACTIVE) */}
                            <div className="flex flex-col items-center">
                              <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-black shadow-xs ring-4 ring-blue-100">
                                4
                              </div>
                              <span className="text-[8px] font-black text-blue-600 mt-1">Company Matching</span>
                            </div>
                            <div className="flex-1 h-0.5 bg-slate-200 mx-1" />

                            {/* Step 5: Company Internship */}
                            <div className="flex flex-col items-center opacity-50">
                              <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[10px] font-bold">
                                5
                              </div>
                              <span className="text-[8px] font-bold text-slate-500 mt-1">Company Internship</span>
                            </div>
                            <div className="flex-1 h-0.5 bg-slate-200 mx-1" />

                            {/* Step 6: Evaluation */}
                            <div className="flex flex-col items-center opacity-50">
                              <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[10px] font-bold">
                                6
                              </div>
                              <span className="text-[8px] font-bold text-slate-500 mt-1">Evaluation</span>
                            </div>
                            <div className="flex-1 h-0.5 bg-slate-200 mx-1" />

                            {/* Step 7: PPO */}
                            <div className="flex flex-col items-center opacity-50">
                              <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[10px] font-bold">
                                7
                              </div>
                              <span className="text-[8px] font-bold text-slate-500 mt-1">PPO</span>
                            </div>

                          </div>
                        </div>

                      </div>

                      {/* 2 Subcards Side by Side from Reference Image 1 */}
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                        
                        {/* Current Stage Card */}
                        <div className="sm:col-span-7 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col justify-between">
                          <div>
                            <span className="text-[9px] font-black tracking-wider text-slate-400 uppercase block mb-1">
                              Current Stage
                            </span>
                            <div className="flex items-start gap-2.5">
                              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                <Building2 className="w-5 h-5" />
                              </div>
                              <div>
                                <h5 className="font-black text-slate-900 text-xs">
                                  Company Matching
                                </h5>
                                <p className="text-[10px] text-slate-500 leading-tight mt-0.5 font-medium">
                                  We are matching you with the best partner companies based on your skills and performance.
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => setIsInternshipModalOpen(true)}
                            className="mt-2.5 w-full py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-extrabold text-[10px] transition-colors cursor-pointer"
                          >
                            View Matched Companies →
                          </button>
                        </div>

                        {/* Training Completion Card */}
                        <div className="sm:col-span-5 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-black tracking-wider text-slate-400 uppercase">
                                Training Completion
                              </span>
                              <span className="text-[10px] font-black text-emerald-600">100%</span>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-slate-100 mt-1.5 overflow-hidden">
                              <div className="h-full bg-emerald-500 rounded-full w-full" />
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-1 pt-2 text-center border-t border-slate-100 mt-2">
                            <div>
                              <span className="block text-[8px] text-slate-400 font-bold uppercase">Modules</span>
                              <span className="text-[10px] font-black text-slate-800">12/12</span>
                            </div>
                            <div>
                              <span className="block text-[8px] text-slate-400 font-bold uppercase">Projects</span>
                              <span className="text-[10px] font-black text-slate-800">5/5</span>
                            </div>
                            <div>
                              <span className="block text-[8px] text-slate-400 font-bold uppercase">Tests</span>
                              <span className="text-[10px] font-black text-slate-800">8/8</span>
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

      {/* ============================================================== */}
      {/* 1. YOUR JOURNEY TO A PPO (MATCHING REFERENCE IMAGE 1)          */}
      {/* ============================================================== */}
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

        {/* 7 Horizontal Step Cards with Progression Connectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 relative">
          
          {/* Step 1: Apply & Assessment */}
          <div className="bg-blue-50/70 border border-blue-200/70 rounded-2xl p-4 flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all">
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
          <div className="bg-purple-50/70 border border-purple-200/70 rounded-2xl p-4 flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all">
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
          <div className="bg-emerald-50/70 border border-emerald-200/70 rounded-2xl p-4 flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all">
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
          <div className="bg-amber-50/70 border border-amber-200/70 rounded-2xl p-4 flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all">
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
          <div className="bg-rose-50/70 border border-rose-200/70 rounded-2xl p-4 flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all">
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
          <div className="bg-indigo-50/70 border border-indigo-200/70 rounded-2xl p-4 flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all">
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
          <div className="bg-blue-100/70 border border-blue-300/80 rounded-2xl p-4 flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all">
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
              <h5 className="font-extrabold text-slate-900 text-xs">100+ Partner Companies</h5>
              <p className="text-[10px] text-slate-500 font-medium">Across multiple domains</p>
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

      {/* ============================================================== */}
      {/* STRUCTURED INDUSTRY-READINESS PROGRAMS (1, 2, 3 & 4 YEAR)     */}
      {/* ============================================================== */}
      <section id="our-programs" className="py-14 bg-gradient-to-b from-white via-slate-50/50 to-white border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
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

          {/* 4 Program Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(Object.values(PROGRAM_CONFIGS) as any[]).map((prog) => (
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

      {/* ============================================================== */}
      {/* 2. OUR PARTNER COMPANIES (MATCHING REFERENCE IMAGE 1)         */}
      {/* ============================================================== */}
      <section className="py-12 bg-slate-50/70 border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Our Partner Companies
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
                We work with leading companies through MOUs to provide internship and PPO opportunities.
              </p>
            </div>
            <button
              onClick={() => setIsCompanyModalOpen(true)}
              className="text-xs font-extrabold text-blue-600 hover:text-blue-700 flex items-center gap-1 group shrink-0 cursor-pointer"
            >
              <span>View All Partners</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Company Brand Badges Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-3">
            
            <div className="bg-white rounded-xl p-3 border border-slate-200/80 flex items-center justify-center h-14 shadow-2xs hover:shadow-md transition-shadow">
              <span className="font-black text-slate-800 text-sm tracking-widest text-[#004B87]">TATA</span>
            </div>

            <div className="bg-white rounded-xl p-3 border border-slate-200/80 flex items-center justify-center gap-1.5 h-14 shadow-2xs hover:shadow-md transition-shadow">
              <div className="grid grid-cols-2 gap-0.5 w-3.5 h-3.5 shrink-0">
                <span className="bg-[#F25022] rounded-2xs" />
                <span className="bg-[#7FBA00] rounded-2xs" />
                <span className="bg-[#00A4EF] rounded-2xs" />
                <span className="bg-[#FFB900] rounded-2xs" />
              </div>
              <span className="font-bold text-slate-700 text-xs">Microsoft</span>
            </div>

            <div className="bg-white rounded-xl p-3 border border-slate-200/80 flex items-center justify-center h-14 shadow-2xs hover:shadow-md transition-shadow">
              <span className="font-bold text-sm tracking-tight">
                <span className="text-[#4285F4]">G</span>
                <span className="text-[#EA4335]">o</span>
                <span className="text-[#FBBC05]">o</span>
                <span className="text-[#4285F4]">g</span>
                <span className="text-[#34A853]">l</span>
                <span className="text-[#EA4335]">e</span>
              </span>
            </div>

            <div className="bg-white rounded-xl p-3 border border-slate-200/80 flex items-center justify-center h-14 shadow-2xs hover:shadow-md transition-shadow">
              <span className="font-black text-slate-900 text-xs tracking-tight">amazon</span>
            </div>

            <div className="bg-white rounded-xl p-3 border border-slate-200/80 flex items-center justify-center h-14 shadow-2xs hover:shadow-md transition-shadow">
              <span className="font-black text-[#007CC3] text-xs">Infosys</span>
            </div>

            <div className="bg-white rounded-xl p-3 border border-slate-200/80 flex items-center justify-center h-14 shadow-2xs hover:shadow-md transition-shadow">
              <span className="font-extrabold text-[#A100FF] text-xs">accenture</span>
            </div>

            <div className="bg-white rounded-xl p-3 border border-slate-200/80 flex items-center justify-center h-14 shadow-2xs hover:shadow-md transition-shadow">
              <span className="font-black text-slate-900 text-xs">Deloitte<span className="text-[#86BC25]">.</span></span>
            </div>

            <div className="bg-white rounded-xl p-3 border border-slate-200/80 flex items-center justify-center h-14 shadow-2xs hover:shadow-md transition-shadow">
              <span className="font-extrabold text-[#0070AD] text-[11px]">Capgemini</span>
            </div>

            <div className="bg-white rounded-xl p-3 border border-slate-200/80 flex items-center justify-center h-14 shadow-2xs hover:shadow-md transition-shadow">
              <span className="font-black text-[#00529B] text-xs tracking-wider">HCL</span>
            </div>

            <div className="bg-white rounded-xl p-3 border border-slate-200/80 flex items-center justify-center h-14 shadow-2xs hover:shadow-md transition-shadow">
              <span className="font-black text-slate-800 text-xs">wipro<span className="text-orange-500">.</span></span>
            </div>

          </div>

          {/* 4 Stats Cards dynamically loaded from Admin / System sync */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-slate-200/70">
            {(dynamicLandingStats.length > 0 ? dynamicLandingStats : [
              { key: 'students_trained', label: 'Students Trained', value: 5000, suffix: '+', icon: 'Users' },
              { key: 'internships_provided', label: 'Internships Provided', value: 1200, suffix: '+', icon: 'Briefcase' },
              { key: 'partner_companies', label: 'Partner Companies', value: 80, suffix: '+', icon: 'Building2' },
              { key: 'ppo_conversion', label: 'PPO Conversion Rate', value: 70, suffix: '%+', icon: 'Trophy' },
            ]).map((stat, idx) => {
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

      {/* 1. HOW IT WORKS SECTION */}
      <section id="how-it-works" className="pt-16 pb-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100/90 border border-blue-200/80 text-blue-800 text-xs font-extrabold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Year-Wise Career Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            How It Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-semibold max-w-xl mx-auto">
            Structured progression from college fundamentals to industry-ready hiring.
          </p>
        </div>

        {/* 4 Steps Horizontal on Desktop, Stacking on Mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {howItWorksSteps.map((step, idx) => (
            <div key={idx} className="relative group">
              <div className="h-full bg-white rounded-[2rem] p-7 border border-slate-200/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-13 h-13 rounded-2xl ${step.color} flex items-center justify-center font-bold shadow-xs group-hover:scale-110 ${step.hoverBg} group-hover:text-white transition-all`}>
                      <step.icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-black text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200/60">
                      {step.step}
                    </span>
                  </div>
                  <div className="text-[11px] font-extrabold text-blue-600 tracking-wider uppercase mb-1">
                    {step.label}
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                    {step.desc}
                  </p>
                </div>
              </div>

              {/* Connecting Progression Indicator for Desktop (steps 1, 2, 3) */}
              {idx < howItWorksSteps.length - 1 && (
                <div className="hidden lg:flex absolute top-1/2 -right-4 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white border border-slate-200/90 shadow-xs items-center justify-center pointer-events-none text-slate-400">
                  <ChevronRight className="w-4 h-4 text-blue-500" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 2. WHY INTERHIVE / TRUST & DIFFERENTIATION SECTION */}
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

      {/* FEATURE GRID SECTION */}
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
              <a 
                href="#how-it-works" 
                className="w-9 h-9 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
              </a>
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

      {/* EXPLORE OPPORTUNITIES SECTION */}
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
                      
                      const colorPalettes: Record<string, { bg: string; text: string; border: string }> = {
                        'NovaTech Solutions': { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
                        'Brightwave Digital': { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' },
                        'Zenith Labs': { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' },
                        'InterHive Studio': { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' },
                      };
                      const theme = colorPalettes[compName] || {
                        bg: 'bg-indigo-100',
                        text: 'text-indigo-700',
                        border: 'border-indigo-200',
                      };

                      return (
                        <div className={`w-12 h-12 rounded-2xl ${theme.bg} border ${theme.border} flex items-center justify-center overflow-hidden shrink-0 shadow-xs`}>
                          <span className={`font-black ${theme.text} text-sm tracking-wider`}>
                            {initials}
                          </span>
                        </div>
                      );
                    })()}
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-base leading-snug group-hover:text-blue-600 transition-colors">
                        {opp.title || opp.position}
                      </h4>
                      <p className="text-xs text-slate-500 font-semibold">
                        {opp.company || opp.companyName || 'Sample Partner'}
                      </p>
                    </div>
                  </div>

                  {opp.featured && (
                    <span className="px-3 py-1 rounded-full text-[10px] font-black bg-amber-50 text-amber-700 border border-amber-200 shrink-0 shadow-2xs">
                      ★ Featured
                    </span>
                  )}
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

      </section>

      {/* 3. "FOR STUDENTS" VS "FOR COMPANIES" TRUST BLOCK */}
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

      {/* 4. FAQ SECTION */}
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
          {faqItems.map((faq, index) => {
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

      {/* 5. NEWSLETTER / EARLY-ACCESS SIGNUP */}
      <section className="py-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-50/80 via-indigo-50/60 to-purple-50/80 rounded-3xl p-6 sm:p-8 border border-blue-100/90 text-center shadow-xs">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-blue-200/60 text-blue-700 text-[11px] font-bold shadow-2xs mb-3">
            <Sparkles className="w-3 h-3 text-blue-600" />
            <span>Early Access Updates</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-2">
            Be the first to know
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 font-semibold mb-6 max-w-md mx-auto">
            Get notified as we add new opportunities and companies.
          </p>

          {newsletterSubscribed ? (
            <div className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>You're on the list! We'll notify you as new opportunities launch.</span>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-2.5 max-w-md mx-auto">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full sm:w-72 px-4 py-3 rounded-full bg-white border border-slate-200/90 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-2xs"
              />
              <button
                type="submit"
                disabled={newsletterLoading}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all shrink-0 cursor-pointer disabled:opacity-60"
              >
                <span>Notify Me</span>
              </button>
            </form>
          )}
        </div>
      </section>

      {/* RESTORED: COMPANY OUTREACH CONNECT BAR (ABOVE FOOTER) */}
      <div className="py-6 bg-slate-900 text-center border-t border-slate-800">
        <button
          onClick={() => setIsCompanyModalOpen(true)}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs sm:text-sm font-bold transition-all shadow-sm hover:scale-105 active:scale-95 cursor-pointer"
        >
          <Building2 className="w-4 h-4 text-blue-400" />
          <span>Are you a company looking to connect? Click here →</span>
        </button>
      </div>

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

    </div>
  );
};
