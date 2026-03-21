/**
 * Membership entity — defines user's role within a workspace.
 */

import type { ID } from '@/shared/types/common';
import type { WorkspaceData } from '@/entities/workspace';
import { MembershipRole } from './constants';

export interface MembershipData {
  user_id: ID;
  workspace_id: ID;
  role: MembershipRole;
  workspace?: WorkspaceData;
}
