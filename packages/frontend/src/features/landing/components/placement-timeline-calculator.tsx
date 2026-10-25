import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Building2,
  IndianRupee,
  GraduationCap,
  Sparkles,
  HelpCircle,
  Code,
  Laptop
} from 'lucide-react';

interface PlacementTimelineCalculatorProps {
  onApplyForBatch: (programKey: string) => void;
}

export const PlacementTimelineCalculator: React.FC<PlacementTimelineCalculatorProps> = ({
  onApplyForBatch,
}) => {
  const [selectedYear, setSelectedYear] = useState<'1st' | '2nd' | '3rd' | 'final'>('3rd');

  const plans = {
    '1st': {
      label: '1st Year (2028 / 2029 Batch)',
      shortBadge: 'Foundation & Summer Internship',
      targetSemester: '1st & 2nd Semester',
      programKey: 'four_year',
      heading: 'Early Foundation & Production Software Sprint',
      description: 'Master core Data Structures, Git pull-requests, and modern Web Fundamentals before competing with senior batches.',
      duration: '6 Months Structured (Flexible with College Exams)',
      milestones: [
        { month: 'Month 1–2', title: 'Foundations & Real Code', desc: 'Modern JavaScript/Python, Git workflows, clean code & team sprints.' },
        { month: 'Month 3–4', title: 'Live Project Sprint', desc: 'Build 2 full-stack web applications under senior software engineer mentorship.' },
        { month: 'Month 5–6', title: 'First Paid Micro-Internship', desc: 'Summer remote internship matching with stipend to build early career proof.' },
      ],
      stipendBracket: '₹15,000 – ₹25,000 / month',
      targetOutcome: 'Early Tech Resume & Summer Internship Proof',
      eligibility: 'Open to all 1st year B.Tech, BCA, B.Sc & MCA students. No prior coding experience required.'
    },
    '2nd': {
      label: '2nd Year (2027 Batch)',
      shortBadge: 'Core Specialization Track',
      targetSemester: '3rd & 4th Semester',
      programKey: 'three_year',
      heading: 'Full-Stack & Cloud Architecture Sprint',
      description: 'Move beyond college lab syllabus into production microservices, cloud deployments, and verified project portfolios.',
      duration: '6 Months (2 Months Training + 4 Months Industrial Sprint)',
      milestones: [
        { month: 'Month 1–2', title: 'Full-Stack & System Design', desc: 'React, Node.js/Python, Docker, database indexing & REST APIs.' },
        { month: 'Month 3–4', title: 'Corporate Internship Sprint', desc: 'Direct matching with tech startups & mid-market engineering teams.' },
        { month: 'Month 5–6', title: 'Evaluation & Pre-PPO Pipeline', desc: 'Verified offer letter and qualification for 3rd-year enterprise PPO tracks.' },
      ],
      stipendBracket: '₹25,000 – ₹35,000 / month',
      targetOutcome: 'Verified Industrial Internship & PPO Fast-Track',
      eligibility: 'All 2nd year students across all engineering and computer science branches. Zero CGPA cutoff.'
    },
    '3rd': {
      label: '3rd Year (2026 Batch) — Primary PPO Track',
      shortBadge: 'Most Popular for PPO',
      targetSemester: '5th & 6th Semester',
      programKey: 'two_year',
      heading: 'Direct Corporate Internship & Confirmed PPO Pathway',
      description: 'The golden placement window. Convert your pre-final year into a confirmed job offer before on-campus placement season begins.',
      duration: '6 Months (2 Months Sprint + 4 Months Paid Corporate Internship)',
      milestones: [
        { month: 'Month 1–2', title: 'Intensive Industrial Sprints', desc: 'Daily mentor standups, real code audits, system design & assessment test.' },
        { month: 'Month 3–5', title: 'Corporate Paid Internship', desc: '4 months full-time/hybrid internship with monthly stipend at partner company.' },
        { month: 'Month 6', title: 'PPO Evaluation & Conversion', desc: 'Pre-Placement Offer confirmed before the start of your 7th/8th semester.' },
      ],
      stipendBracket: '₹35,000 – ₹50,000 / month',
      targetOutcome: 'Pre-Placement Offer (₹8 – ₹16 LPA Target PPO)',
      eligibility: 'Pre-final year students (CSE, IT, ECE, EE, Mech & non-CS). Practical skill test determines matching.'
    },
    'final': {
      label: 'Final Year (2025 Batch)',
      shortBadge: 'Fast-Track Immediate Placement',
      targetSemester: '7th & 8th Semester',
      programKey: 'one_year',
      heading: 'Immediate Corporate Matching & Direct Job Transition',
      description: 'Immediate skill assessment and direct placement matching for students needing full-time graduation offers right now.',
      duration: '3–6 Months Fast-Track Matching',
      milestones: [
        { month: 'Weeks 1–4', title: 'Skill Audit & Resume Rebuild', desc: 'Fast-track technical screening, mock interviews, and project portfolio polishing.' },
        { month: 'Month 2–3', title: 'Company Match & Interviews', desc: 'Priority interview scheduling with actively hiring corporate partners.' },
        { month: 'Month 4–6', title: 'Intern-to-Hire Transition', desc: 'Convert internship directly into full-time employment upon college completion.' },
      ],
      stipendBracket: '₹35,000 – ₹55,000 / month',
      targetOutcome: 'Direct Full-Time Employment & Onboarding',
      eligibility: 'Final year graduating students and recent passouts. Immediate onboarding available.'
    }
  };

  const current = plans[selectedYear];

  return (
    <section id="placement-calculator" className="py-16 bg-[#F8FAFC] border-y border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100/90 border border-blue-200/80 text-blue-800 text-xs font-extrabold shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span>Interactive Placement Calculator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            When Will You Get Placed?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-semibold max-w-xl mx-auto">
            Select your current college year to calculate your exact month-by-month placement roadmap, stipend range, and target PPO window.
          </p>
        </div>

        {/* 4 Interactive Year Tabs */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-8">
          {(['1st', '2nd', '3rd', 'final'] as const).map((year) => {
            const isSelected = selectedYear === year;
            return (
              <button
                key={year}
                type="button"
                onClick={() => setSelectedYear(year)}
                className={`px-4 sm:px-6 py-3 rounded-2xl font-black text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 scale-105'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span>{year === 'final' ? 'Final Year' : `${year} Year`}</span>
                {year === '3rd' && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                    isSelected ? 'bg-white text-blue-700' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    Hot
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Main Calculator Display Card */}
        <div className="bg-white rounded-[2.2rem] border border-slate-200/80 shadow-xl p-6 sm:p-10 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left 7 Columns: Pathway & Milestones */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[11px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                    {current.targetSemester}
                  </span>
                  <span className="text-[11px] font-bold text-slate-500">
                    Duration: {current.duration}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                  {current.heading}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-medium mt-2 leading-relaxed">
                  {current.description}
                </p>
              </div>

              {/* 3 Step Milestone Flow */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">
                  Your Month-by-Month Schedule
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {current.milestones.map((m, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                      <span className="text-[10px] font-black text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-full inline-block">
                        {m.month}
                      </span>
                      <h5 className="font-extrabold text-slate-900 text-xs mt-1">
                        {m.title}
                      </h5>
                      <p className="text-[10.5px] text-slate-500 leading-snug font-medium">
                        {m.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Eligibility Note */}
              <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200/70 flex items-start gap-2.5 text-xs text-slate-700">
                <HelpCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900">Eligibility Guarantee: </strong>
                  {current.eligibility}
                </div>
              </div>
            </div>

            {/* Right 5 Columns: Stipend, Target Outcome & Instant CTA */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-7 text-white space-y-5 shadow-xl border border-slate-700">
              <div className="flex items-center justify-between border-b border-slate-700 pb-4">
                <span className="text-xs font-bold text-slate-400">Projected Monthly Stipend</span>
                <span className="text-[11px] font-black text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  Paid Directly to You
                </span>
              </div>

              <div>
                <span className="block text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {current.stipendBracket}
                </span>
                <span className="text-[11px] text-slate-300 font-medium block mt-1">
                  During the 4-month corporate internship phase
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-white/10 border border-white/10 space-y-1">
                <span className="text-[10px] font-bold text-slate-300 uppercase block">Placement Target</span>
                <span className="text-sm font-black text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  {current.targetOutcome}
                </span>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => onApplyForBatch(current.programKey)}
                  className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs sm:text-sm shadow-lg shadow-blue-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Apply for {selectedYear === 'final' ? 'Final Year' : `${selectedYear} Year`} Cohort</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-[10.5px] text-slate-400 text-center font-medium">
                  ⚡ 100% Free · No upfront fee · Takes 2 minutes
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* 100% Transparent Zero-Fee & Zero-Bias Proof Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-black text-slate-900 text-sm">
              100% Free For All Students
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              We never charge students for training, assessments, or placement matching. Zero tuition, zero course fees, and <strong>zero ISA cuts</strong> from your future salary.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <h4 className="font-black text-slate-900 text-sm">
              How InterHive Sustains Free Access
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Hiring companies pay InterHive an enterprise recruitment fee when they hire pre-assessed, high-performing interns from our cohorts. Companies pay; students learn for free.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h4 className="font-black text-slate-900 text-sm">
              Zero College Pedigree Bias
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Tier-1, Tier-2, and Tier-3 college students are evaluated identically through automated skill challenges and mentor code audits. Your code determines your matching, not your college pin code.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
