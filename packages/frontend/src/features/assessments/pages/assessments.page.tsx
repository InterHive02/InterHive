import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, Clock, CheckCircle2, Video, Code, Brain, ArrowRight, ShieldCheck, AlertCircle, FileCheck, RefreshCw } from 'lucide-react';
import { useAssessment } from '../hooks/use-assessment';

export const AssessmentsPage: React.FC = () => {
  const navigate = useNavigate();
  const { useAssessments, useMyResults } = useAssessment();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'results'>('upcoming');

  const { data: apiAssessmentsData, isLoading: isAssessmentsLoading } = useAssessments({ page: 1, limit: 10 });
  const { data: myResultsData, isLoading: isResultsLoading } = useMyResults();

  const myResults: any[] = Array.isArray(myResultsData) ? myResultsData : [];

  // Standard verified assessments catalogue
  const standardAssessments = [
    {
      id: 'asmt-aptitude',
      title: 'Aptitude Diagnostic',
      subtitle: 'Quantitative, Logical & Verbal Reasoning',
      duration: '60 mins',
      questions: '40 Questions',
      type: 'Cognitive & Problem Solving',
      color: 'bg-blue-500',
      icon: Brain,
    },
    {
      id: 'asmt-technical',
      title: 'Technical Diagnostic',
      subtitle: 'Data Structures, Algorithms & Web Engineering',
      duration: '90 mins',
      questions: '5 Coding Problems',
      type: 'Hands-on Coding & System Design',
      color: 'bg-purple-500',
      icon: Code,
    },
    {
      id: 'asmt-hr',
      title: 'Communication & Fit Assessment',
      subtitle: 'Behavioral, Teamwork & Situational Judgment',
      duration: '30 mins',
      questions: '15 Scenario Questions',
      type: 'Professional Etiquette & Communication',
      color: 'bg-emerald-500',
      icon: Video,
    },
  ];

  // Merge any backend assessments if present
  const apiAssessmentsList = (apiAssessmentsData as any)?.data || (Array.isArray(apiAssessmentsData) ? apiAssessmentsData : []);
  const allAssessments = [...standardAssessments];
  if (Array.isArray(apiAssessmentsList) && apiAssessmentsList.length > 0) {
    apiAssessmentsList.forEach((item: any) => {
      const exists = allAssessments.some(a => a.id === item.id || a.id === item._id);
      if (!exists) {
        allAssessments.push({
          id: item.id || item._id,
          title: item.title,
          subtitle: item.description || 'Verified InterHive Assessment',
          duration: `${item.duration || 60} mins`,
          questions: `${item.questions?.length || 20} Questions`,
          type: item.type || 'Technical',
          color: 'bg-indigo-500',
          icon: Code,
        });
      }
    });
  }

  // Filter completed vs upcoming based on real results
  const completedAssessments = myResults.map((res: any) => {
    const matched = allAssessments.find(a => a.id === res.assessmentId || a.id === res.assessment?._id || a.id === res.assessment?.id);
    return {
      id: res.id || res._id,
      assessmentId: res.assessmentId || res.assessment?._id || matched?.id,
      title: res.assessment?.title || matched?.title || 'Skill Assessment',
      subtitle: matched?.subtitle || 'Verified Evaluation',
      score: typeof res.score === 'number' ? res.score : Math.round(res.percentage || 0),
      passed: res.passed ?? ((res.score || res.percentage || 0) >= 60),
      completedAt: res.createdAt ? new Date(res.createdAt).toLocaleDateString() : 'Recently Completed',
      icon: matched?.icon || Award,
      color: matched?.color || 'bg-indigo-500',
      duration: matched?.duration || '60 mins',
    };
  });

  const completedIds = new Set(completedAssessments.map(c => c.assessmentId));
  const upcomingAssessments = allAssessments.filter(a => !completedIds.has(a.id));

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Assessment Center
          </h1>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
            Complete standardized assessments to evaluate your corporate readiness and unlock direct company matching.
          </p>
        </div>
      </div>

      {/* Tabs with Dynamic Counts */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'upcoming'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white dark:bg-[#151829] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
          }`}
        >
          Available Tests ({upcomingAssessments.length})
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'completed'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white dark:bg-[#151829] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
          }`}
        >
          Completed Tests ({completedAssessments.length})
        </button>
        <button
          onClick={() => setActiveTab('results')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'results'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white dark:bg-[#151829] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
          }`}
        >
          Diagnostic Summary
        </button>
      </div>

      {/* TAB 1: AVAILABLE TESTS */}
      {activeTab === 'upcoming' && (
        <div className="space-y-6">
          {upcomingAssessments.length === 0 ? (
            <div className="bg-white dark:bg-[#151829] rounded-[2rem] p-10 border border-slate-200/80 dark:border-slate-800 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">All Assessments Completed!</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                You have finished all currently assigned diagnostic evaluations. Check your scores in the Completed tab or review your readiness score.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {upcomingAssessments.map(item => {
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
                        <span className="font-black text-emerald-600">Available to Take</span>
                      </div>

                      <button
                        onClick={() => navigate(`/assessments/${item.id}/take`)}
                        className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-md shadow-blue-500/25 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <span>Start Test</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: COMPLETED TESTS */}
      {activeTab === 'completed' && (
        <div className="space-y-6">
          {completedAssessments.length === 0 ? (
            <div className="bg-white dark:bg-[#151829] rounded-[2rem] p-10 border border-slate-200/80 dark:border-slate-800 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
                <FileCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">No Completed Assessments Yet</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Take an assessment from the Available Tests tab. Your verified score and proctored evaluation will appear here immediately upon submission.
              </p>
              <button
                onClick={() => setActiveTab('upcoming')}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                View Available Tests
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {completedAssessments.map(item => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-[#151829] rounded-[2rem] p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-6"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 rounded-2xl ${item.color} text-white flex items-center justify-center shadow-md`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <span className={`text-xs font-black px-3 py-1 rounded-full ${
                          item.passed
                            ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                            : 'bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                        }`}>
                          {item.passed ? 'Passed' : 'Needs Retake'}
                        </span>
                      </div>

                      <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1">
                        {item.title}
                      </h3>
                      <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                        {item.subtitle}
                      </p>

                      <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-[#1A1D33] border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Verified Score</span>
                        <span className="text-base font-black text-slate-900 dark:text-white">{item.score} / 100</span>
                      </div>
                    </div>

                    <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                        <span>Completed on</span>
                        <span className="font-bold text-slate-700 dark:text-slate-300">{item.completedAt}</span>
                      </div>
                      <button
                        onClick={() => navigate(`/assessments/${item.assessmentId || item.id}/results`)}
                        className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer"
                      >
                        View Full Report
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: DIAGNOSTIC SUMMARY */}
      {activeTab === 'results' && (
        <div className="bg-white dark:bg-[#151829] rounded-[2rem] p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">Diagnostic Skill Summary</h3>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                Benchmark evaluation compiled from verified proctored test submissions.
              </p>
            </div>
          </div>

          {completedAssessments.length === 0 ? (
            <div className="py-8 text-center space-y-2">
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                No diagnostic scores available yet.
              </p>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Once you complete your Aptitude or Technical diagnostic tests, your benchmark analytics and company readiness rankings will be displayed here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {completedAssessments.map(item => (
                <div key={item.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-[#1A1D33] border border-slate-200/80 dark:border-slate-800">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Standardized Test</span>
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">{item.title}</h4>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-2xl font-black text-slate-900 dark:text-white">{item.score}</span>
                    <span className="text-xs font-semibold text-slate-400">/ 100</span>
                    <span className={`text-xs font-bold ml-auto ${item.passed ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {item.passed ? 'Certified' : 'Under Review'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

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
