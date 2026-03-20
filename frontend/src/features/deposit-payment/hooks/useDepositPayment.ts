import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getContractById, payDeposit } from '@/features/contract-sign-flow/services/contract-api';

export function useDepositPayment(contractId: string) {
  const queryClient = useQueryClient();

  // Fetch contract to get deposit amount
  const { 
    data: contract, 
    isLoading, 
    isError 
  } = useQuery({
    queryKey: ['contract', contractId],
    queryFn: () => getContractById(contractId),
    enabled: !!contractId,
  });

  // Payment mutation
  const mutation = useMutation({
    mutationFn: () => payDeposit(contractId),
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
    onPay: mutation.mutate,
  };
}
