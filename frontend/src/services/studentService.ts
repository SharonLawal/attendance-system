/**
 * @module services/studentService
 * @description Client-side API binding utility for Student telemetry. Responsible for transmitting geofenced OTP attendance payloads to the verification engine.
 */
import apiClient from '@/lib/axios';

export const getDashboard = async () => {
  const res = await apiClient.get('/api/student/dashboard');
  return res.data;
};

/**
 * @deprecated Legacy stats endpoint. Dashboard directly relies on getDashboard payload.
 */
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



export const markAttendance = async (otcCode: string, latitude: number, longitude: number) => {
  const res = await apiClient.post('/api/attendance/mark', { otcCode, latitude, longitude });
  return res.data;
};