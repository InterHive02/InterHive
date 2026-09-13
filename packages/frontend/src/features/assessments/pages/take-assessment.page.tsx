import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, AlertCircle } from 'lucide-react';
import { AssessmentQuestion } from '../components/assessment-question';
import { useAssessment } from '../hooks/use-assessment';
import { toast } from 'react-hot-toast';

export const TakeAssessmentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { useAssessment, startAssessment, submitAssessment } = useAssessment();
  const { data: assessment, isLoading } = useAssessment(id || '');
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultId, setResultId] = useState<string | null>(null);

  useEffect(() => {
    if (assessment) {
      startAssessment(id!, {
        onSuccess: (data) => {
          setResultId(data.resultId);
          setTimeRemaining(data.timeLimit * 60);
        },
      });
    }
  }, [assessment, id, startAssessment]);

  useEffect(() => {
    if (timeRemaining <= 0) return;
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  const handleAnswer = (questionId: string, answer: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmit = async () => {
    if (!resultId) return;

    try {
      setIsSubmitting(true);
      const answerList = Object.entries(answers).map(([questionId, answer]) => ({
        questionId,
        answer,
      }));

      await submitAssessment({
        id: id!,
        data: {
          resultId,
          answers: answerList,
        },
      });

      navigate(`/assessments/${id}/results`);
      toast.success('Assessment submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit assessment');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !assessment) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const currentQuestion = assessment.questions?.[currentQuestionIndex];
  const totalQuestions = assessment.questions?.length || 0;
  const answeredCount = Object.keys(answers).length;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {assessment.title}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
              timeRemaining < 300 ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' : 'bg-gray-100 dark:bg-gray-700'
            }`}>
              <Clock className="w-4 h-4" />
              <span className="font-mono font-medium">{formatTime(timeRemaining)}</span>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {answeredCount}/{totalQuestions} answered
            </span>
          </div>
        </div>
        {/* Progress bar */}
        <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="h-2 rounded-full bg-primary transition-all duration-300"
            style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      {currentQuestion && (
        <AssessmentQuestion
          question={currentQuestion}
          index={currentQuestionIndex}
          totalQuestions={totalQuestions}
          onAnswer={handleAnswer}
          currentAnswer={answers[currentQuestion.id]}
        />
      )}

      {/* Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentQuestionIndex === 0}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentQuestionIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
            disabled={currentQuestionIndex === totalQuestions - 1}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>

        <div className="flex items-center gap-4">
          {answeredCount < totalQuestions && (
            <div className="flex items-center gap-1 text-sm text-yellow-600 dark:text-yellow-400">
              <AlertCircle className="w-4 h-4" />
              {totalQuestions - answeredCount} questions remaining
            </div>
          )}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || answeredCount < totalQuestions}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
          </button>
        </div>
      </div>
    </div>
  );
};
