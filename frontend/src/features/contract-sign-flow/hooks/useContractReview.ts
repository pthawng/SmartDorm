import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getContractById, activateContract } from '../services/contract-api';

export function useContractReview(contractId: string) {
  const queryClient = useQueryClient();

  // Fetch contract data
  const { 
    data: contract, 
    isLoading, 
    isError 
  } = useQuery({
    queryKey: ['contract', contractId],
    queryFn: () => getContractById(contractId),
    enabled: !!contractId,
  });

  // Activate contract mutation
  const mutation = useMutation({
    mutationFn: () => activateContract(contractId),
    onSuccess: () => {
      // Invalidate both lists and specific items
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      queryClient.invalidateQueries({ queryKey: ['contract', contractId] });
    },
  });

  return {
    contract,
    isLoading,
    isError,
    isSubmitting: mutation.isPending,
    isSuccess: mutation.isSuccess,
    onActivate: mutation.mutate,
  };
}
