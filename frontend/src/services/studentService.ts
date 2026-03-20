import apiClient from '@/lib/axios';

export const getDashboard = async () => {
  const res = await apiClient.get('/api/student/dashboard');
  return res.data;
};

// Legacy - kept for compatibility but dashboard now uses getDashboard
export const getDashboardStats = async () => {
  const res = await apiClient.get('/api/student/stats');
  return res.data;
};

export const getHistory = async (page = 1, limit = 20) => {
  const res = await apiClient.get('/api/student/history', { params: { page, limit } });
  return res.data;
};

export const getCourses = async () => {
  const res = await apiClient.get('/api/student/courses');
  return res.data;
};

export const getSchedule = async () => {
  const res = await apiClient.get('/api/student/schedule');
  return res.data;
};

export const getActiveSession = async () => {
  const res = await apiClient.get('/api/student/active-session');
  return res.data;
};

export const getNotifications = async () => {
  const res = await apiClient.get('/api/student/notifications');
  return res.data;
};

export const markAttendance = async (otcCode: string, latitude: number, longitude: number) => {
  const res = await apiClient.post('/api/attendance/mark', { otcCode, latitude, longitude });
  return res.data;
};