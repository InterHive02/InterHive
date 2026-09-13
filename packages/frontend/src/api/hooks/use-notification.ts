import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationApi } from '../endpoints/notification.api';
import { toast } from 'react-hot-toast';

export const useNotification = () => {
  const queryClient = useQueryClient();

  const useNotifications = (params: { page: number; limit: number; read?: boolean; type?: string }) =>
    useQuery({
      queryKey: ['notifications', params],
      queryFn: async () => {
        const response = await notificationApi.getAll(params);
        return response.data;
      },
    });

  const useUnreadCount = () =>
    useQuery({
      queryKey: ['notifications', 'unread-count'],
      queryFn: async () => {
        const response = await notificationApi.getUnreadCount();
        return response.data.count;
      },
      refetchInterval: 30000, // Refetch every 30 seconds
    });

  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => notificationApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to mark notification as read');
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationApi.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
      toast.success('All notifications marked as read');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to mark all as read');
    },
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: (id: string) => notificationApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete notification');
    },
  });

  const deleteAllNotificationsMutation = useMutation({
    mutationFn: () => notificationApi.deleteAll(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
      toast.success('All notifications deleted');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete all notifications');
    },
  });

  // Admin
  const broadcastMutation = useMutation({
    mutationFn: (data: { title: string; message: string; type: string; roles?: string[] }) =>
      notificationApi.broadcast(data),
    onSuccess: () => {
      toast.success('Broadcast sent successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to send broadcast');
    },
  });

  const useStats = () =>
    useQuery({
      queryKey: ['notifications', 'stats'],
      queryFn: async () => {
        const response = await notificationApi.getStats();
        return response.data;
      },
      enabled: false,
    });

  return {
    useNotifications,
    useUnreadCount,
    markAsRead: markAsReadMutation.mutate,
    isMarkingAsRead: markAsReadMutation.isLoading,
    markAllAsRead: markAllAsReadMutation.mutate,
    isMarkingAllAsRead: markAllAsReadMutation.isLoading,
    deleteNotification: deleteNotificationMutation.mutate,
    isDeletingNotification: deleteNotificationMutation.isLoading,
    deleteAllNotifications: deleteAllNotificationsMutation.mutate,
    isDeletingAllNotifications: deleteAllNotificationsMutation.isLoading,
    broadcast: broadcastMutation.mutate,
    isBroadcasting: broadcastMutation.isLoading,
    useStats,
  };
};
