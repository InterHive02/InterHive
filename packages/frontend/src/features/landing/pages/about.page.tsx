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
  Award
} from 'lucide-react';
import { PublicNavbar } from '../components/public-navbar';
import { PublicFooter } from '../components/public-footer';
import { InternshipApplicationModal } from '../components/internship-application-modal';
import { CompanyInquiryModal } from '../components/company-inquiry-modal';

export const AboutPage: React.FC = () => {
  const [isInternshipModalOpen, setIsInternshipModalOpen] = useState(false);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);

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

      {/* TEAM & FOUNDATION (HONEST PLACEHOLDER STRUCTURE) */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-[2.5rem] p-8 sm:p-14 text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-3xl">
            <span className="text-xs font-extrabold text-blue-400 tracking-widest uppercase block mb-2">
              OUR FOUNDATION
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4">
              Built with High Standards by Engineers & Mentors
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed mb-8">
              We are a dedicated group of software engineers, technical hiring managers, and academic mentors who experienced the broken talent pipeline firsthand. 
              We are building InterHive with uncompromising product quality to give ambitious students a direct, credible bridge into tech careers.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-800 text-left">
              <div>
                <span className="block font-black text-2xl text-blue-400">100%</span>
                <span className="text-xs text-slate-400 font-semibold">Practical, project-based evaluation criteria</span>
              </div>
              <div>
                <span className="block font-black text-2xl text-indigo-400">Direct</span>
                <span className="text-xs text-slate-400 font-semibold">Application flow through vetted employer channels</span>
              </div>
              <div>
                <span className="block font-black text-2xl text-purple-400">Verified</span>
                <span className="text-xs text-slate-400 font-semibold">Industry-aligned skill readiness benchmarks</span>
              </div>
            </div>
          </div>
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
