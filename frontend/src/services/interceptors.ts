/**
 * Axios interceptors for global request/response handling.
 * - Request: Attach JWT token and workspace-id header.
 * - Response: Handle 401 (redirect to login), 403 (permission denied).
 */

import type { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';
import { ROUTES } from '@/shared/config/routes';

export function setupInterceptors(client: AxiosInstance): void {
  // ── Request Interceptor ────────────────────────────────────
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Attach JWT
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Attach workspace context
      const workspaceId = localStorage.getItem('workspace_id');
      if (workspaceId) {
        config.headers['X-Workspace-ID'] = workspaceId;
      }

      return config;
    },
    (error) => Promise.reject(error),
  );

  // ── Response Interceptor ───────────────────────────────────
  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      const status = error.response?.status;

      if (status === 401) {
        localStorage.removeItem('access_token');
        window.location.href = ROUTES.LOGIN;
      }

      if (status === 403) {
        // Permission denied — could dispatch a notification here
        console.error('[Auth] Forbidden: insufficient permissions.');
      }

      return Promise.reject(error);
    },
  );
}
