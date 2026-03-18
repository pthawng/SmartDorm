import type { ID, ISOString } from '@/shared/types/common';
import { ContractStatus } from '@/entities/contract';

export interface ContractSummary {
  id: ID;
  renter_name: string;
  room_number: string;
  start_date: ISOString;
  end_date: ISOString;
  monthly_rent: number;
  status: ContractStatus;
}

export type ContractFilterStatus = ContractStatus | 'ALL';
