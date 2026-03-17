/**
 * Renter API endpoints.
 */

import { apiClient } from '@/services/apiClient';
import type { ApiResponse, PaginatedResponse, QueryOptions } from '@/shared/types/api';
import type { RenterData } from '@/entities/renter';

export const renterApi = {
  getAll: (params?: QueryOptions) =>
    apiClient.get<PaginatedResponse<RenterData>>('/renters', { params }),

  getById: (id: string) =>
    apiClient.get<ApiResponse<RenterData>>(`/renters/${id}`),

  create: (data: Partial<RenterData>) =>
    apiClient.post<ApiResponse<RenterData>>('/renters', data),
};
