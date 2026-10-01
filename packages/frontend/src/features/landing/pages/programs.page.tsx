import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
  Search,
  Building2,
  Users,
  Trophy,
  Target,
  Clock,
  Calendar,
  Check,
  HelpCircle,
  ChevronDown
} from 'lucide-react';
import { PublicNavbar } from '../components/public-navbar';
import { PublicFooter } from '../components/public-footer';
import { InternshipApplicationModal } from '../components/internship-application-modal';
import { CompanyInquiryModal } from '../components/company-inquiry-modal';

export const ProgramsPage: React.FC = () => {
  const [isInternshipModalOpen, setIsInternshipModalOpen] = useState(false);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'curriculum' | 'outcomes' | 'partners' | 'faqs'>('overview');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // 7-Stage PPO Pathway with durations from PRD & Image 2
  const ppoStages = [
    {
      step: '01',
      title: 'Application & Assessment',
      duration: '1-2 weeks',
      color: 'bg-blue-500 text-white',
      badgeBg: 'bg-blue-100 text-blue-800',
      description: 'Create your profile → Complete AI skill assessment → Technical + Aptitude + HR evaluation.',
      details: 'Objective benchmarking of foundational problem-solving, code syntax, and communication readiness.',
    },
    {
      step: '02',
      title: 'Selection',
      duration: '1 week',
      color: 'bg-purple-500 text-white',
      badgeBg: 'bg-purple-100 text-purple-800',
      description: 'Qualified students receive program selection letters and enter the official PPO Track.',
      details: 'Top performers are placed into dedicated cohorts tailored to partner company tech stacks.',
    },
    {
      step: '03',
      title: '2-Month Training at InterHive',
      duration: '2 months',
      color: 'bg-emerald-500 text-white',
      badgeBg: 'bg-emerald-100 text-emerald-800',
      description: 'Industry-focused training, real client projects, professional communication, and 1-on-1 mentorship.',
      details: 'Master full-stack architecture, clean code standards, Git workflows, and system design before entering the company.',
    },
    {
      step: '04',
      title: 'Company Matching',
      duration: '1 week',
      color: 'bg-amber-500 text-white',
      badgeBg: 'bg-amber-100 text-amber-800',
      description: 'Get matched with verified partner companies based on your validated skill score and performance.',
      details: 'Interview directly with company engineering leads who already have access to your verified portfolio and scores.',
    },
    {
      step: '05',
      title: '4-Month Company Internship',
      duration: '4 months',
      color: 'bg-rose-500 text-white',
      badgeBg: 'bg-rose-100 text-rose-800',
      description: 'Work on live, real-world company codebases and products, guided by an assigned company engineering mentor.',
      details: 'Deliver sprint features, participate in daily standups, and build verifiable production contributions.',
    },
    {
      step: '06',
      title: 'Performance Evaluation',
      duration: 'Ongoing',
      color: 'bg-indigo-500 text-white',
      badgeBg: 'bg-indigo-100 text-indigo-800',
      description: 'Transparent ongoing monthly reviews and final evaluation based on agreed partner company rubrics.',
      details: 'Track your sprint deliverables, attendance, mentor ratings, and code reviews directly on your PPO Dashboard.',
    },
    {
      step: '07',
      title: 'PPO Offer',
      duration: 'Based on performance',
      color: 'bg-blue-600 text-white',
      badgeBg: 'bg-blue-100 text-blue-900',
      description: 'Receive your official Pre-Placement Offer (PPO) and launch your full-time industry engineering career.',
      details: 'Interns satisfying documented company performance criteria transition seamlessly to full-time roles.',
    },
  ];

  const whyJoinBenefits = [
    'Guaranteed industry exposure with top companies',
    'Intensive training before entering your company internship',
    'Real client project work, not dummy assignments',
    'Dedicated mentorship from senior tech leads',
    'Direct, transparent pathway to full-time PPO',
    'Recognized InterHive certificate & lifetime alumni network',
  ];

  const faqs = [
    {
      q: 'What is the 6-Month PPO Track?',
      a: 'The PPO Track is a structured 6-month pathway: 2 months of intensive InterHive training on real-world engineering workflows, followed by 4 months of paid/stipend company internship with one of our partner firms, culminating in full-time hiring consideration.',
    },
    {
      q: 'Is PPO guaranteed?',
      a: 'PPO eligibility is governed by documented, company-specific criteria that students see on their dashboard from Day 1. Students who meet their performance and attendance thresholds are eligible for direct full-time conversion.',
    },
    {
      q: 'Who can apply?',
      a: 'Pre-final and final year BTech, BCA, MCA, or IT students, as well as recent graduates looking to launch their tech career in software engineering, frontend, backend, or full-stack roles.',
    },
    {
      q: 'What is the selection process?',
      a: 'Submit your profile and resume, complete an online aptitude + coding readiness assessment, followed by a short HR evaluation. Selected candidates receive an official Cohort Invitation.',
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

      {/* ============================================================== */}
      {/* HERO HEADER SECTION                                            */}
      {/* ============================================================== */}
      <section className="relative pt-12 pb-8 bg-gradient-to-b from-blue-50/60 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100/90 border border-purple-200/80 text-purple-800 text-xs font-extrabold shadow-2xs mb-4">
            <GraduationCap className="w-4 h-4 text-purple-600" />
            <span>PPO Program · 6-Month Fast-Track</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
            6 Months. One Clear Goal —{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
              Your PPO.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 font-semibold max-w-2xl mt-2 leading-relaxed">
            A structured program that prepares you, places you with partner companies, and helps you convert your internship into a full-time career.
          </p>

        </div>
      </section>

      {/* ============================================================== */}
      {/* MAIN PROGRAM CONTENT: TABS + TIMELINE + CTA (IMAGE 2 LAYOUT)  */}
      {/* ============================================================== */}
      <section className="pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-slate-200/80 scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-5 py-2.5 rounded-full text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            Program Overview
          </button>
          <button
            onClick={() => setActiveTab('curriculum')}
            className={`px-5 py-2.5 rounded-full text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'curriculum'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            Curriculum
          </button>
          <button
            onClick={() => setActiveTab('outcomes')}
            className={`px-5 py-2.5 rounded-full text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'outcomes'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            Outcomes
          </button>
          <button
            onClick={() => setActiveTab('partners')}
            className={`px-5 py-2.5 rounded-full text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'partners'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            Partner Companies
          </button>
          <button
            onClick={() => setActiveTab('faqs')}
            className={`px-5 py-2.5 rounded-full text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'faqs'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            FAQs
          </button>
        </div>

        {/* 2-Column Content Grid matching Image 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT / CENTER COLUMN: VERTICAL TIMELINE / TAB CONTENT */}
          <div className="lg:col-span-8 space-y-6">
            
            {activeTab === 'overview' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-8">
                
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight mb-1">
                    The 7-Stage PPO Roadmap
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold">
                    Each stage has clear deliverables and milestone evaluations before progression.
                  </p>
                </div>

                {/* Vertical Timeline Stepper */}
                <div className="relative pl-6 sm:pl-8 border-l-2 border-slate-200 space-y-8">
                  {ppoStages.map((stage, idx) => (
                    <div key={idx} className="relative group">
                      
                      {/* Timeline Node Icon */}
                      <div className={`absolute -left-[35px] sm:-left-[43px] top-0 w-8 h-8 rounded-full ${stage.color} flex items-center justify-center text-xs font-black shadow-md ring-4 ring-white`}>
                        {stage.step}
                      </div>

                      {/* Timeline Content Card */}
                      <div className="bg-slate-50/70 hover:bg-blue-50/30 rounded-2xl p-5 border border-slate-200/70 transition-all">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                            <span>{stage.title}</span>
                          </h4>
                          <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${stage.badgeBg}`}>
                            {stage.duration}
                          </span>
                        </div>

                        <p className="text-xs text-slate-700 font-semibold leading-relaxed">
                          {stage.description}
                        </p>

                        <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-1.5 pt-1.5 border-t border-slate-200/60">
                          💡 <span className="font-semibold">{stage.details}</span>
                        </p>
                      </div>

                    </div>
                  ))}
                </div>

              </div>
            )}

            {activeTab === 'curriculum' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight mb-1">
                    Industry-Focused Curriculum
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold">
                    2 Months of practical training crafted to bridge the college-to-corporate gap.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/70 space-y-2">
                    <span className="text-[10px] font-black text-blue-700 uppercase tracking-wider block">Month 1 · Foundation & Architecture</span>
                    <h4 className="text-sm font-black text-slate-900">Full-Stack Engineering & Clean Code</h4>
                    <ul className="text-xs text-slate-600 space-y-1 font-medium list-disc pl-4">
                      <li>Modern TypeScript & React component architecture</li>
                      <li>RESTful APIs, NestJS & Node.js backend design</li>
                      <li>Database schema modeling (PostgreSQL & MongoDB)</li>
                      <li>Git branching, pull request reviews, and CI/CD</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200/70 space-y-2">
                    <span className="text-[10px] font-black text-purple-700 uppercase tracking-wider block">Month 2 · Production Sprints</span>
                    <h4 className="text-sm font-black text-slate-900">Real Client Projects & Soft Skills</h4>
                    <ul className="text-xs text-slate-600 space-y-1 font-medium list-disc pl-4">
                      <li>Building live features in team sprints</li>
                      <li>Automated testing (unit + integration tests)</li>
                      <li>Corporate communication, standups, and documentation</li>
                      <li>Pre-internship benchmark assessment & company matching</li>
                    </ul>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80">
                  <span className="text-[10px] font-black text-emerald-800 uppercase tracking-wider block mb-1">Months 3 to 6 · Partner Internship</span>
                  <h4 className="text-sm font-black text-slate-900 mb-1">Live Engineering at Partner Company</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    You work directly as an intern on partner company codebases with assigned company engineering mentors. Your deliverables count toward your final PPO decision.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'outcomes' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight mb-1">
                    Measurable Career Outcomes
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold">
                    We track tangible results that employers care about.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
                    <span className="block font-black text-2xl text-blue-600">70%+</span>
                    <span className="text-xs font-bold text-slate-700 mt-1 block">PPO Conversion</span>
                    <span className="text-[10px] text-slate-400 font-medium">Target conversion for qualified interns</span>
                  </div>
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
                    <span className="block font-black text-2xl text-purple-600">5,000+</span>
                    <span className="text-xs font-bold text-slate-700 mt-1 block">Students Trained</span>
                    <span className="text-[10px] text-slate-400 font-medium">Across IT & Engineering domains</span>
                  </div>
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
                    <span className="block font-black text-2xl text-emerald-600">80+</span>
                    <span className="text-xs font-bold text-slate-700 mt-1 block">Partner Companies</span>
                    <span className="text-[10px] text-slate-400 font-medium">Actively hiring trained talent</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'partners' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight mb-1">
                    Our Partner Companies
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold">
                    Companies that partner with InterHive for assessed, pre-trained intern cohorts.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {['TATA', 'Microsoft', 'Google', 'Amazon', 'Infosys', 'Accenture', 'Deloitte', 'Capgemini', 'HCL', 'Wipro'].map((comp, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center font-black text-slate-700 text-sm h-14">
                      {comp}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'faqs' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight mb-1">
                    Frequently Asked Questions
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold">
                    Everything you need to know about the 6-Month PPO Track.
                  </p>
                </div>

                <div className="space-y-3">
                  {faqs.map((faq, idx) => (
                    <div key={idx} className="rounded-2xl border border-slate-200 overflow-hidden">
                      <button
                        onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                        className="w-full p-4 text-left font-black text-xs sm:text-sm text-slate-800 flex items-center justify-between bg-slate-50/70 hover:bg-slate-100 transition-colors"
                      >
                        <span>{faq.q}</span>
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${activeFaq === idx ? 'rotate-180' : ''}`} />
                      </button>
                      {activeFaq === idx && (
                        <div className="p-4 bg-white text-xs text-slate-600 font-medium leading-relaxed border-t border-slate-100">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* RIGHT COLUMN: "WHY JOIN THE PPO PROGRAM?" CARD (MATCHING IMAGE 2 TOP RIGHT) */}
          <div className="lg:col-span-4 sticky top-28 space-y-6">
            
            <div className="bg-white rounded-[2rem] p-6 sm:p-7 border border-slate-200/80 shadow-xl space-y-6">
              
              <div>
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block mb-1">
                  Why Choose InterHive
                </span>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  Why Join the PPO Program?
                </h3>
              </div>

              {/* Benefits Checklist */}
              <div className="space-y-3">
                {whyJoinBenefits.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <span className="text-xs font-bold text-slate-700 leading-snug">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              {/* Verified Trust Metric */}
              <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-200/70 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-black text-slate-900 block leading-tight">
                    Verified Talent Profile
                  </span>
                  <span className="text-[10px] text-slate-500 font-semibold">
                    Documented rubrics & verified project proof
                  </span>
                </div>
              </div>

              {/* Main CTA */}
              <button
                onClick={() => setIsInternshipModalOpen(true)}
                className="w-full py-3.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Apply for PPO Program</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[10px] text-slate-400 text-center font-semibold">
                Controlled intake · Free application & assessment
              </p>

            </div>

            {/* Quick Employer Contact */}
            <div className="p-4 rounded-2xl bg-slate-100/80 border border-slate-200 text-center">
              <span className="text-xs font-bold text-slate-700 block mb-1">
                Are you an employer looking for pre-trained interns?
              </span>
              <button
                onClick={() => setIsCompanyModalOpen(true)}
                className="text-xs font-extrabold text-blue-600 hover:text-blue-700 cursor-pointer"
              >
                Partner with InterHive for PPO Hiring →
              </button>
            </div>

          </div>

        </div>

      </section>

      {/* Footer */}
      <PublicFooter
        onOpenInternshipModal={() => setIsInternshipModalOpen(true)}
        onOpenCompanyModal={() => setIsCompanyModalOpen(true)}
      />

      {/* Modals */}
      <InternshipApplicationModal
        isOpen={isInternshipModalOpen}
        onClose={() => setIsInternshipModalOpen(false)}
      />

      <CompanyInquiryModal
        isOpen={isCompanyModalOpen}
        onClose={() => setIsCompanyModalOpen(false)}
      />

    </div>
  );
};
