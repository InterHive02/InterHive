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
  const [selectedYear, setSelectedYear] = useState<'1st' | '2nd' | '3rd' | 'final'>('final');

  const plans = {
    '1st': {
      label: '1st Year (Batch 2030)',
      mobileLabel: '1st Yr (2030)',
      shortBadge: 'Exclusively 1st Year Students',
      targetSemester: '1st & 2nd Semester',
      programKey: 'FOUR_YEAR',
      heading: '4-Year Complete Industry-Readiness Journey',
      description: 'Exclusively for 1st-year students (Batch 2030). A degree-parallel path from programming fundamentals to 4 industrial internships and full-time hiring before graduation.',
      duration: '4 Academic Years (Parallel to College Degree)',
      milestones: [
        { month: 'Year 1 (2026-27)', title: 'Foundations & Real Code', desc: 'Core logic, data structures, Git branch workflows, pull requests & team sprints.' },
        { month: 'Year 2 (2027-28)', title: '2 Industrial Internships', desc: 'REST APIs, Docker, database systems & 2 industrial training / internship sprints.' },
        { month: 'Year 3 (2028-29)', title: 'Cloud & System Design', desc: 'Kubernetes, AWS cloud architecture, CI/CD pipelines & 2 domain internships.' },
        { month: 'Year 4 (2029-30)', title: 'Paid Internship & Placement', desc: '1 High-quality paid corporate internship, mock interviews & full-time PPO conversion.' },
      ],
      stipendBracket: '₹15,000 – ₹25,000 / month',
      targetOutcome: '4 Industrial Internships + Paid Final Internship',
      eligibility: 'Exclusively for 1st-year students (Batch 2030, graduating in 2030). Zero prior coding experience required.'
    },
    '2nd': {
      label: '2nd Year (Batch 2029)',
      mobileLabel: '2nd Yr (2029)',
      shortBadge: 'Exclusively 2nd Year Students',
      targetSemester: '3rd & 4th Semester',
      programKey: 'THREE_YEAR',
      heading: '3-Year Progressive Industrial Engineering Track',
      description: 'Exclusively for 2nd-year students (Batch 2029). Move beyond college lab theory into microservices, containerization, 4 industrial internships, and 4th-year paid corporate placement.',
      duration: '3 Academic Years (Parallel to College Degree)',
      milestones: [
        { month: 'Year 2 (2026-27)', title: 'Full-Stack Architecture', desc: 'React, Node.js, Python, TypeScript, database indexing & 2 industrial training sprints.' },
        { month: 'Year 3 (2027-28)', title: 'Cloud Systems & Internships', desc: 'Docker, cloud deployment, system design & 2 advanced domain internships.' },
        { month: 'Year 4 (2028-29)', title: 'Corporate Placement & PPO', desc: '1 High-quality paid corporate internship with partner tech companies and PPO offers.' },
      ],
      stipendBracket: '₹25,000 – ₹35,000 / month',
      targetOutcome: '4 Industrial Internships + Paid Corporate Internship',
      eligibility: 'Exclusively for 2nd-year students (Batch 2029, graduating in 2029). All engineering & CS streams.'
    },
    '3rd': {
      label: '3rd Year (Batch 2028)',
      mobileLabel: '3rd Yr (2028)',
      shortBadge: 'Exclusively 3rd Year Students',
      targetSemester: '5th & 6th Semester',
      programKey: 'TWO_YEAR',
      heading: '2-Year Advanced Engineering & Placement Track',
      description: 'Exclusively for 3rd-year students (Batch 2028). Intensive 3rd-year industrial training and internships, converting into a 4th-year high-quality paid corporate internship and confirmed PPO.',
      duration: '2 Academic Years (Parallel to College Degree)',
      milestones: [
        { month: 'Year 3 (2026-27)', title: 'Production Sprints & PR Audits', desc: 'Daily mentor standups, production codebases, clean PR reviews & 2 internship opportunities.' },
        { month: 'Year 4 (2027-28)', title: 'Paid Internship & Hiring Drives', desc: '1 High-quality paid corporate internship, direct company matching & PPO finalization.' },
      ],
      stipendBracket: '₹30,000 – ₹45,000 / month',
      targetOutcome: '2 Internships + 1 Paid Corporate Internship & PPO',
      eligibility: 'Exclusively for 3rd-year students (Batch 2028, graduating in 2028). CSE, IT, ECE, EE & non-CS.'
    },
    'final': {
      label: 'Final Year (Batch 2027) — PPO Program',
      mobileLabel: 'PPO (2027)',
      shortBadge: '2 Mo InterHive + 6 Mo Company',
      targetSemester: '7th & 8th Semester',
      programKey: 'PPO',
      heading: 'PPO Program: (2 Mo Training at InterHive + 6 Mo Internship at Company)',
      description: 'Exclusively for final-year students (Batch 2027). 2 months of intensive training & readiness done by the InterHive platform, followed by an assured opportunity to get a 6-month corporate internship at any partner company leading directly to Pre-Placement Offers (PPO).',
      duration: '8 Months (2 Mo InterHive Training + 6 Mo Company Internship)',
      milestones: [
        { month: 'Month 1–2 (At InterHive)', title: '2 Months Training & Readiness by InterHive Platform', desc: 'Industry-readiness training, production codebases, Git workflows, daily standups, clean code audits & benchmark scorecard.' },
        { month: 'Month 3–8 (At Partner Company)', title: '6 Months Corporate Internship Opportunity at Partner Company', desc: 'Assured opportunity for a 6-month corporate internship at any partner company with monthly stipend, production engineering & direct PPO conversion.' },
      ],
      stipendBracket: '₹35,000 – ₹50,000 / month',
      targetOutcome: 'Pre-Placement Offer (₹8 – ₹16 LPA Target PPO)',
      eligibility: 'Exclusively for final-year students (Batch 2027, graduating in 2027). Eligible for both 1-Year and PPO Programs.'
    }
  };

  const current = plans[selectedYear];

  return (
    <section className="py-8">
      <div className="space-y-6">

        {/* 4 Interactive Year Tab Selector */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-2 p-1.5 bg-slate-200/70 rounded-2xl max-w-3xl mx-auto">
          {(['1st', '2nd', '3rd', 'final'] as const).map((year) => (
            <button
              key={year}
              type="button"
              onClick={() => setSelectedYear(year)}
              className={`flex-1 sm:min-w-[150px] py-2.5 sm:py-3 px-2 sm:px-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer min-h-[44px] flex items-center justify-center ${
                selectedYear === year
                  ? 'bg-white text-blue-700 shadow-md shadow-slate-300/50 scale-[1.02]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <span className="sm:hidden">{plans[year].mobileLabel}</span>
              <span className="hidden sm:inline">{plans[year].label}</span>
            </button>
          ))}
        </div>

        {/* Timeline Details Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">

            {/* Left 7 Columns: Journey, Milestones, Objectives */}
            <div className="lg:col-span-7 p-6 sm:p-8 space-y-6 border-b lg:border-b-0 lg:border-r border-slate-200">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                    {current.shortBadge}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {current.duration}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                  {current.heading}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {current.description}
                </p>
              </div>

              {/* Milestones Flow */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                  Program Milestone Roadmap
                </h4>
                <div className="space-y-3">
                  {current.milestones.map((m, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                      <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{m.title}</span>
                          <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                            {m.month}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{m.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Eligibility Box */}
              <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-100 text-xs text-blue-900 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Target Eligibility: </strong>
                  {current.eligibility}
                </div>
              </div>
            </div>

            {/* Right 5 Columns: Stipend, Target Outcome & Instant CTA */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-b-3xl lg:rounded-b-none lg:rounded-r-3xl p-6 sm:p-8 text-white flex flex-col justify-between space-y-6">
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-slate-700 pb-4">
                  <span className="text-xs font-bold text-slate-400">Projected Monthly Stipend</span>
                  <span className="text-[11px] font-black text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                    Paid During Corporate Phase
                  </span>
                </div>

                <div>
                  <span className="block text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {current.stipendBracket}
                  </span>
                  <span className="text-[11px] text-slate-300 font-medium block mt-1">
                    {selectedYear === 'final'
                      ? 'During the 6-month corporate internship at partner company'
                      : 'During the corporate industrial internship phase'}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-white/10 border border-white/10 space-y-1">
                  <span className="text-[10px] font-bold text-slate-300 uppercase block tracking-wider">
                    Program Target Milestone
                  </span>
                  <span className="text-sm font-black text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    {current.targetOutcome}
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => onApplyForBatch(current.programKey)}
                  className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs sm:text-sm shadow-lg shadow-blue-600/30 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Apply for {selectedYear === 'final' ? 'Final Year (Batch 2027)' : `${selectedYear} Year`} Program</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-[10.5px] text-slate-400 text-center font-medium">
                  Complimentary initial benchmark evaluation · Direct corporate matching
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
