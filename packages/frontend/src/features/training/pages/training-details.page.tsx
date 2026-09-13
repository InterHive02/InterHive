import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { TrainingModule } from '../components/training-module';
import { TrainingProgress } from '../components/training-progress';
import { TrainingResources } from '../components/training-resources';
import { useTraining } from '../hooks/use-training';

export const TrainingDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { useProgram, useEnrollment, updateProgress, completeEnrollment } = useTraining();

  const { data: programData, isLoading: programLoading } = useProgram(id || '');
  const { data: enrollmentData, isLoading: enrollmentLoading } = useEnrollment(id || '');

  const program: any = programData?.data || programData;
  const enrollment: any = enrollmentData?.data || enrollmentData;

  const handleModuleStart = (_moduleId: string) => {
    // Update module status
  };

  const handleModuleComplete = (moduleId: string) => {
    if (enrollment?.id) {
      updateProgress({
        enrollmentId: enrollment.id,
        moduleId,
        progress: 100,
      });
    }
  };

  const isLoading = programLoading || enrollmentLoading;

  if (isLoading || !program || !enrollment) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const moduleStats = {
    completed: enrollment.moduleProgress?.filter((m: any) => m.status === 'completed')?.length || 0,
    inProgress: enrollment.moduleProgress?.filter((m: any) => m.status === 'in_progress')?.length || 0,
    locked: enrollment.moduleProgress?.filter((m: any) => m.status === 'locked')?.length || 0,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/training')}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{program.title}</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">{program.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Modules */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Modules
            </h2>
            {program.modules?.map((module: any, index: number) => {
              const moduleProgress = enrollment.moduleProgress?.find(
                (p: any) => p.moduleId === module.id
              );
              return (
                <TrainingModule
                  key={module.id}
                  module={module}
                  progress={{
                    status: moduleProgress?.status || 'locked',
                    progress: moduleProgress?.progress || 0,
                    score: moduleProgress?.score,
                  }}
                  index={index}
                  onStart={handleModuleStart}
                  onComplete={handleModuleComplete}
                />
              );
            })}
          </div>

          {/* Resources */}
          {program.resources && program.resources.length > 0 && (
            <TrainingResources resources={program.resources} />
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <TrainingProgress
            program={program}
            enrollment={enrollment}
            moduleStats={moduleStats}
          />
        </div>
      </div>
    </div>
  );
};
