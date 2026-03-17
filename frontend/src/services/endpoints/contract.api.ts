/**
 * Contract API endpoints.
 */

import { apiClient } from '@/services/apiClient';
import type { ApiResponse, PaginatedResponse, QueryOptions } from '@/shared/types/api';
import type { ContractData } from '@/entities/contract';

export const contractApi = {
  getAll: (params?: QueryOptions & { status?: string }) =>
    apiClient.get<PaginatedResponse<ContractData>>('/contracts', { params }),

  create: (data: Partial<ContractData>) =>
    apiClient.post<ApiResponse<ContractData>>('/contracts', data),

  activate: (id: string) =>
    apiClient.patch<ApiResponse<ContractData>>(`/contracts/${id}/activate`),
};
