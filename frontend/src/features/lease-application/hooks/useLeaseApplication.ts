import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateApplicationPayload } from '@/entities/application/types';
import { applicationApi } from '../services/application-api';

export function useLeaseApplication() {
  const queryClient = useQueryClient();

  const applyMutation = useMutation({
    mutationFn: (payload: CreateApplicationPayload) => 
      applicationApi.submitApplication(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });

  return {
    apply: applyMutation.mutateAsync,
    isSubmitting: applyMutation.isPending,
    isSuccess: applyMutation.isSuccess,
    error: applyMutation.error,
    application: applyMutation.data,
  };
}
