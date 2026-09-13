import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { attendanceApi, CheckInData, CheckOutData } from '../endpoints/attendance.api';
import { toast } from 'react-hot-toast';

export const useAttendance = () => {
  const queryClient = useQueryClient();

  // Employee
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

  const checkInMutation = useMutation({
    mutationFn: (data: CheckInData) => attendanceApi.checkIn(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      toast.success('Checked in successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to check in');
    },
  });

  const checkOutMutation = useMutation({
    mutationFn: (data: CheckOutData) => attendanceApi.checkOut(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      toast.success('Checked out successfully');
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

  // Admin/Manager
  const useAll = (params: { page: number; limit: number; date?: string; department?: string; status?: string }) =>
    useQuery({
      queryKey: ['attendance', 'all', params],
      queryFn: async () => {
        const response = await attendanceApi.getAll(params);
        return response.data;
      },
      enabled: false, // Only fetch when needed
    });

  const useDepartmentAttendance = (departmentId: string, date?: string) =>
    useQuery({
      queryKey: ['attendance', 'department', departmentId, date],
      queryFn: async () => {
        const response = await attendanceApi.getDepartmentAttendance(departmentId, date);
        return response.data;
      },
      enabled: !!departmentId,
    });

  const useUserAttendance = (userId: string, startDate?: string, endDate?: string) =>
    useQuery({
      queryKey: ['attendance', 'user', userId, startDate, endDate],
      queryFn: async () => {
        const response = await attendanceApi.getUserAttendance(userId, startDate, endDate);
        return response.data;
      },
      enabled: !!userId,
    });

  const correctAttendanceMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      attendanceApi.correctAttendance(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      toast.success('Attendance corrected successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to correct attendance');
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

  return {
    useToday,
    useHistory,
    useStats,
    checkIn: checkInMutation.mutate,
    isCheckingIn: checkInMutation.isLoading,
    checkOut: checkOutMutation.mutate,
    isCheckingOut: checkOutMutation.isLoading,
    startLunch: startLunchMutation.mutate,
    isStartingLunch: startLunchMutation.isLoading,
    endLunch: endLunchMutation.mutate,
    isEndingLunch: endLunchMutation.isLoading,
    useAll,
    useDepartmentAttendance,
    useUserAttendance,
    correctAttendance: correctAttendanceMutation.mutate,
    isCorrectingAttendance: correctAttendanceMutation.isLoading,
    useOverallStats,
  };
};
