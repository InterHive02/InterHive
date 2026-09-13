import { useQuery } from '@tanstack/react-query';
import { userApi } from '../../../api/endpoints/user.api';
import { companyApi } from '../../../api/endpoints/company.api';
import { trainingApi } from '../../../api/endpoints/training.api';
import { assessmentApi } from '../../../api/endpoints/assessment.api';

export const useAdmin = () => {
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: async () => {
      const response = await userApi.getAll({ page: 1, limit: 100 });
      return response.data.data;
    },
  });

  const { data: companies, isLoading: companiesLoading } = useQuery({
    queryKey: ['admin', 'companies'],
    queryFn: async () => {
      const response = await companyApi.getAll({ page: 1, limit: 100 });
      return response.data.data;
    },
  });

  const { data: programs, isLoading: programsLoading } = useQuery({
    queryKey: ['admin', 'programs'],
    queryFn: async () => {
      const [trainingResponse, assessmentResponse] = await Promise.all([
        trainingApi.getAll({ page: 1, limit: 100 }),
        assessmentApi.getAll({ page: 1, limit: 100 }),
      ]);
      return [
        ...(trainingResponse.data.data || []).map((p: any) => ({ ...p, type: 'training' })),
        ...(assessmentResponse.data.data || []).map((a: any) => ({ ...a, type: 'assessment' })),
      ];
    },
  });

  const isLoading = usersLoading || companiesLoading || programsLoading;

  return {
    users,
    companies,
    programs,
    isLoading,
  };
};
