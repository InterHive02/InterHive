import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Award, Clock, CheckCircle2, Video, Code, Brain, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAssessment } from '../hooks/use-assessment';

export const AssessmentsPage: React.FC = () => {
  const navigate = useNavigate();
  const { useAssessments } = useAssessment();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'results'>('upcoming');

  // PRD Assessments matching Image 2 Bottom-Left 1
  const assessments = [
    {
      id: 'asmt-aptitude',
      title: 'Aptitude Test',
      subtitle: 'Quantitative, Logical, Verbal',
      duration: '60 mins',
      questions: '40 Questions',
      type: 'Cognitive & Problem Solving',
      status: 'upcoming' as const,
      color: 'bg-blue-500',
      icon: Brain,
      score: 84,
      date: 'Available Now',
    },
    {
      id: 'asmt-technical',
      title: 'Technical Assessment',
      subtitle: 'Stack-specific coding test',
      duration: '90 mins',
      questions: '5 Problems',
      type: 'Hands-on Coding & System Design',
      status: 'upcoming' as const,
      color: 'bg-purple-500',
      icon: Code,
      score: 88,
      date: 'Available Now',
    },
    {
      id: 'asmt-hr',
      title: 'HR Round',
      subtitle: 'Behavioral and communication',
      duration: '30 mins',
      questions: 'Video Interview',
      type: 'Communication & Culture Fit',
      status: 'scheduled' as const,
      color: 'bg-rose-500',
      icon: Video,
      score: null,
      date: 'Scheduled: Oct 5, 2026 at 3:00 PM IST',
    },
  ];

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Assessment Center
          </h1>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
            Complete assessments to get selected for the PPO Track and unlock company matches.
          </p>
        </div>
      </div>

      {/* Tabs matching Image 2 Bottom-Left: Upcoming, Completed, Results */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
            activeTab === 'upcoming'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white dark:bg-[#151829] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
          }`}
        >
          Upcoming Tests (3)
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
            activeTab === 'completed'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white dark:bg-[#151829] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
          }`}
        >
          Completed (2)
        </button>
        <button
          onClick={() => setActiveTab('results')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
            activeTab === 'results'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white dark:bg-[#151829] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
          }`}
        >
          Diagnostic Results
        </button>
      </div>

      {/* Assessment Cards Grid matching Image 2 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {assessments.map(item => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="bg-white dark:bg-[#151829] rounded-[2rem] p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-6 hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl ${item.color} text-white flex items-center justify-center shadow-md shadow-blue-500/20`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-black px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {item.duration}
                  </span>
                </div>

                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1">
                  {item.title}
                </h3>
                <p className="text-xs font-bold text-blue-600 dark:text-blue-400">
                  {item.subtitle}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
                  {item.type} · <strong>{item.questions}</strong>
                </p>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                  <span>Status</span>
                  <span className={`font-black ${item.status === 'scheduled' ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {item.date}
                  </span>
                </div>

                {item.status === 'scheduled' ? (
                  <button
                    disabled
                    className="w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold text-xs cursor-not-allowed text-center"
                  >
                    Scheduled (Meeting Link Sent)
                  </button>
                ) : (
                  <button
                    onClick={() => navigate(`/assessments/${item.id}/take`)}
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-md shadow-blue-500/25 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span>Start Test</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Proctored Security Notice */}
      <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/40 flex items-center gap-3">
        <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
        <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
          <strong>Verified Proctoring:</strong> InterHive assessments are monitored for integrity. Scores are certified and shared directly with hiring managers at partner companies.
        </p>
      </div>

    </div>
  );
};
