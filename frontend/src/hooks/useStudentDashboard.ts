import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import { transformStudentStats } from '@/utils/apiTransformers';

export function useStudentDashboard() {
  return useQuery({
    queryKey: ['student', 'dashboard'],
    queryFn: async () => {
      const response = await apiClient.get('/api/student/dashboard');
      return transformStudentStats(response.data);
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}
