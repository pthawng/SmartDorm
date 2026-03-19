/**
 * Invoice entity — periodic billing records.
 */

import type { ID, ISOString, Nullable } from '@/shared/types/common';
import { InvoiceStatus } from './constants';

export interface InvoiceItem {
  id: string;
  description: string;
  amount: number;
  type: 'RENT' | 'UTILITY' | 'FEE' | 'OTHER';
}

export interface InvoiceData {
  id: ID;
  workspace_id: ID;
  contract_id: ID;
  renter_id: ID;
  room_name: string;
  renter_name: string;
  billing_period_start: ISOString;
  billing_period_end: ISOString;
  amount_due: number;
  status: InvoiceStatus;
  due_date: ISOString;
  paid_at: Nullable<ISOString>;
  notes: Nullable<string>;
  items?: InvoiceItem[];
}
