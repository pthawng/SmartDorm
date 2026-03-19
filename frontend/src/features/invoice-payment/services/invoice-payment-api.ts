import { InvoiceData } from '@/entities/invoice/types';
import { InvoiceStatus } from '@/entities/invoice/constants';
import { getInvoiceById } from '@/features/invoice-table/services/invoice-api';
import { PaymentMethod, PaymentRequest, PaymentReference } from '../types';

/**
 * Service for the invoice payment subsystem.
 * Handles fetching specific invoice data and processing payments.
 */

export async function getInvoiceForPayment(id: string): Promise<InvoiceData> {
  // Re-use the existing mock logic to fetch the invoice
  return getInvoiceById(id);
}

export async function processInvoicePayment(request: PaymentRequest): Promise<PaymentReference> {
  // Simulate network delay and processing time
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // In a real application, this would be an Axios PATCH/POST request to:
  // PATCH /api/v1/invoices/{id}/pay
  // With payload: { method: request.method }

  return {
    transactionId: `TXN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
    method: request.method,
    timestamp: new Date().toISOString(),
  };
}
