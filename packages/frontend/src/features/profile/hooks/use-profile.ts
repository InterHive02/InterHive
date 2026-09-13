import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../../api/hooks/use-auth';
import { internApi } from '../../../api/endpoints/intern.api';
import { toast } from 'react-hot-toast';

export const useProfile = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: profile, isLoading, refetch } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      const response = await internApi.getProfile();
      return response.data;
    },
    enabled: !!user,
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: any) => internApi.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Profile updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    },
  });

  const uploadResumeMutation = useMutation({
    mutationFn: (file: File) => internApi.uploadResume(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Resume uploaded successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to upload resume');
    },
  });

  const deleteResumeMutation = useMutation({
    mutationFn: () => internApi.deleteResume(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Resume deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete resume');
    },
  });

  return {
    profile,
    isLoading,
    refetch,
    updateProfile: updateProfileMutation.mutate,
    isUpdating: updateProfileMutation.isLoading,
    uploadResume: uploadResumeMutation.mutate,
    isUploadingResume: uploadResumeMutation.isLoading,
    deleteResume: deleteResumeMutation.mutate,
    isDeletingResume: deleteResumeMutation.isLoading,
  };
};
