import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { assessmentApi, Assessment, AssessmentSubmission } from '../endpoints/assessment.api';
import { toast } from 'react-hot-toast';

export const useAssessment = () => {
  const queryClient = useQueryClient();

  // Admin
  const useAssessments = (params: { page: number; limit: number; type?: string; category?: string; status?: string }) =>
    useQuery({
      queryKey: ['assessments', params],
      queryFn: async () => {
        const response = await assessmentApi.getAll(params);
        return response.data;
      },
    });

  const useAssessment = (id: string) =>
    useQuery({
      queryKey: ['assessment', id],
      queryFn: async () => {
        const response = await assessmentApi.getById(id);
        return response.data;
      },
      enabled: !!id,
    });

  const createAssessmentMutation = useMutation({
    mutationFn: (data: Assessment) => assessmentApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assessments'] });
      toast.success('Assessment created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create assessment');
    },
  });

  const updateAssessmentMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Assessment> }) =>
      assessmentApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assessment'] });
      toast.success('Assessment updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update assessment');
    },
  });

  const deleteAssessmentMutation = useMutation({
    mutationFn: (id: string) => assessmentApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assessments'] });
      toast.success('Assessment deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete assessment');
    },
  });

  const publishAssessmentMutation = useMutation({
    mutationFn: (id: string) => assessmentApi.publish(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assessment'] });
      toast.success('Assessment published successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to publish assessment');
    },
  });

  // Taking
  const startAssessmentMutation = useMutation({
    mutationFn: (id: string) => assessmentApi.start(id),
    onSuccess: () => {
      toast.success('Assessment started');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to start assessment');
    },
  });

  const submitAssessmentMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: AssessmentSubmission }) =>
      assessmentApi.submit(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['assessment', 'results'] });
      const passed = data.data.passed;
      toast.success(passed ? 'Assessment passed!' : 'Assessment completed');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to submit assessment');
    },
  });

  const useResult = (id: string) =>
    useQuery({
      queryKey: ['assessment', 'result', id],
      queryFn: async () => {
        const response = await assessmentApi.getResult(id);
        return response.data;
      },
      enabled: !!id,
    });

  const useMyResults = () =>
    useQuery({
      queryKey: ['assessment', 'my-results'],
      queryFn: async () => {
        const response = await assessmentApi.getMyResults();
        return response.data;
      },
    });

  return {
    useAssessments,
    useAssessment,
    createAssessment: createAssessmentMutation.mutate,
    isCreatingAssessment: createAssessmentMutation.isLoading,
    updateAssessment: updateAssessmentMutation.mutate,
    isUpdatingAssessment: updateAssessmentMutation.isLoading,
    deleteAssessment: deleteAssessmentMutation.mutate,
    isDeletingAssessment: deleteAssessmentMutation.isLoading,
    publishAssessment: publishAssessmentMutation.mutate,
    isPublishingAssessment: publishAssessmentMutation.isLoading,
    startAssessment: startAssessmentMutation.mutate,
    isStartingAssessment: startAssessmentMutation.isLoading,
    submitAssessment: submitAssessmentMutation.mutate,
    isSubmittingAssessment: submitAssessmentMutation.isLoading,
    useResult,
    useMyResults,
  };
};
