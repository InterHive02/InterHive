import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Plus } from 'lucide-react';
import { AssessmentCard } from '../components/assessment-card';
import { useAssessment } from '../hooks/use-assessment';

export const AssessmentsPage: React.FC = () => {
  const navigate = useNavigate();
  const { useAssessments, startAssessment } = useAssessment();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const { data, isLoading } = useAssessments({
    page: 1,
    limit: 10,
    status: 'published',
  });

  const handleStartAssessment = (id: string) => {
    startAssessment(id);
    navigate(`/assessments/${id}/take`);
  };

  const defaultAssessments = [
    {
      id: 'asmt-01',
      title: 'Full-Stack JavaScript & TypeScript Diagnostic',
      description: 'Test core mastery in modern ESNext, TypeScript type system, React hooks, and Node.js event loops.',
      type: 'technical',
      difficulty: 'intermediate',
      duration: 45,
      totalQuestions: 30,
      totalScore: 100,
      passingScore: 75,
      skillsAssessed: [
        { name: 'TypeScript' },
        { name: 'React' },
        { name: 'Node.js' },
        { name: 'REST APIs' },
      ],
    },
    {
      id: 'asmt-02',
      title: 'Backend Microservices & MongoDB Design',
      description: 'Evaluate schema normalization, aggregation pipelines, RESTful conventions, and JWT security.',
      type: 'coding',
      difficulty: 'advanced',
      duration: 60,
      totalQuestions: 25,
      totalScore: 100,
      passingScore: 80,
      skillsAssessed: [
        { name: 'NestJS' },
        { name: 'MongoDB' },
        { name: 'Microservices' },
        { name: 'Security' },
      ],
    },
    {
      id: 'asmt-03',
      title: 'Industrial Agile & System Architecture Evaluation',
      description: 'System design principles, database indexing, Git workflows, and code review standards.',
      type: 'aptitude',
      difficulty: 'beginner',
      duration: 30,
      totalQuestions: 20,
      totalScore: 100,
      passingScore: 70,
      skillsAssessed: [
        { name: 'System Design' },
        { name: 'Git' },
        { name: 'Agile' },
      ],
    },
  ];

  const fetchedAssessments = Array.isArray(data)
    ? data
    : (data as any)?.data || [];

  const assessments = fetchedAssessments.length > 0 ? fetchedAssessments : defaultAssessments;

  const filteredAssessments = assessments.filter((assessment: any) => {
    const title = assessment.title || '';
    const desc = assessment.description || '';
    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      desc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || assessment.type === filterType;
    return matchesSearch && matchesType;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Technical Assessments</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Pre-vetted skill evaluations, technical benchmarks, and qualification quizzes
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search assessments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          >
            <option value="all">All Types</option>
            <option value="technical">Technical</option>
            <option value="soft_skills">Soft Skills</option>
            <option value="aptitude">Aptitude</option>
            <option value="coding">Coding</option>
          </select>
        </div>
      </div>

      {/* Assessment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssessments?.map((assessment: any) => (
          <AssessmentCard
            key={assessment.id}
            assessment={assessment}
            onStart={handleStartAssessment}
          />
        ))}
      </div>

      {filteredAssessments?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No assessments found</p>
        </div>
      )}
    </div>
  );
};
