/**
 * Workspace API endpoints.
 */

import { apiClient } from '@/services/apiClient';
import type { ApiResponse, PaginatedResponse } from '@/shared/types/api';
import type { WorkspaceData } from '@/entities/workspace';
import type { MembershipData } from '@/entities/membership';

export const workspaceApi = {
  getAll: () =>
    apiClient.get<PaginatedResponse<WorkspaceData>>('/workspaces'),

  getById: (id: string) =>
    apiClient.get<ApiResponse<WorkspaceData>>(`/workspaces/${id}`),

  update: (id: string, data: Partial<WorkspaceData>) =>
    apiClient.patch<ApiResponse<WorkspaceData>>(`/workspaces/${id}`, data),

  getMembers: (id: string) =>
    apiClient.get<PaginatedResponse<MembershipData>>(`/workspaces/${id}/members`),

  create: (data: { name: string }) =>
    apiClient.post<ApiResponse<WorkspaceData>>('/workspaces', data),

  updateStatus: (id: string, status: 'pending' | 'active') =>
    apiClient.patch<ApiResponse<void>>(`/workspaces/${id}/status`, { status }),
};
