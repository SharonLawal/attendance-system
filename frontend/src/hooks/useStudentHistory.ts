import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import { transformPaginatedResponse, transformHistoryItem } from '@/utils/apiTransformers';

export function useStudentHistory(page: number, limit: number, searchTerm?: string, courseFilter?: string) {
  return useQuery({
    queryKey: ['student', 'history', page, limit, searchTerm, courseFilter],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      
      if (searchTerm) params.append('search', searchTerm);
      if (courseFilter && courseFilter !== 'all') params.append('course', courseFilter);

      const response = await apiClient.get(`/api/student/history?${params.toString()}`);
      return transformPaginatedResponse(response.data, transformHistoryItem);
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}
