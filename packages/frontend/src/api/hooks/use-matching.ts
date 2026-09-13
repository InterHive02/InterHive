import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { matchingApi, MatchRequest } from '../endpoints/matching.api';
import { toast } from 'react-hot-toast';

export const useMatching = () => {
  const queryClient = useQueryClient();

  const findMatchesMutation = useMutation({
    mutationFn: (data: MatchRequest) => matchingApi.findMatches(data),
    onSuccess: () => {
      toast.success('Matches found successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to find matches');
    },
  });

  const useMyMatches = (status?: string, page: number = 1, limit: number = 10) =>
    useQuery({
      queryKey: ['matches', 'my', status, page, limit],
      queryFn: async () => {
        const response = await matchingApi.getMyMatches(status, page, limit);
        return response.data;
      },
    });

  const useMatch = (id: string) =>
    useQuery({
      queryKey: ['match', id],
      queryFn: async () => {
        const response = await matchingApi.getMatch(id);
        return response.data;
      },
      enabled: !!id,
    });

  const acceptMatchMutation = useMutation({
    mutationFn: (id: string) => matchingApi.acceptMatch(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches'] });
      toast.success('Match accepted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to accept match');
    },
  });

  const rejectMatchMutation = useMutation({
    mutationFn: (id: string) => matchingApi.rejectMatch(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches'] });
      toast.success('Match rejected');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to reject match');
    },
  });

  const scheduleInterviewMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { interviewDate: string; interviewType: string; meetingLink?: string } }) =>
      matchingApi.scheduleInterview(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['match'] });
      toast.success('Interview scheduled successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to schedule interview');
    },
  });

  const makeOfferMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { amount: number; currency: string; period: string; startDate: string; duration: number; position: string; benefits: string[] } }) =>
      matchingApi.makeOffer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['match'] });
      toast.success('Offer made successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to make offer');
    },
  });

  const hireInternMutation = useMutation({
    mutationFn: (id: string) => matchingApi.hireIntern(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches'] });
      toast.success('Intern hired successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to hire intern');
    },
  });

  const batchMatchMutation = useMutation({
    mutationFn: ({ requirementId, internIds }: { requirementId: string; internIds: string[] }) =>
      matchingApi.batchMatch(requirementId, internIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches'] });
      toast.success('Batch matching completed');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to batch match');
    },
  });

  return {
    findMatches: findMatchesMutation.mutate,
    isFindingMatches: findMatchesMutation.isLoading,
    useMyMatches,
    useMatch,
    acceptMatch: acceptMatchMutation.mutate,
    isAcceptingMatch: acceptMatchMutation.isLoading,
    rejectMatch: rejectMatchMutation.mutate,
    isRejectingMatch: rejectMatchMutation.isLoading,
    scheduleInterview: scheduleInterviewMutation.mutate,
    isSchedulingInterview: scheduleInterviewMutation.isLoading,
    makeOffer: makeOfferMutation.mutate,
    isMakingOffer: makeOfferMutation.isLoading,
    hireIntern: hireInternMutation.mutate,
    isHiringIntern: hireInternMutation.isLoading,
    batchMatch: batchMatchMutation.mutate,
    isBatchMatching: batchMatchMutation.isLoading,
  };
};
