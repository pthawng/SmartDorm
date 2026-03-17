/**
 * Room API endpoints.
 * Single source of truth for all /rooms calls.
 */

import { apiClient } from '@/services/apiClient';
import type { ApiResponse, PaginatedResponse, QueryOptions } from '@/shared/types/api';
import type { RoomData } from '@/entities/room';

export const roomApi = {
  getAll: (params?: QueryOptions) =>
    apiClient.get<PaginatedResponse<RoomData>>('/rooms', { params }),

  getById: (id: string) =>
    apiClient.get<ApiResponse<RoomData>>(`/rooms/${id}`),

  update: (id: string, data: Partial<RoomData>) =>
    apiClient.patch<ApiResponse<RoomData>>(`/rooms/${id}`, data),
};
