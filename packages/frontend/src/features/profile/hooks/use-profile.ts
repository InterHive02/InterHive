import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../../api/hooks/use-auth';
import { internApi } from '../../../api/endpoints/intern.api';
import { userApi } from '../../../api/endpoints/user.api';
import { authApi } from '../../../api/endpoints/auth.api';
import { toast } from 'react-hot-toast';

export const useProfile = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const isIntern = user?.role === 'intern';

  const { data: profile, isLoading, refetch } = useQuery({
    queryKey: ['profile', user?.id, user?.role],
    queryFn: async () => {
      if (isIntern) {
        const response = await internApi.getProfile();
        return response.data;
      } else {
        try {
          const response = await userApi.getMyProfile();
          return response.data?.data || response.data;
        } catch {
          const authRes = await authApi.getProfile();
          return authRes.data?.user || authRes.data;
        }
      }
    },
    enabled: !!user,
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      if (isIntern) {
        return internApi.updateProfile(data);
      } else {
        return userApi.updateMyProfile(data);
      }
    },
    onSuccess: (response: any) => {
      // Update local storage user if returned
      const updatedUser = response?.data?.data || response?.data?.user || response?.data;
      if (updatedUser && typeof window !== 'undefined') {
        const existing = localStorage.getItem('user');
        if (existing) {
          try {
            const parsed = JSON.parse(existing);
            localStorage.setItem('user', JSON.stringify({ ...parsed, ...updatedUser }));
          } catch {}
        }
      }
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      queryClient.invalidateQueries({ queryKey: ['intern', 'profile'] });
      toast.success('Profile updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    },
  });

  const uploadProfilePhotoMutation = useMutation({
    mutationFn: async (file: File) => {
      // Convert to base64 data URL and save
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      if (isIntern) {
        await internApi.updateProfile({ personalInfo: { profilePhoto: dataUrl } });
        try {
          await userApi.updateMyProfile({ profilePhoto: dataUrl });
        } catch {}
      } else {
        await userApi.updateMyProfile({ profilePhoto: dataUrl });
      }
      return dataUrl;
    },
    onSuccess: (dataUrl: string) => {
      if (typeof window !== 'undefined') {
        const existing = localStorage.getItem('user');
        if (existing) {
          try {
            const parsed = JSON.parse(existing);
            localStorage.setItem('user', JSON.stringify({ ...parsed, profilePhoto: dataUrl }));
          } catch {}
        }
      }
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      queryClient.invalidateQueries({ queryKey: ['intern', 'profile'] });
      toast.success('Profile photo updated');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to upload photo');
    },
  });

  const uploadResumeMutation = useMutation({
    mutationFn: (file: File) => internApi.uploadResume(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Resume uploaded successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to upload resume');
    },
  });

  const deleteResumeMutation = useMutation({
    mutationFn: () => internApi.deleteResume(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Resume deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete resume');
    },
  });

  return {
    profile,
    userRole: user?.role || 'intern',
    isLoading,
    refetch,
    updateProfile: updateProfileMutation.mutateAsync,
    isUpdating: updateProfileMutation.isLoading,
    uploadProfilePhoto: uploadProfilePhotoMutation.mutate,
    isUploadingPhoto: uploadProfilePhotoMutation.isLoading,
    uploadResume: uploadResumeMutation.mutate,
    isUploadingResume: uploadResumeMutation.isLoading,
    deleteResume: deleteResumeMutation.mutate,
    isDeletingResume: deleteResumeMutation.isLoading,
  };
};
