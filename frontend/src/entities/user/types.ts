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
  memberships?: any[]; // Using any[] for now to avoid circular dependency in types if needed, or specialized membership type
}
