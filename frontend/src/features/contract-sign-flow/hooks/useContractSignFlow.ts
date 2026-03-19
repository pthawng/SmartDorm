import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ContractSignFlowSchema, type ContractSignFlowPayload, type StepId, FLOW_STEPS } from '../types';
import { ROUTES } from '@/shared/config/routes';

export function useContractSignFlow() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const form = useForm<ContractSignFlowPayload>({
    resolver: zodResolver(ContractSignFlowSchema),
    mode: 'onTouched',
    defaultValues: {
      room_id: '',
      monthly_rent: 0,
      deposit_amount: 0,
      full_name: '',
      phone: '',
      id_number: '',
      status: 'DRAFT' as any,
    },
  });

  const { handleSubmit, trigger } = form;

  const currentStep = FLOW_STEPS[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === FLOW_STEPS.length - 1;

  const nextStep = async () => {
    // Validate current step fields before proceeding
    const fieldsToValidate = getFieldsForStep(currentStep!.id);
    const isValid = await trigger(fieldsToValidate as any);
    
    if (isValid && !isLastStep) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (!isFirstStep) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const mutation = useMutation({
    mutationFn: async (data: ContractSignFlowPayload) => {
      console.log('Submitting contract application:', data);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return { id: 'new-contract-id' };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      navigate(ROUTES.DASHBOARD.CONTRACT_REVIEW(data.id));
    },
  });

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

  const goToStep = (index: number) => {
    if (index < currentStepIndex) {
      setCurrentStepIndex(index);
    }
  };

  return {
    currentStepIndex,
    currentStep,
    steps: FLOW_STEPS,
    isFirstStep,
    isLastStep,
    nextStep,
    prevStep,
    goToStep,
    form,
    onSubmit,
    isSubmitting: mutation.isPending,
  };
}

function getFieldsForStep(stepId: StepId): string[] {
  switch (stepId) {
    case 'contract':
      return ['room_id', 'start_date', 'end_date', 'monthly_rent', 'deposit_amount'];
    case 'renter':
      return ['full_name', 'phone', 'id_number', 'email'];
    case 'review':
      return [];
    default:
      return [];
  }
}
