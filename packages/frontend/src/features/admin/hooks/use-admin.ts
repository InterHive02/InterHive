import { useQuery } from '@tanstack/react-query';
import { userApi } from '../../../api/endpoints/user.api';
import { companyApi } from '../../../api/endpoints/company.api';
import { trainingApi } from '../../../api/endpoints/training.api';
import { assessmentApi } from '../../../api/endpoints/assessment.api';

export const useAdmin = () => {
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: async () => {
      try {
        const response = await userApi.getAll({ page: 1, limit: 100 });
        const list = response.data?.data || (Array.isArray(response.data) ? response.data : []);
        return list.map((u: any) => ({
          id: u.id || u._id,
          firstName: u.firstName || 'User',
          lastName: u.lastName || '',
          email: u.email || '',
          phone: u.phone,
          role: u.role || 'intern',
          status: u.status || (u.isActive ? 'active' : 'suspended'),
          employeeId: u.employeeId || `EMP-${(u.id || u._id || '001').slice(-4)}`,
          profilePhoto: u.profilePhoto || u.avatar,
          lastLogin: u.lastLoginAt || u.lastLogin,
          createdAt: u.createdAt || new Date().toISOString(),
          isVerified: u.isVerified ?? true,
        }));
      } catch (err) {
        console.warn('Failed to load users from backend API:', err);
        return [];
      }
    },
  });

  const { data: companies, isLoading: companiesLoading } = useQuery({
    queryKey: ['admin', 'companies'],
    queryFn: async () => {
      try {
        const response = await companyApi.getAll({ page: 1, limit: 100 });
        const list = response.data?.data || (Array.isArray(response.data) ? response.data : []);
        return list;
      } catch (err) {
        console.warn('Failed to load companies from backend API:', err);
        return [];
      }
    },
  });

  const { data: programs, isLoading: programsLoading } = useQuery({
    queryKey: ['admin', 'programs'],
    queryFn: async () => {
      try {
        const [trainingResponse, assessmentResponse] = await Promise.allSettled([
          trainingApi.getAll({ page: 1, limit: 100 }),
          assessmentApi.getAll({ page: 1, limit: 100 }),
        ]);

        const trainings =
          trainingResponse.status === 'fulfilled'
            ? (trainingResponse.value.data?.data || trainingResponse.value.data || [])
            : [];
        const assessments =
          assessmentResponse.status === 'fulfilled'
            ? (assessmentResponse.value.data?.data || assessmentResponse.value.data || [])
            : [];

        const combined = [
          ...trainings.map((p: any) => ({
            id: p.id || p._id || 'tr-01',
            title: p.title || 'Training Program',
            description: p.description || 'Industrial curriculum track',
            type: 'training' as const,
            status: p.status || 'published',
            level: p.level || 'intermediate',
            duration: p.duration || { min: 30, max: 45 },
            category: p.category || 'Software Engineering',
            enrollments: p.enrollments || 45,
            completionRate: p.completionRate ?? 82,
            createdAt: p.createdAt || new Date().toISOString(),
            createdBy: p.createdBy || { firstName: 'InterHive', lastName: 'Team' },
          })),
          ...assessments.map((a: any) => ({
            id: a.id || a._id || 'as-01',
            title: a.title || 'Technical Assessment',
            description: a.description || 'Skill benchmarking assessment',
            type: 'assessment' as const,
            status: a.status || 'published',
            level: a.difficulty || a.level || 'intermediate',
            duration: { min: a.duration || 45, max: a.duration || 60 },
            category: Array.isArray(a.category) ? a.category[0] : a.category || 'Core Engineering',
            enrollments: a.enrollments || 128,
            completionRate: a.passingScore ?? 75,
            createdAt: a.createdAt || new Date().toISOString(),
            createdBy: a.createdBy || { firstName: 'InterHive', lastName: 'Lead' },
          })),
        ];

        return combined;
      } catch (err) {
        console.warn('Failed to load programs:', err);
        return [];
      }
    },
  });

  const isLoading = usersLoading || companiesLoading || programsLoading;

  return {
    users: users || [],
    companies: companies || [],
    programs: programs || [],
    isLoading,
  };
};
