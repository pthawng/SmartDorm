import { ID, ISOString } from '@/shared/types/common';

export enum ApplicationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELED = 'CANCELED',
}

export interface LeaseApplication {
  id: ID;
  room_id: ID;
  tenant_id: ID;
  
  // Application Details
  start_date: ISOString;
  duration_months: number;
  expected_move_in: ISOString;
  
  // Personal Info (captured at time of application)
  full_name: string;
  phone: string;
  id_number: string;
  note?: string;
  
  status: ApplicationStatus;
  created_at: ISOString;
  updated_at: ISOString;
}

export interface CreateApplicationPayload {
  room_id: string;
  start_date: string;
  duration_months: number;
  expected_move_in: string;
  full_name: string;
  phone: string;
  id_number: string;
  note?: string;
}
