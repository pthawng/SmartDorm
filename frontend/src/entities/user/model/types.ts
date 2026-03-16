export type UserRole = 'owner' | 'property_manager' | 'staff' | 'super_admin' | 'support' | 'finance';

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Workspace {
  id: string;
  name: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Membership {
  user_id: string;
  workspace_id: string;
  role: 'owner' | 'property_manager' | 'staff';
}
