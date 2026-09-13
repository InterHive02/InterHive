import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Award, ArrowLeft, CheckCircle2, TrendingUp, BookOpen } from 'lucide-react';
import { useAssessment } from '../hooks/use-assessment';

export const AssessmentResultsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { useResult } = useAssessment();
  const { data: result, isLoading } = useResult(id || '');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        to="/assessments"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Assessments
      </Link>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/60 p-8 text-center">
        <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Award className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Assessment Completed!</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Your skill benchmark score has been saved to your InterHive profile.
        </p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-750">
            <span className="text-xs text-gray-400 font-medium">Overall Score</span>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{result?.score || 88}%</p>
          </div>
          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-750">
            <span className="text-xs text-gray-400 font-medium">Readiness Level</span>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">Advanced</p>
          </div>
          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-750">
            <span className="text-xs text-gray-400 font-medium">Matching Boost</span>
            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">+25%</p>
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-4">
          <Link
            to="/opportunities"
            className="px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition-all"
          >
            Explore Matched Opportunities
          </Link>
        </div>
      </div>
    </div>
  );
};
