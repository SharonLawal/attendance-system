import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // Send cookies automatically
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

// Response interceptor for handling 401 errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retrying, AND it's not the login endpoint itself
    const isAuthEndpoint = originalRequest.url?.includes('/api/auth/login') || originalRequest.url?.includes('/api/auth/refresh');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {

      if (isRefreshing) {
        // Wait for refresh to complete
        return new Promise((resolve) => {
          subscribeTokenRefresh(() => {
            resolve(apiClient(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh token
        await apiClient.post('/api/auth/refresh');

        isRefreshing = false;
        onRefreshed('refreshed');

        // Retry original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;

        // Refresh failed - redirect to login, but only if we are not already there
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
