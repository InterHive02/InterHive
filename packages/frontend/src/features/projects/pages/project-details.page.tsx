import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Users, Briefcase, FileText, Upload, Plus } from 'lucide-react';
import { ProjectTasks } from '../components/project-tasks';
import { ProjectTimeline } from '../components/project-timeline';
import { ProjectCollaborators } from '../components/project-collaborators';
import { UploadWorkModal } from '../components/upload-work-modal';
import { useProject } from '../hooks/use-project';

export const ProjectDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { useProject: useProjectDetails, updateTaskStatus, uploadFiles } = useProject();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const { data: project, isLoading } = useProjectDetails(id || '');

  const handleTaskStatusChange = (taskId: string, status: string) => {
    updateTaskStatus({ taskId, status });
  };

  const handleUpload = async (files: File[], description: string) => {
    if (id) {
      await uploadFiles({ projectId: id, files });
    }
  };

  if (isLoading || !project) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/projects')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{project.title}</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">{project.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            <Upload className="w-4 h-4" />
            Upload Work
          </button>
          <button
            onClick={() => navigate(`/projects/${id}/edit`)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors"
          >
            Edit Project
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
          <p className="font-semibold text-gray-900 dark:text-white capitalize mt-1">
            {project.status.replace('_', ' ')}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Progress</p>
          <p className="font-semibold text-gray-900 dark:text-white mt-1">{project.progress}%</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Team Size</p>
          <p className="font-semibold text-gray-900 dark:text-white mt-1">
            {project.teamSize?.min}-{project.teamSize?.max} members
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Duration</p>
          <p className="font-semibold text-gray-900 dark:text-white mt-1">
            {project.duration?.weeks} weeks
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ProjectTasks
            tasks={project.tasks?.map((task: any) => ({
              ...task,
              assignedTo: task.assignedTo?.map((user: any) => ({
                firstName: user.firstName,
                lastName: user.lastName,
                profilePhoto: user.profilePhoto,
              })) || [],
            })) || []}
            onTaskStatusChange={handleTaskStatusChange}
            onAddTask={() => navigate(`/projects/${id}/tasks/create`)}
          />

          <ProjectTimeline
            events={project.timeline || []}
          />
        </div>

        <div className="space-y-6">
          <ProjectCollaborators
            collaborators={[
              ...(project.assignedTo?.map((user: any) => ({
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                profilePhoto: user.profilePhoto,
                role: 'intern',
              })) || []),
              ...(project.mentors?.map((user: any) => ({
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                profilePhoto: user.profilePhoto,
                role: 'mentor',
              })) || []),
            ]}
          />
        </div>
      </div>

      {/* Upload Modal */}
      <UploadWorkModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUpload}
        title="Upload Project Work"
      />
    </div>
  );
};
