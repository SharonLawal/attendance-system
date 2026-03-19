import { useQuery } from '@tanstack/react-query';
import * as studentService from '@/services/studentService';

export function useStudentSchedule() {
  return useQuery({
    queryKey: ['student', 'schedule'],
    queryFn: async () => {
      const response = await studentService.getSchedule();
      return response;
    },
    staleTime: 5 * 60 * 1000,
  });
}
