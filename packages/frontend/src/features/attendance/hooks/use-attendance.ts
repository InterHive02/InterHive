import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { attendanceApi, CheckInData, CheckOutData } from '../../../api/endpoints/attendance.api';
import { toast } from 'react-hot-toast';

export const useAttendance = () => {
  const queryClient = useQueryClient();

  const useToday = () =>
    useQuery({
      queryKey: ['attendance', 'today'],
      queryFn: async () => {
        const response = await attendanceApi.getToday();
        return response.data;
      },
    });

  const useHistory = (startDate?: string, endDate?: string, page: number = 1, limit: number = 10) =>
    useQuery({
      queryKey: ['attendance', 'history', startDate, endDate, page, limit],
      queryFn: async () => {
        const response = await attendanceApi.getHistory(startDate, endDate, page, limit);
        return response.data;
      },
    });

  const useStats = (month?: number, year?: number) =>
    useQuery({
      queryKey: ['attendance', 'stats', month, year],
      queryFn: async () => {
        const response = await attendanceApi.getStats(month, year);
        return response.data;
      },
    });

  const useOverallStats = () =>
    useQuery({
      queryKey: ['attendance', 'overall-stats'],
      queryFn: async () => {
        const response = await attendanceApi.getOverallStats();
        return response.data;
      },
    });

  const checkInMutation = useMutation({
    mutationFn: (data: CheckInData) => attendanceApi.checkIn(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to check in');
    },
  });

  const checkOutMutation = useMutation({
    mutationFn: (data: CheckOutData) => attendanceApi.checkOut(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to check out');
    },
  });

  const startLunchMutation = useMutation({
    mutationFn: () => attendanceApi.startLunch(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      toast.success('Lunch break started');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to start lunch break');
    },
  });

  const endLunchMutation = useMutation({
    mutationFn: () => attendanceApi.endLunch(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      toast.success('Lunch break ended');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to end lunch break');
    },
  });

  return {
    useToday,
    useHistory,
    useStats,
    useOverallStats,
    checkIn: checkInMutation.mutate,
    isCheckingIn: checkInMutation.isLoading,
    checkOut: checkOutMutation.mutate,
    isCheckingOut: checkOutMutation.isLoading,
    startLunch: startLunchMutation.mutate,
    isStartingLunch: startLunchMutation.isLoading,
    endLunch: endLunchMutation.mutate,
    isEndingLunch: endLunchMutation.isLoading,
  };
};
