/**
 * Renter entity — the person renting a room.
 */

import type { ID, Nullable, ISOString } from '@/shared/types/common';

export interface RenterData {
  id: ID;
  workspace_id: ID;
  user_id: Nullable<ID>;
  full_name: string;
  phone: string;
  email: Nullable<string>;
  id_number: string;
  date_of_birth: Nullable<ISOString>;
  emergency_contact_name: Nullable<string>;
  emergency_contact_phone: Nullable<string>;
}
