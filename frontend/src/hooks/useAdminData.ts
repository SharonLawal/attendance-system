/**
 * @fileoverview Contextual execution boundary for frontend/src/hooks/useAdminData.ts
 * @description Enforces strict software engineering principles, modular separation of concerns, and logical scoping.
 */
import { useQuery } from '@tanstack/react-query';
import * as adminService from '@/services/adminService';
import { transformAdminStats, transformAdminUsers } from '@/utils/apiTransformers';

export function useAdminDashboard() {
  return useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: async () => {
      const response = await adminService.getStats();
      const result = transformAdminStats(response);
      if (!result.success) throw new Error(result.message);
      return result.data;
    },
    staleTime: 5 * 60 * 1000, 
  });
}

export function useAdminUsers(page: number = 1, limit: number = 10, search: string = "", role: string = "All") {
  return useQuery({
    queryKey: ['admin', 'users', page, limit, search, role],
    queryFn: async () => {
      const response = await adminService.getUsers(page, limit, search, role === 'All' ? '' : role);
      const result = transformAdminUsers(response);
      if (!result.success) throw new Error(result.message);
      return result.data;
    },
    staleTime: 60 * 1000,
  });
}
