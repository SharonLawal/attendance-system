import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/axios';

export function useStudentSchedule() {
  return useQuery({
    queryKey: ['student', 'schedule'],
    queryFn: async () => {
      const response = await apiClient.get('/api/student/schedule');
      return response.data; // Already formatted by backend
    },
    staleTime: 5 * 60 * 1000,
  });
}
