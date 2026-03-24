/**
 * @module services/adminService
 * @description Client-side API binding utility for elevated administrative calls. Orchestrates physical venue queries and global statistical aggregations.
 */
import apiClient from '@/lib/axios';

export const getStats = async () => {
  const res = await apiClient.get('/api/admin/stats');
  return res.data;
};

export const getUsers = async (page = 1, limit = 50, search = '', role = 'all') => {
  const params: any = { page, limit };
  if (search) params.search = search;
  if (role) params.role = role;
  const res = await apiClient.get('/api/admin/users', { params });
  return res.data;
};

