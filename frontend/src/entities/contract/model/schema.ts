import { z } from 'zod';
import { ContractStatus } from '../constants';

export const ContractSchema = z.object({
  room_id: z.string().min(1, 'Please select a room'),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
  monthly_rent: z.number().min(0, 'Monthly rent must be at least 0'),
  deposit_amount: z.number().min(0, 'Deposit amount must be at least 0'),
  status: z.nativeEnum(ContractStatus).default(ContractStatus.DRAFT),
  terms_notes: z.string().optional().nullable(),
});

export type ContractFormPayload = z.infer<typeof ContractSchema>;
