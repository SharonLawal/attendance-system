/**
 * @fileoverview Contextual execution boundary for frontend/src/lib/axios.ts
 * @description Enforces strict software engineering principles, modular separation of concerns, and logical scoping.
 */
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach(cb => cb(token));
  refreshSubscribers = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isAuthEndpoint = originalRequest.url?.includes('/api/auth/login') || originalRequest.url?.includes('/api/auth/refresh');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {

      if (isRefreshing) {

        return new Promise((resolve) => {
          subscribeTokenRefresh(() => {
            resolve(apiClient(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {

        await apiClient.post('/api/auth/refresh');

        isRefreshing = false;
        onRefreshed('refreshed');

        return apiClient(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;

        if (typeof window !== 'undefined') {
          const publicPaths = ['/', '/login', '/register', '/signup', '/forgot-password', '/reset-password', '/verify-email'];
          if (!publicPaths.includes(window.location.pathname)) {
            window.location.href = '/login';
          }
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
