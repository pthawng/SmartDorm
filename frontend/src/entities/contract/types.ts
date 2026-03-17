/**
 * Contract entity — rental agreement between workspace and renter.
 */

import type { ID, ISOString, Nullable } from '@/shared/types/common';
import { ContractStatus } from './constants';

export interface ContractData {
  id: ID;
  workspace_id: ID;
  room_id: ID;
  renter_id: ID;
  status: ContractStatus;
  start_date: ISOString;
  end_date: ISOString;
  monthly_rent: number;
  deposit_amount: number;
  terms_notes: Nullable<string>;
}
