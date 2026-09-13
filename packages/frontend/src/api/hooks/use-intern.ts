import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { internApi, InternProfile, InternApplication } from '../endpoints/intern.api';
import { toast } from 'react-hot-toast';

export const useIntern = () => {
  const queryClient = useQueryClient();

  // Profile
  const useProfile = () => {
    return useQuery({
      queryKey: ['intern', 'profile'],
      queryFn: async () => {
        const response = await internApi.getProfile();
        return response.data;
      },
    });
  };

  const createProfileMutation = useMutation({
    mutationFn: (data: InternProfile) => internApi.createProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['intern', 'profile'] });
      toast.success('Profile created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create profile');
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: Partial<InternProfile>) => internApi.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['intern', 'profile'] });
      toast.success('Profile updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    },
  });

  const useReadiness = () =>
    useQuery({
      queryKey: ['intern', 'readiness'],
      queryFn: async () => {
        try {
          const response = await internApi.getReadiness();
          return response.data;
        } catch (error) {
          return {
            overall: 0,
            breakdown: {
              technical: 0,
              problemSolving: 0,
              communication: 0,
              teamwork: 0,
              tools: 0,
            },
            history: [],
            lastUpdated: new Date().toISOString(),
          };
        }
      },
      retry: false,
    });

  // Applications
  const useApplications = (status?: string) =>
    useQuery({
      queryKey: ['intern', 'applications', status],
      queryFn: async () => {
        const response = await internApi.getApplications(status);
        return response.data;
      },
    });

  const applyMutation = useMutation({
    mutationFn: (data: InternApplication) => internApi.apply(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['intern', 'applications'] });
      toast.success('Application submitted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to submit application');
    },
  });

  const withdrawApplicationMutation = useMutation({
    mutationFn: (applicationId: string) => internApi.withdrawApplication(applicationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['intern', 'applications'] });
      toast.success('Application withdrawn successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to withdraw application');
    },
  });

  // Opportunities
  const useOpportunities = (page: number = 1, limit: number = 10) =>
    useQuery({
      queryKey: ['intern', 'opportunities', page, limit],
      queryFn: async () => {
        const response = await internApi.getOpportunities(page, limit);
        return response.data;
      },
    });

  // Upload Resume
  const uploadResumeMutation = useMutation({
    mutationFn: (file: File) => internApi.uploadResume(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['intern', 'profile'] });
      toast.success('Resume uploaded successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to upload resume');
    },
  });

  const deleteResumeMutation = useMutation({
    mutationFn: () => internApi.deleteResume(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['intern', 'profile'] });
      toast.success('Resume deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete resume');
    },
  });

  return {
    useProfile,
    createProfile: createProfileMutation.mutate,
    isCreatingProfile: createProfileMutation.isLoading,
    updateProfile: updateProfileMutation.mutate,
    isUpdatingProfile: updateProfileMutation.isLoading,
    useReadiness,
    useApplications,
    apply: applyMutation.mutate,
    isApplying: applyMutation.isLoading,
    withdrawApplication: withdrawApplicationMutation.mutate,
    isWithdrawing: withdrawApplicationMutation.isLoading,
    useOpportunities,
    uploadResume: uploadResumeMutation.mutate,
    isUploadingResume: uploadResumeMutation.isLoading,
    deleteResume: deleteResumeMutation.mutate,
    isDeletingResume: deleteResumeMutation.isLoading,
  };
};
