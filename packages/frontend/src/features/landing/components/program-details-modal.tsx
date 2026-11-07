import React from 'react';
import { X, CheckCircle2, AlertTriangle, Calendar, Target, Award, ArrowRight, ShieldCheck } from 'lucide-react';
import { PROGRAM_CONFIGS, PROGRAM_DISCLAIMER, ProgramTypeKey } from '@interhive/shared';

interface ProgramDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  programType: ProgramTypeKey | null;
  onEnroll: (programType: ProgramTypeKey) => void;
}

export const ProgramDetailsModal: React.FC<ProgramDetailsModalProps> = ({
  isOpen,
  onClose,
  programType,
  onEnroll,
}) => {
  if (!isOpen || !programType) return null;

  const config = PROGRAM_CONFIGS[programType];
  if (!config) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-[800px] bg-surface dark:bg-surface-dark border border-slate-200 dark:border-[#2D3347] rounded-[20px] shadow-2xl flex flex-col max-h-[90dvh] overflow-hidden text-slate-900 dark:text-slate-100">

        {/* HEADER */}
        <div className="px-6 py-5 relative shrink-0 border-b border-slate-200 dark:border-[#2D3347] bg-gradient-to-r from-primary/5 via-transparent to-accent/5">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-2 rounded-[10px] transition-colors duration-150 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="pr-10">
            <div className="flex flex-wrap items-center gap-2 mb-2.5">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-[12px] font-bold bg-primary/10 text-primary dark:text-primary-light border border-primary/20">
                {config.badge}
              </span>
              <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                <Calendar className="w-3.5 h-3.5 text-primary" />
                {config.duration}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-[28px] font-bold tracking-tight text-slate-900 dark:text-slate-100 leading-tight">
              {config.title} Roadmap & Details
            </h2>
            <p className="text-[14px] text-slate-600 dark:text-slate-300 mt-1 max-w-2xl leading-relaxed">
              {config.shortDescription}
            </p>
          </div>
        </div>

        {/* BODY */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">

          {/* PPO Specific Blueprint Highlight */}
          {config.id === 'PPO' && (
            <div className="p-4 rounded-[16px] bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-emerald-600/10 border-2 border-blue-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-md shadow-blue-500/25">
                  PPO
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 block">
                    Structured 2-Phase Pathway
                  </span>
                  <p className="text-[14px] font-bold text-slate-900 dark:text-slate-100">
                    2 Months Training by InterHive + 6 Months Corporate Internship at Company = Direct PPO
                  </p>
                </div>
              </div>
              <span className="px-3 py-1.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 whitespace-nowrap self-start sm:self-auto">
                Assured Opportunity
              </span>
            </div>
          )}

          {/* Program Overview Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-[14px] bg-slate-50 dark:bg-[#12151E] border border-slate-200 dark:border-[#2D3347] flex items-start gap-3">
              <div className="p-2.5 rounded-[10px] bg-primary/10 text-primary shrink-0">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[12px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Main Objective</span>
                <p className="text-[14px] font-medium text-slate-800 dark:text-slate-200 mt-0.5 leading-snug">
                  {config.mainObjective}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-[14px] bg-slate-50 dark:bg-[#12151E] border border-slate-200 dark:border-[#2D3347] flex items-start gap-3">
              <div className="p-2.5 rounded-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[12px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Roadmap Target</span>
                <p className="text-[14px] font-medium text-slate-800 dark:text-slate-200 mt-0.5 leading-snug">
                  {config.summaryTarget}
                </p>
              </div>
            </div>
          </div>

          {/* Progression Roadmap Timeline */}
          <div>
            <h3 className="text-[18px] font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
              <span>{config.id === 'PPO' ? 'Stage-by-Stage Progression Roadmap' : 'Year-by-Year Progression Roadmap'}</span>
            </h3>

            <div className="space-y-4">
              {config.roadmap.map((yearStep, index) => (
                <div
                  key={index}
                  className="relative p-5 rounded-[16px] bg-slate-50/70 dark:bg-[#12151E]/80 border border-slate-200 dark:border-[#2D3347] hover:border-primary/40 transition-colors duration-200"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-[#2D3347]/60">
                    <div className="flex items-center gap-2.5">
                      <span className="px-2.5 py-1 rounded-[6px] text-[12px] font-bold bg-primary text-white shrink-0">
                        {yearStep.yearLabel}
                      </span>
                      <h4 className="text-[16px] font-bold text-slate-900 dark:text-slate-100">
                        {yearStep.stageName}
                      </h4>
                    </div>
                    <span className="text-[12.5px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 self-start sm:self-auto shrink-0">
                      Target: {yearStep.targetCount.replace(/^Target:\s*/i, '')}
                    </span>
                  </div>

                  <p className="text-[13px] font-medium text-slate-600 dark:text-slate-300 mt-3 mb-3">
                    Focus: {yearStep.targetFocus}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {yearStep.activities.map((activity, actIdx) => (
                      <div key={actIdx} className="flex items-start gap-2 text-[13px] text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{activity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Program Disclaimer Banner */}
          <div className="p-4 rounded-[14px] bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800/60 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="text-[12.5px] text-amber-800 dark:text-amber-300 leading-relaxed">
              <span className="font-semibold block mb-0.5">Academic Roadmap Policy</span>
              {PROGRAM_DISCLAIMER}
            </div>
          </div>

        </div>

        {/* FOOTER ACTIONS */}
        <div className="p-5 border-t border-slate-200 dark:border-[#2D3347] bg-slate-50 dark:bg-[#12151E] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-[12.5px] text-slate-500 dark:text-slate-400">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span>Official InterHive Industry Readiness Program</span>
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 min-h-[44px] rounded-[12px] border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-[14px] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-150 cursor-pointer flex items-center justify-center"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onEnroll(config.id);
              }}
              className="w-full sm:w-auto px-6 py-2.5 min-h-[44px] rounded-[12px] bg-primary hover:bg-primary-dark text-white font-semibold text-[14px] transition-colors duration-150 cursor-pointer shadow-lg flex items-center justify-center gap-2"
            >
              <span className="sm:hidden">Enroll in Program</span>
              <span className="hidden sm:inline">Enroll in {config.title}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
