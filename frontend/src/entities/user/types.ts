/**
 * User entity — matches Backend schema.
 */

import type { ID, ISOString, Nullable } from '@/shared/types/common';

export interface UserData {
  id: ID;
  email: string;
  full_name: string;
  phone: Nullable<string>;
  is_active: boolean;
  created_at: ISOString;
}
