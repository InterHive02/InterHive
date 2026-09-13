import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../api/client';

export const useDashboard = () => {
  const useRecentActivities = () =>
    useQuery({
      queryKey: ['dashboard', 'activities'],
      queryFn: async () => {
        try {
          const response = await apiClient.get('/analytics/dashboard/activities');
          const data = response?.data?.data ?? response?.data ?? [];
          return Array.isArray(data) ? data : [];
        } catch (error) {
          console.error('Failed to fetch activities:', error);
          // Return empty array if API fails
          return [];
        }
      },
      staleTime: 60 * 1000,
    });

  return {
    useRecentActivities,
  };
};