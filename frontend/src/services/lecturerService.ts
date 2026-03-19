import apiClient from '@/lib/axios';

export const getCoursesSummary = async () => {
  const res = await apiClient.get('/api/lecturer/courses-summary');
  return res.data;
};

export const getDashboard = async () => {
  const res = await apiClient.get('/api/lecturer/dashboard');
  return res.data;
};

export const getMyCourses = async () => {
  const res = await apiClient.get('/api/courses/my-courses');
  return res.data;
};

export const getClassrooms = async () => {
  const res = await apiClient.get('/api/lecturer/classrooms');
  return res.data;
};

export const getSyncHistory = async () => {
  const res = await apiClient.get('/api/lecturer/sync-history');
  return res.data;
};

export const getLiveSession = async (id: string) => {
  const res = await apiClient.get(`/api/lecturer/live-session/${id}/attendees`);
  return res.data;
};

export const createSession = async (payload: {
  courseId: string;
  latitude: number;
  longitude: number;
  radiusInMeters?: number;
  durationInMinutes?: number;
  locationPolygon?: any;
}) => {
  const res = await apiClient.post('/api/sessions/create', payload);
  return res.data;
};

export const endSession = async (id: string) => {
  const res = await apiClient.post(`/api/lecturer/end-session/${id}`);
  return res.data;
};

export const extendSession = async (id: string, minutes: number) => {
  const res = await apiClient.post(`/api/lecturer/extend-session/${id}`, { minutes });
  return res.data;
};

export const postLmsSync = async (courseId: string, attendedStudentIds: string[] = []) => {
  const res = await apiClient.post('/api/lms/sync', { courseId, attendedStudentIds });
  return res.data;
};

export const approveAttendance = async (recordId: string) => {
  const res = await apiClient.post(`/api/lecturer/attendance/${recordId}/approve`);
  return res.data;
};

export const rejectAttendance = async (recordId: string, reason?: string) => {
  const res = await apiClient.post(`/api/lecturer/attendance/${recordId}/reject`, { reason });
  return res.data;
};
