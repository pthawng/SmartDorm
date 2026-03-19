import { useQuery } from '@tanstack/react-query';
import { getInvoiceById } from '../services/invoice-api';

/**
 * Hook to fetch and manage invoice detail state.
 */
export function useInvoiceDetail(invoiceId: string) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['invoice', invoiceId],
    queryFn: () => getInvoiceById(invoiceId),
    enabled: !!invoiceId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    invoice: data,
    isLoading,
    isError,
    error,
  };
}
