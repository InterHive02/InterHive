import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Briefcase,
  GraduationCap,
  TrendingUp,
  Award,
  CheckCircle2,
  Code,
  Layers,
  FileCheck,
  Search,
  Building2
} from 'lucide-react';
import { PublicNavbar } from '../components/public-navbar';
import { PublicFooter } from '../components/public-footer';
import { InternshipApplicationModal } from '../components/internship-application-modal';
import { CompanyInquiryModal } from '../components/company-inquiry-modal';

export const ProgramsPage: React.FC = () => {
  const [isInternshipModalOpen, setIsInternshipModalOpen] = useState(false);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [selectedProgramCategory, setSelectedProgramCategory] = useState('Software Engineering');

  const programs = [
    {
      id: 'internship-program',
      title: 'Structured Internship Program',
      tagline: 'Hands-on project work in simulated engineering sprints',
      description: 'Join cohort-based internships designed to immerse you in real team workflows. You will write production-standard code, participate in pull request reviews, and build portfolio-grade features.',
      icon: Briefcase,
      color: 'bg-blue-50 text-blue-600 border-blue-200',
      category: 'Software Engineering',
      duration: '8 - 12 Weeks',
      format: 'Remote / Cohort-based',
      includes: [
        'Real-world codebase contributions and feature delivery',
        'Structured sprint cycles with task boards and retrospectives',
        'Direct code reviews and architecture mentorship from senior engineers',
        'Official InterHive Internship Completion Certificate & Credential',
      ],
      ctaText: 'Apply for Internship',
    },
    {
      id: 'readiness-assessment',
      title: 'Skill Readiness & Assessment',
      tagline: 'Objective benchmarking of your technical & workflow skills',
      description: 'Identify your precise engineering strengths and skill gaps before entering interviews. Our multi-dimensional assessment evaluates technical skills, git workflows, problem solving, and system basics.',
      icon: Award,
      color: 'bg-purple-50 text-purple-600 border-purple-200',
      category: 'Full Stack',
      duration: 'Self-paced Evaluation',
      format: 'Interactive Online',
      includes: [
        'Comprehensive 8-pillar readiness score breakdown',
        'Personalized skill gap report and recommended learning resources',
        'Technical competency verification shareable with hiring partners',
        'Readiness certification upon achieving 80%+ benchmark score',
      ],
      ctaText: 'Start Assessment Path',
    },
    {
      id: 'skill-development',
      title: 'Skill Development & Learning Paths',
      tagline: 'Curated modules that teach modern development practices',
      description: 'Bridge academic theory and industry reality. Learn practical engineering tools, state management, REST & GraphQL design, database optimization, and deployment best practices.',
      icon: TrendingUp,
      color: 'bg-amber-50 text-amber-600 border-amber-200',
      category: 'Frontend & Backend',
      duration: 'Ongoing Curated Access',
      format: 'Project-driven',
      includes: [
        'Curated hands-on modules in modern full-stack web technologies',
        'Industry tooling mastery: Git branching, CI/CD, Docker basics',
        'Best practices in testing, clean code, and API contracts',
        'Live technical workshops and doubt-clearing sessions',
      ],
      ctaText: 'Explore Learning Path',
    },
    {
      id: 'placement-track',
      title: 'Job & Internship Placement Track',
      tagline: 'Direct pipeline connection to partner companies and startups',
      description: 'Students who maintain high readiness scores and excel in project sprints are placed into the fast-track hiring pipeline, directly presented to partner tech companies looking for interns.',
      icon: GraduationCap,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      category: 'Career Placement',
      duration: 'Post-Internship Cohort',
      format: 'Direct Matching',
      includes: [
        'Priority interview scheduling with actively hiring partner companies',
        'Verified candidate dossier sent directly to tech recruiters',
        'Resume polishing and mock technical interview preparation',
        'Direct offer management and onboarding support through InterHive portal',
      ],
      ctaText: 'Apply for Placement',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F0F5FA] font-sans antialiased text-slate-800 selection:bg-blue-600 selection:text-white overflow-x-hidden">
      
      {/* Navigation */}
      <PublicNavbar
        activePage="programs"
        onOpenInternshipModal={() => setIsInternshipModalOpen(true)}
        onOpenCompanyModal={() => setIsCompanyModalOpen(true)}
      />

      {/* HEADER SECTION */}
      <section className="relative pt-16 pb-14 text-center overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100/90 border border-blue-200/80 text-blue-800 text-xs font-extrabold shadow-xs mb-6">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Structured Career Programs</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.1] max-w-3xl mx-auto">
            Programs Designed for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
              Real-World Engineering Delivery
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto mt-4">
            Every InterHive program focuses on what tech companies actually look for: working code, problem-solving, collaboration, and industry discipline.
          </p>
        </div>
      </section>

      {/* PROGRAM CARDS GRID */}
      <section className="pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {programs.map(prog => {
            const Icon = prog.icon;
            return (
              <div
                key={prog.id}
                id={prog.id}
                className="bg-white rounded-[2rem] p-8 border border-slate-200/80 shadow-xs hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3.5">
                      <div className={`w-14 h-14 rounded-2xl ${prog.color} border flex items-center justify-center font-bold shrink-0 shadow-xs group-hover:scale-105 transition-transform`}>
                        <Icon className="w-7 h-7" />
                      </div>
                      <div>
                        <span className="text-[11px] font-extrabold text-blue-600 uppercase tracking-wider block">
                          {prog.category}
                        </span>
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                          {prog.title}
                        </h2>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs font-bold text-slate-400 mb-3 italic">
                    "{prog.tagline}"
                  </p>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium mb-6">
                    {prog.description}
                  </p>

                  <div className="flex flex-wrap gap-2 text-[11px] font-bold text-slate-500 mb-6">
                    <span className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700">
                      ⏱ Duration: {prog.duration}
                    </span>
                    <span className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700">
                      📍 Format: {prog.format}
                    </span>
                  </div>

                  {/* What it includes */}
                  <div className="pt-4 border-t border-slate-100 mb-6">
                    <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-3">
                      What This Program Includes:
                    </h4>
                    <ul className="space-y-2.5 text-xs text-slate-600 font-semibold">
                      {prog.includes.map((inc, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    Verified InterHive Pathway
                  </span>
                  <button
                    onClick={() => {
                      setSelectedProgramCategory(prog.category);
                      setIsInternshipModalOpen(true);
                    }}
                    className="px-6 py-2.5 rounded-full bg-blue-50 text-blue-600 font-extrabold text-xs hover:bg-blue-600 hover:text-white hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>{prog.ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* EMPLOYER COLLABORATION BANNER */}
      <section className="pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-[2rem] p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-extrabold text-blue-400 tracking-widest uppercase">
              FOR COMPANIES & HIRING MANAGERS
            </span>
            <h3 className="text-2xl font-black">Want to Host an Internship Track?</h3>
            <p className="text-xs sm:text-sm text-slate-400 font-medium max-w-xl">
              We tailor internship projects and assessments specifically for your company's technology stack.
            </p>
          </div>
          <button
            onClick={() => setIsCompanyModalOpen(true)}
            className="px-7 py-3.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <Building2 className="w-4 h-4 text-white" />
            <span>Partner as an Employer</span>
          </button>
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
        preselectedCategory={selectedProgramCategory}
      />

    </div>
  );
};
