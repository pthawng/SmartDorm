/**
 * Property API endpoints.
 */

import { apiClient } from '@/services/apiClient';
import type { ApiResponse, PaginatedResponse, QueryOptions } from '@/shared/types/api';
import type { PropertyData } from '@/entities/property';

export const propertyApi = {
  getAll: (params?: QueryOptions & { city?: string }) =>
    apiClient.get<PaginatedResponse<PropertyData>>('/properties', { params }),

  getById: (id: string) =>
    apiClient.get<ApiResponse<PropertyData>>(`/properties/${id}`),
};
