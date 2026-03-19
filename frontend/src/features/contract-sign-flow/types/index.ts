import { z } from 'zod';
import { ContractSchema } from '@/entities/contract/model/schema';
import { RenterSchema } from '@/entities/renter/model/schema';

export const ContractSignFlowSchema = ContractSchema.merge(RenterSchema);

export type ContractSignFlowPayload = z.infer<typeof ContractSignFlowSchema>;

export type StepId = 'contract' | 'renter' | 'review';

export interface StepConfig {
  id: StepId;
  title: string;
  description: string;
}

export const FLOW_STEPS: StepConfig[] = [
  { id: 'contract', title: 'Contract Details', description: 'Room, dates, and rent pricing' },
  { id: 'renter', title: 'Renter Info', description: 'Personal and contact details' },
  { id: 'review', title: 'Review & Sign', description: 'Confirm information and submit' },
];
