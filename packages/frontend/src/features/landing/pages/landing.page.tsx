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
  DollarSign,
  Mail,
  CheckCircle2,
  X,
  ExternalLink,
  Award,
  Layers,
  BookOpen
} from 'lucide-react';
import { companyApi } from '../../../api/endpoints/company.api';
import { Logo } from '../../../shared/components/common/logo';
import { getLandingStats, LandingStats } from '../../../shared/utils/landing-stats';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [liveRequirements, setLiveRequirements] = useState<any[]>([]);

  // Dynamic Landing Page Metrics
  const [statsData, setStatsData] = useState<LandingStats>(getLandingStats());

  useEffect(() => {
    const handleStatsUpdate = () => {
      setStatsData(getLandingStats());
    };
    window.addEventListener('landing-stats-updated', handleStatsUpdate);
    return () => {
      window.removeEventListener('landing-stats-updated', handleStatsUpdate);
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
  const [companyForm, setCompanyForm] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    techStack: '',
    internCount: '1-5',
    message: '',
  });
  const [companySubmitted, setCompanySubmitted] = useState(false);
  const [isSubmittingCompany, setIsSubmittingCompany] = useState(false);

  const handleCompanySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingCompany(true);
    try {
      await companyApi.submitInquiry(companyForm);
    } catch (err) {
      // Fallback handling
    } finally {
      setIsSubmittingCompany(false);
      setCompanySubmitted(true);
      setTimeout(() => {
        setCompanySubmitted(false);
        setIsCompanyModalOpen(false);
        setCompanyForm({
          companyName: '',
          contactPerson: '',
          email: '',
          phone: '',
          techStack: '',
          internCount: '1-5',
          message: '',
        });
      }, 3500);
    }
  };

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
      company: 'Google',
      logo: 'https://www.google.com/favicon.ico',
      location: 'Remote / Hybrid',
      stipend: '₹45,000 / month',
      category: 'Software Engineering',
      requiredSkills: ['React.js', 'TypeScript', 'Node.js', 'System Design'],
      featured: true,
    },
    {
      id: '2',
      title: 'Frontend Developer Intern',
      company: 'Microsoft',
      logo: 'https://www.microsoft.com/favicon.ico',
      location: 'Bangalore, India',
      stipend: '₹40,000 / month',
      category: 'Frontend',
      requiredSkills: ['React', 'Next.js', 'Tailwind CSS', 'Redux'],
      featured: true,
    },
    {
      id: '3',
      title: 'AI & Data Science Intern',
      company: 'Amazon',
      logo: 'https://www.amazon.com/favicon.ico',
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
      <nav className="sticky top-0 z-50 bg-white/85 backdrop-blur-xl border-b border-slate-200/60 shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 p-0.5 shadow-md shadow-blue-500/30 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                  <span className="font-black text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                    H
                  </span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-slate-900 leading-none">
                  Inter<span className="text-blue-600">Hive</span>
                </span>
                <span className="text-[10px] font-bold text-slate-400 tracking-wide mt-0.5">
                  From Intern to Industry
                </span>
              </div>
            </Link>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8 font-bold text-sm text-slate-600">
            <a href="#" className="text-blue-600 relative py-1 border-b-2 border-blue-600">
              Home
            </a>
            <a href="#explore-opportunities" className="hover:text-blue-600 transition-colors">
              Internships
            </a>
            <a href="#explore-opportunities" className="hover:text-blue-600 transition-colors">
              Jobs
            </a>
            <button onClick={() => setIsCompanyModalOpen(true)} className="hover:text-blue-600 transition-colors">
              Companies
            </button>
            <a href="#features" className="hover:text-blue-600 transition-colors">
              Resources
            </a>
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center relative w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search internships, jobs, skills..."
              className="w-full pl-10 pr-4 py-2 bg-slate-100/90 border border-slate-200/80 rounded-full text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:bg-white transition-all shadow-inner"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-5 py-2.5 rounded-full font-extrabold text-xs sm:text-sm text-slate-700 hover:text-blue-600 hover:bg-slate-100/80 transition-all"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-6 py-2.5 rounded-full font-extrabold text-xs sm:text-sm text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:shadow-lg hover:shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all"
            >
              Sign Up
            </Link>
          </div>

        </div>
      </nav>

      {/* 100% FULL-BLEED HERO SECTION WITH FULL PAGE COVERAGE */}
      <section className="relative pt-6 pb-28 overflow-hidden bg-gradient-to-br from-[#EBF3FF] via-[#F4F8FC] to-[#F3E8FF]">
        
        {/* 100% Full-bleed Hero Background Image Spanning Entire Width (inset-0 w-full) */}
        <img
          src="/interhive_full_bg.png"
          alt="InterHive Hero Tech Campus Background"
          className="absolute inset-0 w-full h-full object-cover object-right-top opacity-80 mix-blend-multiply pointer-events-none z-0"
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
              
              {/* Mission Pill */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100/90 border border-purple-200/80 text-purple-800 text-xs font-extrabold shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>Your Career. Our Mission.</span>
              </div>

              {/* Headlines */}
              <div className="space-y-2">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.08]">
                  From Learning <br />
                  to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">Earning.</span>
                </h1>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  From Intern to Industry.
                </h2>
              </div>

              {/* Subtitle */}
              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-lg mx-auto lg:mx-0">
                InterHive connects students with top companies, real-world internships, and job opportunities — while helping you build skills, gain experience and become industry-ready.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <a
                  href="#explore-opportunities"
                  className="px-7 py-3.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                >
                  <span>Explore Internships</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

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

              {/* HERO STATS ROW (MATCHING REFERENCE IMAGE EXACTLY) */}
              <div className="pt-6 relative rounded-2xl p-4 bg-white/60 backdrop-blur-md border border-white/90 shadow-sm">
                {/* Subtle Background Dot Grid */}
                <div className="absolute inset-0 opacity-40 pointer-events-none rounded-2xl bg-[radial-gradient(#93c5fd_1.2px,transparent_1.2px)] [background-size:18px_18px]" />

                <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-4 items-center">
                  
                  {/* Top Companies */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#EBF3FF] border border-[#BFDBFE] text-[#2563EB] flex items-center justify-center shrink-0 shadow-xs">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block font-black text-slate-900 text-base leading-tight">
                        {statsData.topCompanies}
                      </span>
                      <span className="block text-[11px] text-slate-500 font-extrabold leading-tight">
                        Top <br /> Companies
                      </span>
                    </div>
                  </div>

                  {/* Active Internships */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#F3E8FF] border border-[#E9D5FF] text-[#9333EA] flex items-center justify-center shrink-0 shadow-xs">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block font-black text-slate-900 text-base leading-tight">
                        {statsData.activeInternships}
                      </span>
                      <span className="block text-[11px] text-slate-500 font-extrabold leading-tight">
                        Active <br /> Internships
                      </span>
                    </div>
                  </div>

                  {/* Students Placed */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#DCFCE7] border border-[#BBF7D0] text-[#16A34A] flex items-center justify-center shrink-0 shadow-xs">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block font-black text-slate-900 text-base leading-tight">
                        {statsData.studentsPlaced}
                      </span>
                      <span className="block text-[11px] text-slate-500 font-extrabold leading-tight">
                        Students <br /> Placed
                      </span>
                    </div>
                  </div>

                  {/* User Rating */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-[#D97706] flex items-center justify-center shrink-0 shadow-xs">
                      <Star className="w-5 h-5 fill-[#D97706] text-[#D97706]" />
                    </div>
                    <div>
                      <span className="block font-black text-slate-900 text-base leading-tight">
                        {statsData.userRating}
                      </span>
                      <span className="block text-[11px] text-slate-500 font-extrabold leading-tight">
                        User <br /> Rating
                      </span>
                    </div>
                  </div>

                </div>
              </div>

            </div>

            {/* HERO RIGHT COLUMN (FLOATING 3D GLASS DASHBOARD) */}
            <div className="lg:col-span-7 relative perspective-1000 py-6">
              
              <div 
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="relative mx-auto max-w-xl lg:max-w-none transition-transform duration-200 ease-out preserve-3d"
                style={{
                  transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.01, 1.01, 1.01)`
                }}
              >
                
                {/* 3D Glass Dashboard Card */}
                <div className="w-full bg-white/95 backdrop-blur-2xl p-6 sm:p-8 rounded-[2.2rem] border border-white/90 shadow-2xl preserve-3d relative z-10">
                  
                  {/* Specular Light Overlay */}
                  <div 
                    className="absolute inset-0 pointer-events-none transition-opacity duration-300 rounded-[2.2rem]"
                    style={{
                      background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.7) 0%, transparent 65%)`,
                      opacity: glare.opacity
                    }}
                  />

                  {/* Header Bar */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-black flex items-center justify-center text-xs shadow-md shadow-blue-500/30">
                        H
                      </div>
                      <span className="font-extrabold text-slate-900 text-sm">InterHive Dashboard</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] font-bold text-slate-400">Live Status</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-4">
                    
                    {/* Sidebar */}
                    <div className="col-span-4 space-y-1.5 border-r border-slate-100 pr-3">
                      <div className="px-3 py-2 rounded-xl bg-blue-50 text-blue-600 font-extrabold text-xs flex items-center gap-2 shadow-xs">
                        <span>🏠</span>
                        <span>Home</span>
                      </div>
                      <div className="px-3 py-2 text-slate-500 font-bold text-xs flex items-center gap-2 hover:bg-slate-50 rounded-xl transition-colors">
                        <span>💼</span>
                        <span>Internships</span>
                      </div>
                      <div className="px-3 py-2 text-slate-500 font-bold text-xs flex items-center gap-2 hover:bg-slate-50 rounded-xl transition-colors">
                        <span>👔</span>
                        <span>Jobs</span>
                      </div>
                      <div className="px-3 py-2 text-slate-500 font-bold text-xs flex items-center gap-2 hover:bg-slate-50 rounded-xl transition-colors">
                        <span>📋</span>
                        <span>My Apps</span>
                      </div>
                      <div className="px-3 py-2 text-slate-500 font-bold text-xs flex items-center gap-2 hover:bg-slate-50 rounded-xl transition-colors">
                        <span>👤</span>
                        <span>Profile</span>
                      </div>
                    </div>

                    {/* Main Content inside Card */}
                    <div className="col-span-8 space-y-3.5">
                      <div>
                        <h5 className="font-black text-slate-900 text-sm flex items-center gap-1.5">
                          <span>Good Morning, Developer</span>
                          <span>👋</span>
                        </h5>
                        <p className="text-[10px] text-slate-400 font-semibold">Your next big opportunity is just a step away.</p>
                      </div>

                      {/* Mini Search */}
                      <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                        <div className="w-full pl-7 pr-3 py-1.5 bg-slate-50 border border-slate-200/70 rounded-lg text-[10px] text-slate-400 font-medium">
                          Search internships, jobs, companies...
                        </div>
                      </div>

                      {/* KPI Stat Cards */}
                      <div className="grid grid-cols-4 gap-1.5 text-center">
                        <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                          <span className="block font-black text-slate-900 text-sm">12</span>
                          <span className="text-[8px] text-slate-400 font-extrabold">Applied</span>
                        </div>
                        <div className="bg-blue-50/80 p-2 rounded-xl border border-blue-100/80">
                          <span className="block font-black text-blue-600 text-sm">3</span>
                          <span className="text-[8px] text-blue-500 font-extrabold">Shortlisted</span>
                        </div>
                        <div className="bg-purple-50/80 p-2 rounded-xl border border-purple-100/80">
                          <span className="block font-black text-purple-600 text-sm">1</span>
                          <span className="text-[8px] text-purple-500 font-extrabold">Interview</span>
                        </div>
                        <div className="bg-emerald-50/80 p-2 rounded-xl border border-emerald-100/80">
                          <span className="block font-black text-emerald-600 text-sm">0</span>
                          <span className="text-[8px] text-emerald-500 font-extrabold">Offer</span>
                        </div>
                      </div>

                      {/* Recommended Opportunities */}
                      <div className="space-y-2 pt-1">
                        <div className="flex items-center justify-between text-[10px] font-extrabold text-slate-500">
                          <span>Recommended for you</span>
                          <span className="text-blue-600 hover:underline cursor-pointer">View all →</span>
                        </div>

                        <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-[10px] hover:bg-slate-100/80 transition-colors">
                          <div className="flex items-center gap-2">
                            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4 object-contain" />
                            <div>
                              <span className="font-extrabold text-slate-900 block leading-none">Google</span>
                              <span className="text-[9px] text-slate-500 font-semibold">Software Engineering Intern</span>
                            </div>
                          </div>
                          <span className="text-[8px] font-black text-blue-600 bg-blue-100/80 px-1.5 py-0.5 rounded">Featured</span>
                        </div>

                        <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-[10px] hover:bg-slate-100/80 transition-colors">
                          <div className="flex items-center gap-2">
                            <img src="https://www.microsoft.com/favicon.ico" alt="Microsoft" className="w-4 h-4 object-contain" />
                            <div>
                              <span className="font-extrabold text-slate-900 block leading-none">Microsoft</span>
                              <span className="text-[9px] text-slate-500 font-semibold">Product Intern</span>
                            </div>
                          </div>
                          <span className="text-[8px] font-bold text-slate-400">Hybrid</span>
                        </div>
                      </div>

                    </div>
                  </div>

                </div>

                {/* FLOATING 3D ACTION BADGES */}
                <div 
                  className="hidden sm:block absolute -top-4 -right-2 z-30 animate-float-slow"
                  style={{ transform: 'translateZ(50px)' }}
                >
                  <div className="px-4 py-2.5 rounded-2xl bg-white/95 backdrop-blur-xl shadow-2xl border border-white/90 text-xs font-black text-slate-800 flex items-center gap-2.5 transform hover:scale-110 transition-transform">
                    <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                      <Code className="w-3.5 h-3.5" />
                    </div>
                    <span>Build Skills</span>
                  </div>
                </div>

                <div 
                  className="hidden sm:block absolute top-28 -right-6 sm:-right-8 z-30 animate-float-medium"
                  style={{ transform: 'translateZ(65px)' }}
                >
                  <div className="px-4 py-2.5 rounded-2xl bg-white/95 backdrop-blur-xl shadow-2xl border border-white/90 text-xs font-black text-slate-800 flex items-center gap-2.5 transform hover:scale-110 transition-transform">
                    <div className="w-6 h-6 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                      <Briefcase className="w-3.5 h-3.5" />
                    </div>
                    <span>Get Hired</span>
                  </div>
                </div>

                <div 
                  className="hidden sm:block absolute bottom-6 -right-3 sm:-right-5 z-30 animate-float-fast"
                  style={{ transform: 'translateZ(55px)' }}
                >
                  <div className="px-4 py-2.5 rounded-2xl bg-white/95 backdrop-blur-xl shadow-2xl border border-white/90 text-xs font-black text-slate-800 flex items-center gap-2.5 transform hover:scale-110 transition-transform">
                    <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <TrendingUp className="w-3.5 h-3.5" />
                    </div>
                    <span>Grow</span>
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

      {/* FEATURE GRID SECTION */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
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
        <div className="mt-14 text-right pr-4 sm:pr-8">
          <div className="inline-block transform -rotate-2 hover:rotate-0 transition-transform">
            <span className="handwriting-font text-3xl sm:text-4xl text-blue-600 tracking-wide font-bold whitespace-nowrap block">
              Real Projects. Real Experience. Real Growth.
            </span>
            <svg className="w-full h-3 text-blue-600 mt-0.5" viewBox="0 0 200 12" fill="none">
              <path d="M4 8 C60 2, 140 10, 196 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

      </section>

      {/* EXPLORE OPPORTUNITIES SECTION */}
      <section id="explore-opportunities" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-xs font-extrabold text-blue-600 tracking-widest uppercase block mb-1">
              LIVE PLACEMENT PIPELINE
            </span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Featured Internships & Opportunities
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 font-semibold">
              Explore opportunities pre-matched to industry readiness benchmarks.
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
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
                      {opp.logo ? (
                        <img src={opp.logo} alt={opp.company || opp.companyName} className="w-7 h-7 object-contain" />
                      ) : (
                        <span className="font-black text-blue-600 text-lg">
                          {(opp.company || opp.companyName || 'C')[0]}
                        </span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-base leading-snug group-hover:text-blue-600 transition-colors">
                        {opp.title || opp.position}
                      </h4>
                      <p className="text-xs text-slate-500 font-semibold">
                        {opp.company || opp.companyName || 'Partner Company'}
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
                    <DollarSign className="w-3.5 h-3.5 text-slate-400" />
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
                <span className="text-xs font-bold text-slate-400">Apply via InterHive</span>
                <Link
                  to="/register"
                  className="px-5 py-2 rounded-full bg-blue-50 text-blue-600 font-extrabold text-xs hover:bg-blue-600 hover:text-white hover:shadow-md transition-all flex items-center gap-1.5"
                >
                  <span>Apply Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* RESTORED: COMPANY OUTREACH CONNECT BAR (ABOVE FOOTER) */}
      <div className="py-6 bg-slate-900 text-center border-t border-slate-800">
        <button
          onClick={() => setIsCompanyModalOpen(true)}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs sm:text-sm font-bold transition-all shadow-sm hover:scale-105 active:scale-95"
        >
          <Building2 className="w-4 h-4 text-blue-400" />
          <span>Are you a company looking to connect? Click here →</span>
        </button>
      </div>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-300 py-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-blue-600 text-white font-black flex items-center justify-center text-lg">
                  H
                </div>
                <span className="text-xl font-black tracking-tight text-white">
                  Inter<span className="text-blue-500">Hive</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">
                Empowering students from learning to earning. Connecting talent with top companies worldwide.
              </p>
            </div>

            <div>
              <h5 className="text-sm font-black text-white mb-4">For Students</h5>
              <ul className="space-y-2.5 text-xs text-slate-300 font-semibold">
                <li><a href="#explore-opportunities" className="hover:text-blue-400 transition-colors">Explore Internships</a></li>
                <li><a href="#how-it-works" className="hover:text-blue-400 transition-colors">Readiness Assessment</a></li>
                <li><Link to="/register" className="hover:text-blue-400 transition-colors">Student Registration</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="text-sm font-black text-white mb-4">For Companies</h5>
              <ul className="space-y-2.5 text-xs text-slate-300 font-semibold">
                <li>
                  <button onClick={() => setIsCompanyModalOpen(true)} className="hover:text-blue-400 transition-colors text-left">
                    Hire Trained Interns
                  </button>
                </li>
                <li>
                  <button onClick={() => setIsCompanyModalOpen(true)} className="hover:text-blue-400 transition-colors text-left">
                    Employer Credentials
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="text-sm font-black text-white mb-4">Contact & Support</h5>
              <p className="text-xs text-slate-400 font-medium mb-3">Have questions? Reach out to our team:</p>
              <a href="mailto:interhive.info@gmail.com" className="text-xs font-extrabold text-blue-400 hover:text-blue-300 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>interhive.info@gmail.com</span>
              </a>
            </div>

          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-slate-500">
            <p>&copy; {new Date().getFullYear()} InterHive Inc. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Security</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Company Connection Modal */}
      {isCompanyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsCompanyModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">Partner With InterHive</h3>
                <p className="text-xs text-slate-500 font-semibold">Submit details to get company portal login credentials</p>
              </div>
            </div>

            {companySubmitted ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-black text-slate-900">Inquiry Prepared!</h4>
                <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed font-semibold">
                  Your email client has opened with pre-filled details to <strong>interhive.info@gmail.com</strong>.
                </p>
              </div>
            ) : (
              <form onSubmit={handleCompanySubmit} className="space-y-4 text-left">
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase mb-1">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={companyForm.companyName}
                    onChange={e => setCompanyForm({ ...companyForm, companyName: e.target.value })}
                    placeholder="e.g. Acme Technologies Inc."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/40 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase mb-1">
                      Contact Person *
                    </label>
                    <input
                      type="text"
                      required
                      value={companyForm.contactPerson}
                      onChange={e => setCompanyForm({ ...companyForm, contactPerson: e.target.value })}
                      placeholder="John Doe"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/40 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase mb-1">
                      Work Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={companyForm.email}
                      onChange={e => setCompanyForm({ ...companyForm, email: e.target.value })}
                      placeholder="john@company.com"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/40 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingCompany}
                  className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2"
                >
                  {isSubmittingCompany ? (
                    <span>Submitting...</span>
                  ) : (
                    <>
                      <span>Submit Inquiry</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
