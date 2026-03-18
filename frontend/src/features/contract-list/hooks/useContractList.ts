import { useQuery } from '@tanstack/react-query';
import { getContracts } from '../services/mock-data';

export const CONTRACT_LIST_QUERY_KEY = ['contracts', 'list'] as const;

export function useContractList() {
  return useQuery({
    queryKey: CONTRACT_LIST_QUERY_KEY,
    queryFn: getContracts,
  });
}
