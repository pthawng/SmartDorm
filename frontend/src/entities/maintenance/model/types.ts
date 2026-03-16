export interface MaintenanceRequest {
  id: string;
  workspace_id: string;
  room_id: string;
  renter_id?: string;
  submitted_by_user_id: string;
  title: string;
  description: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  resolution_note?: string;
  resolved_at?: string;
  created_at: string;
}
