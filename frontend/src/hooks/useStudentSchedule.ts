/**
 * @fileoverview Contextual execution boundary for frontend/src/hooks/useStudentSchedule.ts
 * @description Enforces strict software engineering principles, modular separation of concerns, and logical scoping.
 */
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
