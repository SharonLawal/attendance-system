import { useQuery } from '@tanstack/react-query';
import * as adminService from '@/services/adminService';
import { transformAdminStats, transformAdminUsers } from '@/utils/apiTransformers';

export function useAdminDashboard() {
  return useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: async () => {
      const response = await adminService.getStats();
      return transformAdminStats(response);
    },
    staleTime: 5 * 60 * 1000, 
  });
}

export function useAdminUsers(page: number = 1, limit: number = 10, search: string = "", role: string = "All") {
  return useQuery({
    queryKey: ['admin', 'users', page, limit, search, role],
    queryFn: async () => {
      const response = await adminService.getUsers(page, limit, search, role === 'All' ? '' : role);
      return transformAdminUsers(response);
    },
    staleTime: 60 * 1000, // 1 minute
  });
}
