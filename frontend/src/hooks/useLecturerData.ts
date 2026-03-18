import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import { transformLecturerDashboard } from '@/utils/apiTransformers';
import { toast } from 'sonner';

export function useLecturerDashboard() {
  return useQuery({
    queryKey: ['lecturer', 'dashboard'],
    queryFn: async () => {
      const response = await apiClient.get('/api/lecturer/dashboard');
      return transformLecturerDashboard(response.data);
    },
    staleTime: 2 * 60 * 1000, 
  });
}

// ============================================
// Live Session Attendees
// ============================================
export function useLiveSessionAttendees(sessionId: string | null) {
  return useQuery({
    queryKey: ['lecturer', 'session', sessionId, 'attendees'],
    queryFn: async () => {
      if (!sessionId) return null;
      const response = await apiClient.get(`/api/lecturer/live-session/${sessionId}/attendees`);
      return response.data.data;
    },
    enabled: !!sessionId,
    refetchInterval: 5000, // Poll every 5 seconds
    staleTime: 0, // Always consider stale for real-time updates
  });
}

// ============================================
// Classrooms
// ============================================
export function useClassrooms() {
  return useQuery({
    queryKey: ['lecturer', 'classrooms'],
    queryFn: async () => {
      const response = await apiClient.get('/api/lecturer/classrooms');
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
  });
}

// ============================================
// Approve Pending Attendance
// ============================================
export function useApprovePendingAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (recordId: string) => {
      const response = await apiClient.post(`/api/lecturer/attendance/${recordId}/approve`);
      return response.data;
    },
    onMutate: async (recordId) => {
      // Cancel ongoing queries
      await queryClient.cancelQueries({ queryKey: ['lecturer', 'session'] });

      // Snapshot previous value
      const previousData = queryClient.getQueryData(['lecturer', 'session']);

      // Optimistically update
      queryClient.setQueryData(['lecturer', 'session'], (old: any) => {
        if (!old) return old;
        
        return {
          ...old,
          attendees: old.attendees.map((attendee: any) =>
            attendee.id === recordId
              ? { ...attendee, status: 'Present' }
              : attendee
          ),
          summary: {
            ...old.summary,
            present: old.summary.present + 1,
            pending: old.summary.pending - 1,
            presentPercentage: Math.round(((old.summary.present + 1) / old.summary.total) * 100)
          }
        };
      });

      return { previousData };
    },
    onError: (err, recordId, context) => {
      // Revert on error
      queryClient.setQueryData(['lecturer', 'session'], context?.previousData);
      toast.error('Failed to approve attendance');
    },
    onSuccess: () => {
      toast.success('Attendance approved');
    },
    onSettled: () => {
      // Refetch to sync with server
      queryClient.invalidateQueries({ queryKey: ['lecturer', 'session'] });
    },
  });
}

// ============================================
// Reject Pending Attendance
// ============================================
export function useRejectPendingAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ recordId, reason }: { recordId: string; reason?: string }) => {
      const response = await apiClient.post(`/api/lecturer/attendance/${recordId}/reject`, { reason });
      return response.data;
    },
    onMutate: async ({ recordId }) => {
      await queryClient.cancelQueries({ queryKey: ['lecturer', 'session'] });
      const previousData = queryClient.getQueryData(['lecturer', 'session']);

      // Optimistically update
      queryClient.setQueryData(['lecturer', 'session'], (old: any) => {
        if (!old) return old;
        
        return {
          ...old,
          attendees: old.attendees.map((attendee: any) =>
            attendee.id === recordId
              ? { ...attendee, status: 'Absent' }
              : attendee
          ),
          summary: {
            ...old.summary,
            pending: old.summary.pending - 1,
          }
        };
      });

      return { previousData };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['lecturer', 'session'], context?.previousData);
      toast.error('Failed to reject attendance');
    },
    onSuccess: () => {
      toast.success('Attendance rejected');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['lecturer', 'session'] });
    },
  });
}

export function useLecturerCourses() {
  return useQuery({
    queryKey: ['lecturer', 'courses'],
    queryFn: async () => {
      const response = await apiClient.get('/api/courses/my-courses');
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useLecturerCoursesSummary() {
  return useQuery({
    queryKey: ['lecturer', 'coursesSummary'],
    queryFn: async () => {
      const response = await apiClient.get('/api/lecturer/courses-summary');
      return response.data;
    },
    staleTime: 2 * 60 * 1000,
  });
}

export function useLecturerSyncHistory() {
  return useQuery({
    queryKey: ['lecturer', 'syncHistory'],
    queryFn: async () => {
      const response = await apiClient.get('/api/lecturer/sync-history');
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}
