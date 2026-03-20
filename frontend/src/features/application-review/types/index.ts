import type { ID, ISOString } from '@/shared/types/common';

export type ApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'REVISION_REQUESTED';

export interface ApplicantInfo {
  id: ID;
  full_name: string;
  email: string;
  phone: string;
  occupation: string;
  id_number: string;
  avatar_url?: string;
  verification_status: 'VERIFIED' | 'PENDING' | 'FAILED';
}

export interface LeaseTerms {
  monthly_rent: number;
  deposit_amount: number;
  start_date: ISOString;
  duration_months: number;
}

export interface LeaseApplication {
  id: ID;
  status: ApplicationStatus;
  applied_at: ISOString;
  room_id: ID;
  room_number: string;
  property_name: string;
  applicant: ApplicantInfo;
  terms: LeaseTerms;
  message?: string;
}

export type ApplicationFilterStatus = 'ALL' | ApplicationStatus;
