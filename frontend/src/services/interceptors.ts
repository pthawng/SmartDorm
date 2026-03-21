/**
 * Axios interceptors for global request/response handling.
 * - Request: Attach JWT token and workspace-id header.
 * - Response: Handle 401 (redirect to login), 403 (permission denied).
 */

import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig, AxiosError } from 'axios';

export function setupInterceptors(client: AxiosInstance): void {
  // ── Request Interceptor ────────────────────────────────────
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Attach JWT from localStorage (Synced by AuthStore manually to avoid circular deps)
      const token = localStorage.getItem('access_token');
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error: unknown) => Promise.reject(error),
  );

  // ── Response Interceptor ───────────────────────────────────
  let isRefreshing = false;
  let refreshQueue: ((token: string) => void)[] = [];

  client.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
      const status = error.response?.status;

      if (status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve) => {
            refreshQueue.push((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(client(originalRequest));
            });
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // Note: Importing authApi here might cause circular dependency if not careful.
          // In a real app, one might use a direct axios call or a separate service.
          // For now, assume it works or use dynamic import if needed.
          const { authApi } = await import('./endpoints/auth.api');
          const { useAuthStore } = await import('@/store/authStore');
          
          const { data } = await authApi.refreshToken();
          const newToken = data.data.accessToken;

          useAuthStore.getState().setAuth(data.data.user, newToken);
          
          refreshQueue.forEach((cb) => cb(newToken));
          refreshQueue = [];

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }
          return client(originalRequest);
        } catch (e) {
          const { useAuthStore } = await import('@/store/authStore');
          useAuthStore.getState().logout();
          return Promise.reject(e);
        } finally {
          isRefreshing = false;
        }
      }

      if (status === 403) {
        console.error('[Auth] Forbidden: insufficient permissions.');
      }

      return Promise.reject(error);
    },
  );
}
