import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  GraduationCap,
  Briefcase,
  Users,
  Target,
  CheckCircle2,
  Building2,
  ShieldCheck,
  Cpu,
  Layers,
  Award,
  Linkedin,
  ExternalLink,
} from 'lucide-react';
import { PublicNavbar } from '../components/public-navbar';
import { PublicFooter } from '../components/public-footer';
import { InternshipApplicationModal } from '../components/internship-application-modal';
import { CompanyInquiryModal } from '../components/company-inquiry-modal';

export const AboutPage: React.FC = () => {
  const [isInternshipModalOpen, setIsInternshipModalOpen] = useState(false);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [hoveredFounder, setHoveredFounder] = useState<'ankit-yadav' | 'ankit-soni' | null>(null);

  const steps = [
    {
      number: '01',
      title: 'Sign Up & Profile',
      description: 'Create your profile, benchmark your current skill set, and declare your career goals.',
      icon: Users,
      color: 'bg-blue-50 text-blue-600 border-blue-200',
    },
    {
      number: '02',
      title: 'Build Skills & Readiness',
      description: 'Work through curated learning tracks, complete practical code assessments, and become industry-ready.',
      icon: Cpu,
      color: 'bg-purple-50 text-purple-600 border-purple-200',
    },
    {
      number: '03',
      title: 'Smart Role Matching',
      description: 'Our matching algorithm aligns your verified competencies directly with active internship requirements.',
      icon: Target,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    },
    {
      number: '04',
      title: 'Get Hired & Deliver',
      description: 'Apply directly through InterHive, interview with confidence, and gain authentic work experience.',
      icon: Briefcase,
      color: 'bg-amber-50 text-amber-600 border-amber-200',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F0F5FA] font-sans antialiased text-slate-800 selection:bg-blue-600 selection:text-white overflow-x-hidden">
      
      {/* Navigation */}
      <PublicNavbar
        activePage="about"
        onOpenInternshipModal={() => setIsInternshipModalOpen(true)}
        onOpenCompanyModal={() => setIsCompanyModalOpen(true)}
      />

      {/* HERO / MISSION SECTION */}
      <section className="relative pt-16 pb-20 overflow-hidden">
        {/* Ambient Gradient Glows */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-blue-400/20 via-indigo-400/20 to-purple-400/20 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100/90 border border-purple-200/80 text-purple-800 text-xs font-extrabold shadow-xs mb-6">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Our Mission & Story</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] max-w-4xl mx-auto">
            Bridging the gap between <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
              Student Learning & Industry Readiness
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed max-w-3xl mx-auto mt-6">
            Every year, millions of students graduate with foundational knowledge but lack real-world project experience. At the same time, companies spend months filtering through unvetted resumes. 
            InterHive was built to solve this disconnect by evaluating, preparing, and connecting high-potential talent with real workplace opportunities.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <button
              onClick={() => setIsInternshipModalOpen(true)}
              className="px-7 py-3.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Apply for Internship</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsCompanyModalOpen(true)}
              className="px-7 py-3.5 rounded-full bg-white text-slate-800 border border-slate-200/90 font-bold text-xs sm:text-sm shadow-xs hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Building2 className="w-4 h-4 text-blue-500" />
              <span>Partner With Us</span>
            </button>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-2">
          <span className="text-xs font-extrabold text-blue-600 tracking-widest uppercase">
            THE PROCESS
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            How InterHive Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-semibold">
            A clear, four-stage pathway from student enrollment to real industry impact.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-[2rem] p-7 border border-slate-200/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-12 h-12 rounded-2xl ${step.color} border flex items-center justify-center font-bold shadow-xs`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-2xl font-black text-slate-300">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-slate-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                    {step.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-100 mt-6 flex items-center gap-1.5 text-[11px] font-bold text-blue-600">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Phase {step.number}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* WHO WE SERVE SECTION (TWO COLUMNS) */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-2">
          <span className="text-xs font-extrabold text-blue-600 tracking-widest uppercase">
            ECOSYSTEM VALUE
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Who We Serve
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-semibold">
            Creating mutual value for ambitious learners and growing organizations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* For Students Column */}
          <div className="bg-white rounded-[2rem] p-8 sm:p-10 border border-slate-200/80 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center font-bold mb-6 shadow-xs">
                <GraduationCap className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-3">
                For Students & Early-Career Tech Talent
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed font-medium mb-6">
                Move beyond repetitive tutorials and theoretical coursework. InterHive gives you genuine practical experience on real codebases with structured mentorship.
              </p>

              <ul className="space-y-3 text-xs sm:text-sm text-slate-700 font-semibold mb-8">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Practical readiness assessments that reveal strengths and targeted areas for growth.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Hands-on project work simulating modern engineering team workflows (Git, Agile, Reviews).</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Transparent matching with vetted internship opportunities with fair stipends.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Verified credentials and certificates shareable directly with prospective employers.</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => setIsInternshipModalOpen(true)}
              className="w-full py-3.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Apply Now as an Intern</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* For Companies Column */}
          <div className="bg-white rounded-[2rem] p-8 sm:p-10 border border-slate-200/80 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center font-bold mb-6 shadow-xs">
                <Building2 className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-3">
                For Startups, Scaleups & Tech Companies
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed font-medium mb-6">
                Stop wasting engineering hours on early-stage resume screening. Hire pre-evaluated candidates whose skills have already been tested against real engineering criteria.
              </p>

              <ul className="space-y-3 text-xs sm:text-sm text-slate-700 font-semibold mb-8">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                  <span>Pre-screened candidates evaluated on coding proficiency, collaboration, and delivery.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                  <span>Drastically reduced time-to-hire with direct access to structured applicant profiles.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                  <span>Customizable talent pipelines matched to your exact tech stack requirements.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                  <span>Dedicated HR dashboard to review applicants, schedule interviews, and issue offers.</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => setIsCompanyModalOpen(true)}
              className="w-full py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Building2 className="w-4 h-4 text-blue-400" />
              <span>Connect as Hiring Partner</span>
            </button>
          </div>

        </div>
      </section>

      {/* MEET THE FOUNDERS SECTION */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100/90 border border-blue-200/80 text-blue-800 text-xs font-extrabold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Meet the Founders</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Built by Students, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
              for Students
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto">
            We're two BTech IT students who built InterHive because we struggled to find real internships ourselves — and wanted to fix that for others.
          </p>
        </div>

        {/* Interactive Founder Photo Card (Desktop & Tablet) */}
        <div className="relative rounded-[2.5rem] overflow-hidden border border-slate-200/80 shadow-2xl bg-slate-950 max-w-4xl mx-auto group">
          
          {/* Main Founders Photo */}
          <img
            src="/founders.jpg"
            alt="Ankit Yadav and Ankit Soni - Founders of InterHive"
            className="w-full h-auto object-cover max-h-[620px] block transition-transform duration-700 ease-out group-hover:scale-[1.01]"
          />

          {/* Desktop Visual Interaction Hint */}
          <div
            className={`hidden md:flex absolute top-5 left-1/2 -translate-x-1/2 z-30 pointer-events-none transition-all duration-300 ${
              hoveredFounder ? 'opacity-0 -translate-y-2' : 'opacity-100 translate-y-0'
            }`}
          >
            <div className="px-4 py-2 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/20 text-white text-xs font-bold flex items-center gap-2 shadow-xl animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Hover over either founder to view bio</span>
            </div>
          </div>

          {/* Dynamic Lighting Vignette on Hover */}
          <div
            className={`hidden md:block absolute inset-0 pointer-events-none transition-opacity duration-300 z-10 ${
              hoveredFounder === 'ankit-yadav'
                ? 'opacity-100 bg-gradient-to-r from-slate-950/70 via-transparent to-slate-950/30'
                : hoveredFounder === 'ankit-soni'
                ? 'opacity-100 bg-gradient-to-l from-slate-950/70 via-transparent to-slate-950/30'
                : 'opacity-0'
            }`}
          />

          {/* Invisible Desktop Hover Trigger Zones */}
          <div className="hidden md:block absolute inset-0 z-20">
            {/* Left Zone: Ankit Yadav */}
            <div
              onMouseEnter={() => setHoveredFounder('ankit-yadav')}
              onMouseLeave={() => setHoveredFounder(null)}
              className="absolute inset-y-0 left-0 w-1/2 cursor-pointer"
              title="Hover to meet Ankit Yadav"
            />
            {/* Right Zone: Ankit Soni */}
            <div
              onMouseEnter={() => setHoveredFounder('ankit-soni')}
              onMouseLeave={() => setHoveredFounder(null)}
              className="absolute inset-y-0 right-0 w-1/2 cursor-pointer"
              title="Hover to meet Ankit Soni"
            />
          </div>

          {/* Ankit Yadav Overlay Card (Desktop: Bottom-Left) */}
          <div
            onMouseEnter={() => setHoveredFounder('ankit-yadav')}
            onMouseLeave={() => setHoveredFounder(null)}
            className={`hidden md:block absolute bottom-6 left-6 max-w-sm z-30 transition-all duration-300 pointer-events-auto ${
              hoveredFounder === 'ankit-yadav'
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-4 pointer-events-none'
            }`}
          >
            <div className="p-6 rounded-3xl bg-slate-950/90 backdrop-blur-xl border border-white/20 text-white shadow-2xl space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-black text-white">Ankit Yadav</h3>
                  <span className="inline-block mt-1 px-3 py-1 rounded-full text-[10px] font-extrabold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                    Co-Founder, Product & Engineering
                  </span>
                </div>
                <a
                  href="https://www.linkedin.com/in/ankit-yadav-4b86b7294/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Ankit Yadav LinkedIn Profile"
                  className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md hover:scale-105 shrink-0 flex items-center justify-center cursor-pointer"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                BTech IT student, building InterHive's platform and product experience from the ground up.
              </p>
              <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                <a
                  href="https://www.linkedin.com/in/ankit-yadav-4b86b7294/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <span>Connect on LinkedIn</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <span className="text-[10px] text-slate-400 font-semibold">InterHive Core</span>
              </div>
            </div>
          </div>

          {/* Ankit Soni Overlay Card (Desktop: Bottom-Right) */}
          <div
            onMouseEnter={() => setHoveredFounder('ankit-soni')}
            onMouseLeave={() => setHoveredFounder(null)}
            className={`hidden md:block absolute bottom-6 right-6 max-w-sm z-30 transition-all duration-300 pointer-events-auto ${
              hoveredFounder === 'ankit-soni'
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-4 pointer-events-none'
            }`}
          >
            <div className="p-6 rounded-3xl bg-slate-950/90 backdrop-blur-xl border border-white/20 text-white shadow-2xl space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-black text-white">Ankit Soni</h3>
                  <span className="inline-block mt-1 px-3 py-1 rounded-full text-[10px] font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                    Co-Founder, Growth & Partnerships
                  </span>
                </div>
                <a
                  href="https://www.linkedin.com/in/ankitsoni1203/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Ankit Soni LinkedIn Profile"
                  className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md hover:scale-105 shrink-0 flex items-center justify-center cursor-pointer"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                BTech IT student, focused on building InterHive's company partnerships and community.
              </p>
              <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                <a
                  href="https://www.linkedin.com/in/ankitsoni1203/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <span>Connect on LinkedIn</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <span className="text-[10px] text-slate-400 font-semibold">InterHive Core</span>
              </div>
            </div>
          </div>

        </div>

        {/* Mobile Cards (Visible by Default Without Requiring Hover) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 md:hidden max-w-4xl mx-auto">
          
          {/* Ankit Yadav Mobile Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <h3 className="text-lg font-black text-slate-900">Ankit Yadav</h3>
                  <span className="inline-block mt-0.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
                    Co-Founder, Product & Engineering
                  </span>
                </div>
                <a
                  href="https://www.linkedin.com/in/ankit-yadav-4b86b7294/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Ankit Yadav LinkedIn"
                  className="p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-xs"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
              <p className="text-xs text-slate-600 font-medium leading-relaxed mt-3">
                BTech IT student, building InterHive's platform and product experience from the ground up.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 mt-4">
              <a
                href="https://www.linkedin.com/in/ankit-yadav-4b86b7294/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600"
              >
                <span>View LinkedIn Profile</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Ankit Soni Mobile Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <h3 className="text-lg font-black text-slate-900">Ankit Soni</h3>
                  <span className="inline-block mt-0.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    Co-Founder, Growth & Partnerships
                  </span>
                </div>
                <a
                  href="https://www.linkedin.com/in/ankitsoni1203/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Ankit Soni LinkedIn"
                  className="p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all shadow-xs"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
              <p className="text-xs text-slate-600 font-medium leading-relaxed mt-3">
                BTech IT student, focused on building InterHive's company partnerships and community.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 mt-4">
              <a
                href="https://www.linkedin.com/in/ankitsoni1203/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600"
              >
                <span>View LinkedIn Profile</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>

        {/* Closing Line */}
        <div className="text-center mt-12 max-w-2xl mx-auto">
          <p className="text-xs sm:text-sm font-bold text-slate-500 italic">
            "Two students, one mission: helping students like us build real skills and land the internships and placements they deserve."
          </p>
        </div>

      </section>

      {/* BOTTOM CTA BANNER */}
      <section className="py-16 text-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-[2rem] p-8 sm:p-12 border border-slate-200/80 shadow-md">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-3">
            Ready to Take Your Next Career Step?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-semibold max-w-lg mx-auto mb-6">
            Whether you are an aspiring engineer or an employer looking for exceptional interns, join InterHive today.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setIsInternshipModalOpen(true)}
              className="px-7 py-3.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Apply Now for Internship</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsCompanyModalOpen(true)}
              className="px-7 py-3.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <Building2 className="w-4 h-4 text-slate-600" />
              <span>Hire Interns</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <PublicFooter
        onOpenInternshipModal={() => setIsInternshipModalOpen(true)}
        onOpenCompanyModal={() => setIsCompanyModalOpen(true)}
      />

      {/* Modals */}
      <CompanyInquiryModal
        isOpen={isCompanyModalOpen}
        onClose={() => setIsCompanyModalOpen(false)}
      />
      <InternshipApplicationModal
        isOpen={isInternshipModalOpen}
        onClose={() => setIsInternshipModalOpen(false)}
      />

    </div>
  );
};
