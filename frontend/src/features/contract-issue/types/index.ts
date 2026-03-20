import type { ID, ISOString } from '@/shared/types/common';

export type IssuanceStep = 'ROOM' | 'TENANT' | 'TERMS' | 'REVIEW' | 'SUCCESS';

export interface ContractDraft {
  room_id: ID;
  room_number: string;
  property_name: string;
  tenant_id?: ID;
  tenant_email: string;
  tenant_name: string;
  monthly_rent: number;
  deposit_amount: number;
  start_date: ISOString;
  duration_months: number;
}

export interface SelectionRoom {
  id: ID;
  number: string;
  type: string;
  price: number;
  status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE';
}

export interface SelectionTenant {
  id: ID;
  full_name: string;
  email: string;
  avatar_url?: string;
}
