/**
 * Invoice API endpoints.
 */

import { apiClient } from '@/services/apiClient';
import type { ApiResponse, PaginatedResponse, QueryOptions } from '@/shared/types/api';
import type { InvoiceData } from '@/entities/invoice';

export const invoiceApi = {
  getAll: (params?: QueryOptions & { status?: string }) =>
    apiClient.get<PaginatedResponse<InvoiceData>>('/invoices', { params }),

  getById: (id: string) =>
    apiClient.get<ApiResponse<InvoiceData>>(`/invoices/${id}`),

  create: (data: Partial<InvoiceData>) =>
    apiClient.post<ApiResponse<InvoiceData>>('/invoices', data),

  markPaid: (id: string) =>
    apiClient.patch<ApiResponse<InvoiceData>>(`/invoices/${id}`, { status: 'PAID' }),
};
