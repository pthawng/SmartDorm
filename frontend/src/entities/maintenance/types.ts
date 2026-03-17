/**
 * Maintenance Request entity — tickets for room/property issues.
 */

import type { ID, ISOString, Nullable } from '@/shared/types/common';
import { MaintenanceStatus, MaintenancePriority } from './constants';

export interface MaintenanceRequestData {
  id: ID;
  workspace_id: ID;
  room_id: ID;
  renter_id: ID;
  reported_by: ID;
  title: string;
  description: string;
  status: MaintenanceStatus;
  priority: MaintenancePriority;
  resolution_note: Nullable<string>;
  resolved_at: Nullable<ISOString>;
}
