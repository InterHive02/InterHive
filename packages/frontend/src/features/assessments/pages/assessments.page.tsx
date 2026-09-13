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

  const filteredAssessments = data?.data?.filter((assessment: any) => {
    const matchesSearch = assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.description?.toLowerCase().includes(searchTerm.toLowerCase());
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Assessments</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Test your skills and track your progress
          </p>
        </div>
        {/* Admin only */}
        <button
          onClick={() => navigate('/admin/assessments/create')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Assessment
        </button>
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
