import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { trainingApi, TrainingProgram } from '../endpoints/training.api';
import { toast } from 'react-hot-toast';

export const useTraining = () => {
  const queryClient = useQueryClient();

  // Programs
  const usePrograms = (params: { page: number; limit: number; status?: string; category?: string; search?: string }) =>
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

  const createProgramMutation = useMutation({
    mutationFn: (data: TrainingProgram) => trainingApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['training', 'programs'] });
      toast.success('Training program created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create training program');
    },
  });

  const updateProgramMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TrainingProgram> }) =>
      trainingApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['training', 'program'] });
      toast.success('Training program updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update training program');
    },
  });

  const deleteProgramMutation = useMutation({
    mutationFn: (id: string) => trainingApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['training', 'programs'] });
      toast.success('Training program deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete training program');
    },
  });

  const publishProgramMutation = useMutation({
    mutationFn: (id: string) => trainingApi.publish(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['training', 'program'] });
      toast.success('Training program published successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to publish training program');
    },
  });

  // Enrollment
  const useAvailablePrograms = () =>
    useQuery({
      queryKey: ['training', 'available'],
      queryFn: async () => {
        const response = await trainingApi.getAvailable();
        return response.data;
      },
    });

  const enrollMutation = useMutation({
    mutationFn: ({ programId, data }: { programId: string; data?: { source?: string; referralCode?: string } }) =>
      trainingApi.enroll(programId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['training', 'enrollments'] });
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

  const useEnrollment = (enrollmentId: string) =>
    useQuery({
      queryKey: ['training', 'enrollment', enrollmentId],
      queryFn: async () => {
        const response = await trainingApi.getEnrollment(enrollmentId);
        return response.data;
      },
      enabled: !!enrollmentId,
    });

  const updateProgressMutation = useMutation({
    mutationFn: ({ enrollmentId, moduleId, progress }: { enrollmentId: string; moduleId: string; progress: number }) =>
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

  const withdrawEnrollmentMutation = useMutation({
    mutationFn: (enrollmentId: string) => trainingApi.withdrawEnrollment(enrollmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['training', 'enrollments'] });
      toast.success('Withdrawn from training');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to withdraw');
    },
  });

  return {
    usePrograms,
    useProgram,
    createProgram: createProgramMutation.mutate,
    isCreatingProgram: createProgramMutation.isLoading,
    updateProgram: updateProgramMutation.mutate,
    isUpdatingProgram: updateProgramMutation.isLoading,
    deleteProgram: deleteProgramMutation.mutate,
    isDeletingProgram: deleteProgramMutation.isLoading,
    publishProgram: publishProgramMutation.mutate,
    isPublishingProgram: publishProgramMutation.isLoading,
    useAvailablePrograms,
    enroll: enrollMutation.mutate,
    isEnrolling: enrollMutation.isLoading,
    useMyEnrollments,
    useEnrollment,
    updateProgress: updateProgressMutation.mutate,
    isUpdatingProgress: updateProgressMutation.isLoading,
    completeEnrollment: completeEnrollmentMutation.mutate,
    isCompletingEnrollment: completeEnrollmentMutation.isLoading,
    withdrawEnrollment: withdrawEnrollmentMutation.mutate,
    isWithdrawingEnrollment: withdrawEnrollmentMutation.isLoading,
  };
};
