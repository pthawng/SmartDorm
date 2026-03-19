import { useQuery } from '@tanstack/react-query';
import { getInvoices } from '../services/invoice-api';

export function useInvoices() {
  return useQuery({
    queryKey: ['invoices'],
    queryFn: getInvoices,
    staleTime: 1000 * 60 * 5,
  });
}
