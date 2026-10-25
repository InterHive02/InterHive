import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, ArrowRight, BookOpen, Trophy, ShieldCheck } from 'lucide-react';

interface QuickReadinessQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartTrackApplication: (trackCategory: string, programType: string) => void;
}

export const QuickReadinessQuizModal: React.FC<QuickReadinessQuizModalProps> = ({
  isOpen,
  onClose,
  onStartTrackApplication,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 'result'>(1);
  const [domain, setDomain] = useState<string>('Full Stack Engineering');
  const [year, setYear] = useState<string>('3rd');
  const [experience, setExperience] = useState<string>('Built 1-2 small projects or tutorials');

  if (!isOpen) return null;

  const handleNext = () => {
    if (step === 1) setStep(2);
    else if (step === 2) setStep(3);
    else if (step === 3) setStep('result');
  };

  const handleReset = () => {
    setStep(1);
    setDomain('Full Stack Engineering');
    setYear('3rd');
    setExperience('Built 1-2 small projects or tutorials');
  };

  const programTypeMap: Record<string, string> = {
    '1st': 'four_year',
    '2nd': 'three_year',
    '3rd': 'two_year',
    'final': 'one_year',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-900">
        
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base">
                2-Minute Skill & Track Recommender
              </h3>
              <p className="text-[11px] text-slate-500 font-semibold">
                Instant assessment recommendation · 100% Free
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider">Question 1 of 3</span>
                <h4 className="text-lg font-black text-slate-900 mt-0.5">
                  Which tech domain excites you most?
                </h4>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Choose where you want to build production-grade project experience.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  { id: 'Full Stack Engineering', title: 'Full Stack Web', desc: 'React, Node.js, Next.js, PostgreSQL' },
                  { id: 'DevOps & Cloud', title: 'Cloud & DevOps', desc: 'Docker, Kubernetes, AWS, CI/CD' },
                  { id: 'AI & Data Science', title: 'AI & Machine Learning', desc: 'Python, PyTorch, LLMs, Vector DBs' },
                  { id: 'UI/UX & Product Design', title: 'UI/UX & Product', desc: 'Figma, Design Systems, Frontend' },
                ].map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setDomain(d.id)}
                    className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer ${
                      domain === d.id
                        ? 'bg-blue-50/80 border-blue-500 ring-2 ring-blue-500/20 shadow-2xs'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className="font-extrabold text-xs text-slate-900 block leading-snug">{d.title}</span>
                    <span className="text-[10px] text-slate-500 font-medium block mt-0.5">{d.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider">Question 2 of 3</span>
                <h4 className="text-lg font-black text-slate-900 mt-0.5">
                  What is your current college academic standing?
                </h4>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Helps us align your training sprint with your semester and placement calendar.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: '1st', label: '1st Year Student', sub: '2028 / 2029 Batch' },
                  { id: '2nd', label: '2nd Year Student', sub: '2027 Batch' },
                  { id: '3rd', label: '3rd Year Student', sub: '2026 Batch (Primary PPO)' },
                  { id: 'final', label: 'Final Year / Passout', sub: '2025 Batch' },
                ].map((y) => (
                  <button
                    key={y.id}
                    type="button"
                    onClick={() => setYear(y.id)}
                    className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer ${
                      year === y.id
                        ? 'bg-blue-50/80 border-blue-500 ring-2 ring-blue-500/20 shadow-2xs'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className="font-extrabold text-xs text-slate-900 block leading-snug">{y.label}</span>
                    <span className="text-[10px] text-slate-500 font-medium block mt-0.5">{y.sub}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider">Question 3 of 3</span>
                <h4 className="text-lg font-black text-slate-900 mt-0.5">
                  What best describes your current practical coding experience?
                </h4>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  We match you at your exact skill level with live mentor guidance.
                </p>
              </div>

              <div className="space-y-2">
                {[
                  { id: 'Complete beginner (zero prior coding)', title: 'Complete beginner', desc: 'No prior project experience. Want to learn from foundations.' },
                  { id: 'Know basics and built college lab programs', title: 'College Lab & Basics', desc: 'Familiar with C/Java/Python syntax from college classes.' },
                  { id: 'Built 1-2 small projects or tutorials', title: 'Tutorials & Small Projects', desc: 'Have built simple apps following YouTube/courses, want production experience.' },
                  { id: 'Comfortable with Git and built full-stack apps', title: 'Advanced Student Builder', desc: 'Ready for production-grade sprint audits and immediate company matching.' },
                ].map((exp) => (
                  <button
                    key={exp.id}
                    type="button"
                    onClick={() => setExperience(exp.id)}
                    className={`w-full p-3.5 rounded-2xl text-left border transition-all cursor-pointer ${
                      experience === exp.id
                        ? 'bg-blue-50/80 border-blue-500 ring-2 ring-blue-500/20 shadow-2xs'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className="font-extrabold text-xs text-slate-900 block leading-snug">{exp.title}</span>
                    <span className="text-[10.5px] text-slate-500 font-medium block mt-0.5">{exp.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'result' && (
            <div className="space-y-5 text-center py-2 animate-fade-in">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-sm">
                <Trophy className="w-7 h-7" />
              </div>

              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full inline-block mb-1.5">
                  96% Curriculum Match Found
                </span>
                <h4 className="text-2xl font-black text-slate-900 leading-tight">
                  Recommended Track: {domain}
                </h4>
                <p className="text-xs text-slate-600 font-medium max-w-sm mx-auto mt-1">
                  Based on your {year === 'final' ? 'Final Year' : `${year} Year`} standing and background, this 6-month structured track is your fastest path to an industrial PPO.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-left grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Phase 1 (Month 1-2)</span>
                  <span className="font-extrabold text-slate-800 block mt-0.5">Hands-on Code Sprint</span>
                  <span className="text-[10.5px] text-slate-500">Live mentor code reviews</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Phase 2 (Month 3-6)</span>
                  <span className="font-extrabold text-emerald-600 block mt-0.5">Paid Corporate Internship</span>
                  <span className="text-[10.5px] text-slate-500">Stipend & direct PPO review</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5 justify-center">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onStartTrackApplication(domain, programTypeMap[year] || 'two_year');
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Start Free Track Assessment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full sm:w-auto px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  Retake Quiz
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {step !== 'result' && (
          <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-bold">
              Step {step} of 3
            </span>
            <div className="flex items-center gap-2">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep((s) => (s > 1 ? ((s - 1) as any) : 1))}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
                >
                  Back
                </button>
              )}
              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>{step === 3 ? 'See My Result' : 'Next'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
