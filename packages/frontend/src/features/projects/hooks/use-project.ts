import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectApi } from '../../../api/endpoints/project.api';
import { toast } from 'react-hot-toast';

export const useProject = () => {
  const queryClient = useQueryClient();

  const useProjects = (params: any) =>
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
    mutationFn: (data: any) => projectApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create project');
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      projectApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project'] });
      toast.success('Project updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update project');
    },
  });

  const updateTaskStatusMutation = useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: string }) =>
      projectApi.updateTaskStatus(taskId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update task status');
    },
  });

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

  return {
    useProjects,
    useProject,
    useMyProjects,
    createProject: createProjectMutation.mutate,
    isCreatingProject: createProjectMutation.isLoading,
    updateProject: updateProjectMutation.mutate,
    isUpdatingProject: updateProjectMutation.isLoading,
    updateTaskStatus: updateTaskStatusMutation.mutate,
    isUpdatingTaskStatus: updateTaskStatusMutation.isLoading,
    uploadFiles: uploadFilesMutation.mutate,
    isUploadingFiles: uploadFilesMutation.isLoading,
  };
};
