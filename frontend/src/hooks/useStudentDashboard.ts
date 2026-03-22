import { useQuery } from '@tanstack/react-query';
import * as studentService from '@/services/studentService';
import { transformStudentStats } from '@/utils/apiTransformers';

export function useStudentDashboard() {
  return useQuery({
    queryKey: ['student', 'dashboard'],
    queryFn: async () => {
      const response = await studentService.getDashboard();
      const result = transformStudentStats(response);
      if (!result.success) throw new Error(result.message);
      return result.data;
    },
    staleTime: 2 * 60 * 1000,
  });
}