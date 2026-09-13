import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { trainingApi } from '../../../api/endpoints/training.api';
import { toast } from 'react-hot-toast';

export const useTraining = () => {
  const queryClient = useQueryClient();

  const usePrograms = (params: any) =>
    useQuery({
      queryKey: ['training', 'programs', params],
      queryFn: async () => {
        const response = await trainingApi.getAll(params);
        return response.data;
      },
    });

  const useProgram = (id: string) =>
    useQuery({
      queryKey: ['training', 'program', id],
      queryFn: async () => {
        const response = await trainingApi.getById(id);
        return response.data;
      },
      enabled: !!id,
    });

  const useAvailablePrograms = () =>
    useQuery({
      queryKey: ['training', 'available'],
      queryFn: async () => {
        const response = await trainingApi.getAvailable();
        return response.data;
      },
    });

  const enrollMutation = useMutation({
    mutationFn: ({ programId, data }: { programId: string; data?: any }) =>
      trainingApi.enroll(programId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['training'] });
      toast.success('Enrolled successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to enroll');
    },
  });

  const useMyEnrollments = () =>
    useQuery({
      queryKey: ['training', 'enrollments'],
      queryFn: async () => {
        const response = await trainingApi.getMyEnrollments();
        return response.data;
      },
    });

  const useEnrollment = (id: string) =>
    useQuery({
      queryKey: ['training', 'enrollment', id],
      queryFn: async () => {
        const response = await trainingApi.getEnrollment(id);
        return response.data;
      },
      enabled: !!id,
    });

  const updateProgressMutation = useMutation({
    mutationFn: ({ enrollmentId, moduleId, progress }: any) =>
      trainingApi.updateProgress(enrollmentId, moduleId, progress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['training', 'enrollment'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update progress');
    },
  });

  const completeEnrollmentMutation = useMutation({
    mutationFn: (enrollmentId: string) => trainingApi.completeEnrollment(enrollmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['training', 'enrollment'] });
      toast.success('Training completed successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to complete training');
    },
  });

  return {
    usePrograms,
    useProgram,
    useAvailablePrograms,
    enroll: enrollMutation.mutate,
    isEnrolling: enrollMutation.isLoading,
    useMyEnrollments,
    useEnrollment,
    updateProgress: updateProgressMutation.mutate,
    isUpdatingProgress: updateProgressMutation.isLoading,
    completeEnrollment: completeEnrollmentMutation.mutate,
    isCompletingEnrollment: completeEnrollmentMutation.isLoading,
  };
};
