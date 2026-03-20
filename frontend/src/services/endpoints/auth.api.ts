/**
 * Auth API endpoints.
 */

import { apiClient } from '@/services/apiClient';
import type { ApiResponse } from '@/shared/types/api';
import type { UserData } from '@/entities/user';

interface LoginPayload {
  email: string;
  password: string;
}

interface AuthResponse {
  user: UserData;
  accessToken: string;
  refreshToken: string;
}

export const authApi = {
  login: (data: LoginPayload) =>
    apiClient.post<ApiResponse<AuthResponse>>('/auth/login', data),

  register: (data: LoginPayload & { full_name: string }) =>
    apiClient.post<ApiResponse<UserData>>('/auth/register', data),

  me: () =>
    apiClient.get<ApiResponse<UserData>>('/auth/me'),

  updateProfile: (data: Partial<UserData>) =>
    apiClient.patch<ApiResponse<UserData>>('/auth/me', data),

  refreshToken: () =>
    apiClient.post<ApiResponse<AuthResponse>>('/auth/refresh', {}, { withCredentials: true }),

  logout: () =>
    apiClient.post('/auth/logout', {}, { withCredentials: true }),
};
