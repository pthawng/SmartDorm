/**
 * Workspace entity — a logical container for properties and data.
 */

import type { ID, ISOString } from '@/shared/types/common';

export interface WorkspaceData {
  id: ID;
  name: string;
  created_by: ID;
  created_at: ISOString;
}
