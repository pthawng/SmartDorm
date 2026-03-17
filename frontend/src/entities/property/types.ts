/**
 * Property entity — a building or facility containing multiple rooms.
 */

import type { ID, Nullable } from '@/shared/types/common';

export interface PropertyData {
  id: ID;
  workspace_id: ID;
  name: string;
  address: string;
  city: string;
  description: Nullable<string>;
}
