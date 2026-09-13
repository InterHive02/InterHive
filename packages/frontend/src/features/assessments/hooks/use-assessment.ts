import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { assessmentApi } from '../../../api/endpoints/assessment.api';
import { toast } from 'react-hot-toast';

export const useAssessment = () => {
  const queryClient = useQueryClient();

  const useAssessments = (params: any) =>
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

  const startAssessmentMutation = useMutation({
    mutationFn: (id: string) => assessmentApi.start(id),
    onSuccess: (data) => {
      toast.success('Assessment started');
      return data;
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to start assessment');
    },
  });

  const submitAssessmentMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      assessmentApi.submit(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['assessment'] });
      toast.success(data.data.passed ? 'Assessment passed!' : 'Assessment completed');
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

  return {
    useAssessments,
    useAssessment,
    startAssessment: startAssessmentMutation.mutate,
    startAssessmentAsync: startAssessmentMutation.mutateAsync,
    isStarting: startAssessmentMutation.isLoading,
    submitAssessment: submitAssessmentMutation.mutate,
    submitAssessmentAsync: submitAssessmentMutation.mutateAsync,
    isSubmitting: submitAssessmentMutation.isLoading,
    useResult,
  };
};
