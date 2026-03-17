/**
 * Maintenance Request API endpoints.
 */

import { apiClient } from '@/services/apiClient';
import type { ApiResponse, PaginatedResponse, QueryOptions } from '@/shared/types/api';
import type { MaintenanceRequestData } from '@/entities/maintenance';

export const maintenanceApi = {
  getAll: (params?: QueryOptions & { status?: string }) =>
    apiClient.get<PaginatedResponse<MaintenanceRequestData>>('/maintenance_requests', { params }),

  getById: (id: string) =>
    apiClient.get<ApiResponse<MaintenanceRequestData>>(`/maintenance_requests/${id}`),

  create: (data: Partial<MaintenanceRequestData>) =>
    apiClient.post<ApiResponse<MaintenanceRequestData>>('/maintenance_requests', data),

  update: (id: string, data: Partial<MaintenanceRequestData>) =>
    apiClient.patch<ApiResponse<MaintenanceRequestData>>(`/maintenance_requests/${id}`, data),
};
