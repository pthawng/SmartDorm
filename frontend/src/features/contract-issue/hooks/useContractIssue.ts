import { useState } from 'react';
import type { ContractDraft, IssuanceStep, SelectionRoom, SelectionTenant } from '../types';

const INITIAL_DRAFT: ContractDraft = {
  room_id: '',
  room_number: '',
  property_name: 'SmartDorm Central',
  tenant_email: '',
  tenant_name: '',
  monthly_rent: 0,
  deposit_amount: 0,
  start_date: new Date().toISOString(),
  duration_months: 12
};

export function useContractIssue() {
  const [step, setStep] = useState<IssuanceStep>('ROOM');
  const [draft, setDraft] = useState<ContractDraft>(INITIAL_DRAFT);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps: IssuanceStep[] = ['ROOM', 'TENANT', 'TERMS', 'REVIEW', 'SUCCESS'];

  const next = () => {
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1]);
    }
  };

  const prev = () => {
    const currentIndex = steps.indexOf(step);
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1]);
    }
  };

  const updateDraft = (updates: Partial<ContractDraft>) => {
    setDraft(prev => ({ ...prev, ...updates }));
  };

  const selectRoom = (room: SelectionRoom) => {
    updateDraft({ 
      room_id: room.id, 
      room_number: room.number,
      monthly_rent: room.price,
      deposit_amount: room.price * 2 // Default 2 months deposit
    });
    next();
  };

  const selectTenant = (tenant: SelectionTenant) => {
    updateDraft({ 
      tenant_id: tenant.id, 
      tenant_name: tenant.full_name, 
      tenant_email: tenant.email 
    });
    next();
  };

  const submitOffer = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setStep('SUCCESS');
  };

  return {
    step,
    draft,
    next,
    prev,
    updateDraft,
    selectRoom,
    selectTenant,
    submitOffer,
    isSubmitting
  };
}
