import React, { useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Award, ArrowLeft, CheckCircle2, XCircle, TrendingUp, BookOpen, AlertCircle, RefreshCw } from 'lucide-react';
import { useAssessment } from '../hooks/use-assessment';
import { useAuth } from '../../../api/hooks/use-auth';

export const AssessmentResultsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { useResult } = useAssessment();
  const { data: apiResult } = useResult(id || '');

  // Load from local verified result store scoped to current user
  const localResult = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const key = user?.id ? `interhive_result_${user.id}_${id}` : `interhive_result_${id}`;
    const raw = localStorage.getItem(key);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        return null;
      }
    }
    return null;
  }, [user?.id, id]);

  const result = localResult || (apiResult as any)?.data || apiResult || null;

  if (!result) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 pb-16">
        <Link
          to="/assessments"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Assessments
        </Link>
        <div className="bg-white dark:bg-[#151829] rounded-[2rem] p-8 border border-slate-200/80 dark:border-slate-800 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">No Results Found for this Assessment</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You haven't completed this assessment yet. Take the test to record your verified score.
          </p>
          <button
            onClick={() => navigate(`/assessments/${id}/take`)}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
          >
            Start Assessment Now →
          </button>
        </div>
      </div>
    );
  }

  const score = result.score ?? Math.round(result.percentage || 0);
  const passed = result.passed ?? (score >= 60);

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      <Link
        to="/assessments"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Assessment Center
      </Link>

      <div className="bg-white dark:bg-[#151829] rounded-[2rem] shadow-sm border border-slate-200/80 dark:border-slate-800 p-8 text-center space-y-6">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${
          passed
            ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400'
            : 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400'
        }`}>
          {passed ? <Award className="w-8 h-8" /> : <RefreshCw className="w-8 h-8" />}
        </div>

        <div>
          <span className={`text-[11px] font-black uppercase px-3 py-1 rounded-full border ${
            passed 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300' 
              : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300'
          }`}>
            {passed ? 'Assessment Passed' : 'Needs Retake'}
          </span>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-3">
            {result.title || 'Diagnostic Evaluation'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Completed on {result.completedAt ? new Date(result.completedAt).toLocaleDateString() : 'Today'} · Scoped to your verified student profile
          </p>
        </div>

        {/* Real Score Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#1A1D33] border border-slate-200/80 dark:border-slate-800">
            <span className="text-xs text-slate-400 font-semibold">Verified Score</span>
            <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">{score}%</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#1A1D33] border border-slate-200/80 dark:border-slate-800">
            <span className="text-xs text-slate-400 font-semibold">Correct Answers</span>
            <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {result.correctCount ?? '—'} / {result.totalQuestions ?? '—'}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#1A1D33] border border-slate-200/80 dark:border-slate-800">
            <span className="text-xs text-slate-400 font-semibold">Readiness Status</span>
            <p className="text-xl font-black text-indigo-600 dark:text-indigo-400 mt-2">
              {score >= 80 ? 'Industry Ready' : score >= 60 ? 'Certified' : 'Developing'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-wrap justify-center gap-3">
          <Link
            to="/dashboard"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all"
          >
            Return to Dashboard
          </Link>
          <Link
            to="/training"
            className="px-6 py-2.5 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition-colors"
          >
            Continue Training Modules →
          </Link>
        </div>
      </div>
    </div>
  );
};
