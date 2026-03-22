import { useQuery } from '@tanstack/react-query';
import * as studentService from '@/services/studentService';
import { transformPaginatedResponse, transformHistoryItem } from '@/utils/apiTransformers';

export function useStudentHistory(page: number, limit: number, searchTerm?: string, courseFilter?: string) {
  return useQuery({
    queryKey: ['student', 'history', page, limit, searchTerm, courseFilter],
    queryFn: async () => {
      const response = await studentService.getHistory(page, limit);
      const result = transformPaginatedResponse(response, transformHistoryItem);
      if (!result.success) throw new Error(result.message);
      return result.data;
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}
