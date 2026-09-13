import React, { useState } from 'react';
import { Check, X, HelpCircle } from 'lucide-react';

interface AssessmentQuestionProps {
  question: {
    id: string;
    type: 'multiple_choice' | 'multiple_select' | 'coding' | 'essay' | 'practical';
    difficulty: 'easy' | 'medium' | 'hard';
    category?: string;
    text: string;
    options?: { id: string; text: string }[];
    points: number;
    codeSnippet?: string;
  };
  index: number;
  totalQuestions: number;
  onAnswer: (questionId: string, answer: any) => void;
  currentAnswer?: any;
  showFeedback?: boolean;
  isCorrect?: boolean;
  explanation?: string;
}

export const AssessmentQuestion: React.FC<AssessmentQuestionProps> = ({
  question,
  index,
  totalQuestions,
  onAnswer,
  currentAnswer,
  showFeedback = false,
  isCorrect,
  explanation,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(
    currentAnswer || null
  );
  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    currentAnswer || []
  );
  const [textAnswer, setTextAnswer] = useState(currentAnswer || '');
  const [codeAnswer, setCodeAnswer] = useState(currentAnswer || '');

  const handleMultipleChoice = (optionId: string) => {
    setSelectedOption(optionId);
    onAnswer(question.id, optionId);
  };

  const handleMultipleSelect = (optionId: string) => {
    const newSelection = selectedOptions.includes(optionId)
      ? selectedOptions.filter(id => id !== optionId)
      : [...selectedOptions, optionId];
    setSelectedOptions(newSelection);
    onAnswer(question.id, newSelection);
  };

  const handleTextChange = (value: string) => {
    setTextAnswer(value);
    onAnswer(question.id, value);
  };

  const handleCodeChange = (value: string) => {
    setCodeAnswer(value);
    onAnswer(question.id, { language: 'javascript', code: value });
  };

  const renderQuestionType = () => {
    switch (question.type) {
      case 'multiple_choice':
        return (
          <div className="space-y-3">
            {question.options?.map((option) => (
              <label
                key={option.id}
                className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedOption === option.id
                    ? 'border-primary bg-primary/5 dark:bg-primary/10'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                } ${showFeedback && selectedOption === option.id ? (
                  isCorrect ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-red-500 bg-red-50 dark:bg-red-900/20'
                ) : ''}`}
              >
                <input
                  type="radio"
                  name={question.id}
                  value={option.id}
                  checked={selectedOption === option.id}
                  onChange={() => handleMultipleChoice(option.id)}
                  disabled={showFeedback}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-gray-900 dark:text-white">{option.text}</span>
                {showFeedback && selectedOption === option.id && (
                  isCorrect ? (
                    <Check className="w-5 h-5 text-green-500 ml-auto" />
                  ) : (
                    <X className="w-5 h-5 text-red-500 ml-auto" />
                  )
                )}
              </label>
            ))}
          </div>
        );

      case 'multiple_select':
        return (
          <div className="space-y-3">
            {question.options?.map((option) => (
              <label
                key={option.id}
                className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedOptions.includes(option.id)
                    ? 'border-primary bg-primary/5 dark:bg-primary/10'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <input
                  type="checkbox"
                  value={option.id}
                  checked={selectedOptions.includes(option.id)}
                  onChange={() => handleMultipleSelect(option.id)}
                  disabled={showFeedback}
                  className="w-4 h-4 text-primary rounded"
                />
                <span className="text-gray-900 dark:text-white">{option.text}</span>
              </label>
            ))}
          </div>
        );

      case 'essay':
        return (
          <textarea
            value={textAnswer}
            onChange={(e) => handleTextChange(e.target.value)}
            disabled={showFeedback}
            placeholder="Type your answer here..."
            className="w-full h-40 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white"
          />
        );

      case 'coding':
        return (
          <div className="space-y-4">
            {question.codeSnippet && (
              <div className="p-4 bg-gray-900 rounded-lg">
                <pre className="text-sm text-gray-300 overflow-x-auto">
                  <code>{question.codeSnippet}</code>
                </pre>
              </div>
            )}
            <textarea
              value={codeAnswer}
              onChange={(e) => handleCodeChange(e.target.value)}
              disabled={showFeedback}
              placeholder="Write your code here..."
              className="w-full h-48 p-3 font-mono text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-8 h-8 bg-primary/10 text-primary rounded-lg font-semibold text-sm">
            {index + 1}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            of {totalQuestions}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {question.category && (
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded-lg text-gray-600 dark:text-gray-300">
              {question.category}
            </span>
          )}
          <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-lg font-medium">
            {question.points} pts
          </span>
        </div>
      </div>

      <p className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        {question.text}
      </p>

      {renderQuestionType()}

      {showFeedback && explanation && (
        <div className={`mt-4 p-4 rounded-lg ${isCorrect ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
          <div className="flex items-center gap-2">
            {isCorrect ? (
              <Check className="w-5 h-5 text-green-500" />
            ) : (
              <X className="w-5 h-5 text-red-500" />
            )}
            <span className={`font-medium ${isCorrect ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
              {isCorrect ? 'Correct!' : 'Incorrect'}
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            {explanation}
          </p>
        </div>
      )}
    </div>
  );
};
