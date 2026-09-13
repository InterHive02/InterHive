import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Plus } from 'lucide-react';
import { TrainingProgramCard } from '../components/training-program-card';
import { useTraining } from '../hooks/use-training';

export const TrainingPage: React.FC = () => {
  const navigate = useNavigate();
  const { useAvailablePrograms, useMyEnrollments, enroll } = useTraining();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState<string>('all');

  const { data: programsData, isLoading: programsLoading } = useAvailablePrograms();
  const { data: enrollmentsData, isLoading: enrollmentsLoading } = useMyEnrollments();

  const programs: any[] = Array.isArray(programsData) ? programsData : programsData?.data || [];
  const enrollments: any[] = Array.isArray(enrollmentsData) ? enrollmentsData : enrollmentsData?.data || [];

  const handleEnroll = (programId: string) => {
    enroll({ programId });
  };

  const filteredPrograms = programs?.filter((program: any) => {
    const matchesSearch = program.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = filterLevel === 'all' || program.level === filterLevel;
    return matchesSearch && matchesLevel;
  });

  const isLoading = programsLoading || enrollmentsLoading;

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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Training Programs</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Enroll in programs to enhance your skills
          </p>
        </div>
        {/* Admin only */}
        <button
          onClick={() => navigate('/admin/training/create')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Program
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search programs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          >
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="expert">Expert</option>
          </select>
        </div>
      </div>

      {/* My Enrollments */}
      {enrollments && enrollments.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            My Enrollments
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments.map((enrollment: any) => (
              <TrainingProgramCard
                key={enrollment.programId.id}
                program={enrollment.programId}
                enrollment={{
                  status: enrollment.status,
                  progress: enrollment.progress,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Available Programs */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Available Programs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrograms?.map((program: any) => (
            <TrainingProgramCard
              key={program.id}
              program={program}
              onEnroll={handleEnroll}
            />
          ))}
        </div>

        {filteredPrograms?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No training programs available</p>
          </div>
        )}
      </div>
    </div>
  );
};
