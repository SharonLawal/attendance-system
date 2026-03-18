import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import { transformAdminStats, transformAdminUsers } from '@/utils/apiTransformers';

export function useAdminDashboard() {
  return useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: async () => {
      const response = await apiClient.get('/api/admin/stats');
      return transformAdminStats(response.data);
    },
    staleTime: 5 * 60 * 1000, 
  });
}

export function useAdminUsers(page: number = 1, limit: number = 10, search: string = "", role: string = "All") {
  return useQuery({
    queryKey: ['admin', 'users', page, limit, search, role],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });
      if (search) params.append('search', search);
      if (role !== 'All') params.append('role', role);

      const response = await apiClient.get(`/api/admin/users?${params.toString()}`);
      return transformAdminUsers(response.data);
    },
    staleTime: 60 * 1000, // 1 minute
  });
}
