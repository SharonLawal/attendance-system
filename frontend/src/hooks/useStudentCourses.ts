import { useQuery } from '@tanstack/react-query';
import * as studentService from '@/services/studentService';

export function useStudentCourses() {
  return useQuery({
    queryKey: ['student', 'courses'],
    queryFn: async () => {
      const response = await studentService.getCourses();
      return response;
    },
    staleTime: 5 * 60 * 1000, 
  });
}
