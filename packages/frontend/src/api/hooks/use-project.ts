import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectApi, Project } from '../endpoints/project.api';
import { toast } from 'react-hot-toast';

export const useProject = () => {
  const queryClient = useQueryClient();

  // Projects
  const useProjects = (params: { page: number; limit: number; status?: string; companyId?: string; assignedTo?: string; search?: string }) =>
    useQuery({
      queryKey: ['projects', params],
      queryFn: async () => {
        const response = await projectApi.getAll(params);
        return response.data;
      },
    });

  const useProject = (id: string) =>
    useQuery({
      queryKey: ['project', id],
      queryFn: async () => {
        const response = await projectApi.getById(id);
        return response.data;
      },
      enabled: !!id,
    });

  const useMyProjects = (status?: string) =>
    useQuery({
      queryKey: ['projects', 'my', status],
      queryFn: async () => {
        const response = await projectApi.getMyProjects(status);
        return response.data;
      },
    });

  const createProjectMutation = useMutation({
    mutationFn: (data: Project) => projectApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create project');
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Project> }) =>
      projectApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project'] });
      toast.success('Project updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update project');
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: (id: string) => projectApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete project');
    },
  });

  const assignInternsMutation = useMutation({
    mutationFn: ({ projectId, internIds }: { projectId: string; internIds: string[] }) =>
      projectApi.assignInterns(projectId, internIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project'] });
      toast.success('Interns assigned successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to assign interns');
    },
  });

  const startProjectMutation = useMutation({
    mutationFn: (id: string) => projectApi.startProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project'] });
      toast.success('Project started successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to start project');
    },
  });

  const completeProjectMutation = useMutation({
    mutationFn: (id: string) => projectApi.completeProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project'] });
      toast.success('Project completed successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to complete project');
    },
  });

  // Tasks
  const createTaskMutation = useMutation({
    mutationFn: ({ projectId, data }: { projectId: string; data: any }) =>
      projectApi.createTask(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project'] });
      toast.success('Task created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create task');
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ taskId, data }: { taskId: string; data: any }) =>
      projectApi.updateTask(taskId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project'] });
      toast.success('Task updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update task');
    },
  });

  const updateTaskStatusMutation = useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: string }) =>
      projectApi.updateTaskStatus(taskId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project'] });
      toast.success('Task status updated');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update task status');
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: (taskId: string) => projectApi.deleteTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project'] });
      toast.success('Task deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete task');
    },
  });

  // Uploads
  const uploadFilesMutation = useMutation({
    mutationFn: ({ projectId, files, taskId }: { projectId: string; files: File[]; taskId?: string }) =>
      projectApi.uploadFiles(projectId, files, taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', 'uploads'] });
      toast.success('Files uploaded successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to upload files');
    },
  });

  const useUploads = (projectId: string, taskId?: string) =>
    useQuery({
      queryKey: ['project', 'uploads', projectId, taskId],
      queryFn: async () => {
        const response = await projectApi.getUploads(projectId, taskId);
        return response.data;
      },
      enabled: !!projectId,
    });

  const deleteUploadMutation = useMutation({
    mutationFn: (uploadId: string) => projectApi.deleteUpload(uploadId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', 'uploads'] });
      toast.success('File deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete file');
    },
  });

  return {
    useProjects,
    useProject,
    useMyProjects,
    createProject: createProjectMutation.mutate,
    isCreatingProject: createProjectMutation.isLoading,
    updateProject: updateProjectMutation.mutate,
    isUpdatingProject: updateProjectMutation.isLoading,
    deleteProject: deleteProjectMutation.mutate,
    isDeletingProject: deleteProjectMutation.isLoading,
    assignInterns: assignInternsMutation.mutate,
    isAssigningInterns: assignInternsMutation.isLoading,
    startProject: startProjectMutation.mutate,
    isStartingProject: startProjectMutation.isLoading,
    completeProject: completeProjectMutation.mutate,
    isCompletingProject: completeProjectMutation.isLoading,
    createTask: createTaskMutation.mutate,
    isCreatingTask: createTaskMutation.isLoading,
    updateTask: updateTaskMutation.mutate,
    isUpdatingTask: updateTaskMutation.isLoading,
    updateTaskStatus: updateTaskStatusMutation.mutate,
    isUpdatingTaskStatus: updateTaskStatusMutation.isLoading,
    deleteTask: deleteTaskMutation.mutate,
    isDeletingTask: deleteTaskMutation.isLoading,
    uploadFiles: uploadFilesMutation.mutate,
    isUploadingFiles: uploadFilesMutation.isLoading,
    useUploads,
    deleteUpload: deleteUploadMutation.mutate,
    isDeletingUpload: deleteUploadMutation.isLoading,
  };
};
