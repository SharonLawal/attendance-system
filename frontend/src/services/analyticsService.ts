/**
 * @fileoverview Contextual execution boundary for frontend/src/services/analyticsService.ts
 * @description Enforces strict software engineering principles, modular separation of concerns, and logical scoping.
 */
import apiClient from '@/lib/axios';

export const getWeekly = async () => {
  const res = await apiClient.get('/api/analytics/weekly');
  return res.data;
};

export const getDepartments = async () => {
  const res = await apiClient.get('/api/analytics/departments');
  return res.data;
};

export const getCriticalStudents = async () => {
  const res = await apiClient.get('/api/analytics/critical-students');
  return res.data;
};

export const getDetailedReports = async () => {
  const res = await apiClient.get('/api/analytics/detailed-reports');
  return res.data;
};
