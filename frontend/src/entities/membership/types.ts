/**
 * Membership entity — defines user's role within a workspace.
 */

import type { ID } from '@/shared/types/common';
import { MembershipRole } from './constants';

export interface MembershipData {
  user_id: ID;
  workspace_id: ID;
  role: MembershipRole;
}
