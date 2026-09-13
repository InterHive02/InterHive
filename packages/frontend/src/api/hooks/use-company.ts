import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { companyApi, CompanyProfile, CompanyRequirement } from '../endpoints/company.api';
import { toast } from 'react-hot-toast';

export const useCompany = () => {
  const queryClient = useQueryClient();

  // Profile
  const useProfile = (id?: string) =>
    useQuery({
      queryKey: ['company', 'profile', id],
      queryFn: async () => {
        if (id) {
          const response = await companyApi.getById(id);
          return response.data;
        }
        // Get current company profile
        const response = await companyApi.getAll({ page: 1, limit: 1 });
        return response.data.data[0];
      },
      enabled: id !== undefined,
    });

  const useCompanies = (params: { page: number; limit: number; search?: string; industry?: string; status?: string }) =>
    useQuery({
      queryKey: ['companies', params],
      queryFn: async () => {
        const response = await companyApi.getAll(params);
        return response.data;
      },
    });

  const createCompanyMutation = useMutation({
    mutationFn: (data: CompanyProfile) => companyApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast.success('Company created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create company');
    },
  });

  const updateCompanyMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CompanyProfile> }) =>
      companyApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company'] });
      toast.success('Company updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update company');
    },
  });

  // Requirements
  const useRequirements = (companyId: string, status?: string) =>
    useQuery({
      queryKey: ['company', 'requirements', companyId, status],
      queryFn: async () => {
        const response = await companyApi.getRequirements(companyId, status);
        return response.data;
      },
      enabled: !!companyId,
    });

  const createRequirementMutation = useMutation({
    mutationFn: ({ companyId, data }: { companyId: string; data: CompanyRequirement }) =>
      companyApi.createRequirement(companyId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company', 'requirements'] });
      toast.success('Requirement created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create requirement');
    },
  });

  const updateRequirementMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CompanyRequirement> }) =>
      companyApi.updateRequirement(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company', 'requirements'] });
      toast.success('Requirement updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update requirement');
    },
  });

  const deleteRequirementMutation = useMutation({
    mutationFn: (id: string) => companyApi.deleteRequirement(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company', 'requirements'] });
      toast.success('Requirement deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete requirement');
    },
  });

  // Matches
  const useMatches = (companyId: string, requirementId?: string, limit?: number) =>
    useQuery({
      queryKey: ['company', 'matches', companyId, requirementId, limit],
      queryFn: async () => {
        const response = await companyApi.getMatches(companyId, requirementId, limit);
        return response.data;
      },
      enabled: !!companyId,
    });

  return {
    useProfile,
    useCompanies,
    createCompany: createCompanyMutation.mutate,
    isCreatingCompany: createCompanyMutation.isLoading,
    updateCompany: updateCompanyMutation.mutate,
    isUpdatingCompany: updateCompanyMutation.isLoading,
    useRequirements,
    createRequirement: createRequirementMutation.mutate,
    isCreatingRequirement: createRequirementMutation.isLoading,
    updateRequirement: updateRequirementMutation.mutate,
    isUpdatingRequirement: updateRequirementMutation.isLoading,
    deleteRequirement: deleteRequirementMutation.mutate,
    isDeletingRequirement: deleteRequirementMutation.isLoading,
    useMatches,
  };
};
