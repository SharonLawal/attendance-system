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

// ─── Google Classroom ────────────────────────────────────────────────────────

export const getGoogleConnectionStatus = async () => {
  const res = await apiClient.get('/api/lms/google/status');
  return res.data; // { connected: boolean, email: string | null }
};

export const getGoogleAuthUrl = async () => {
  const res = await apiClient.get('/api/lms/google/auth');
  return res.data; // { url: string }
};

export const disconnectGoogle = async () => {
  const res = await apiClient.delete('/api/lms/google/disconnect');
  return res.data;
};

export const getGoogleCourses = async () => {
  const res = await apiClient.get('/api/lms/google/courses');
  return res.data; // { courses: [...] }
};

export const getGoogleCourseWork = async (googleCourseId: string) => {
  const res = await apiClient.get(`/api/lms/google/courses/${googleCourseId}/coursework`);
  return res.data; // { courseWork: [...] }
};

export const syncGoogleRoster = async (googleCourseId: string, veriPointCourseId: string) => {
  const res = await apiClient.post('/api/lms/google/sync-roster', {
    googleCourseId,
    veriPointCourseId,
  });
  return res.data;
};

export const syncGoogleAttendance = async (
  googleCourseId: string,
  veriPointCourseId: string,
  courseWorkId: string
) => {
  const res = await apiClient.post('/api/lms/google/sync-attendance', {
    googleCourseId,
    veriPointCourseId,
    courseWorkId,
  });
  return res.data;
};
