/**
 * User entity — matches Backend schema.
 */

import type { ID, ISOString, Nullable } from '@/shared/types/common';

export type UserRole = 'TENANT' | 'LANDLORD' | 'ADMIN';

export interface UserData {
  id: ID;
  email: string;
  full_name: string;
  phone: Nullable<string>;
  role: UserRole;
  is_active: boolean;
  created_at: ISOString;
}
