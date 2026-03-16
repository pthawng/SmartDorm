export interface Renter {
  id: string;
  workspace_id: string;
  user_id?: string;
  full_name: string;
  phone: string;
  email?: string;
  id_number?: string;
  date_of_birth?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
}

export interface Contract {
  id: string;
  workspace_id: string;
  room_id: string;
  renter_id: string;
  status: 'DRAFT' | 'ACTIVE' | 'TERMINATED' | 'EXPIRED';
  start_date: string;
  end_date: string;
  monthly_rent: number;
  deposit_amount: number;
  terms_notes?: string;
  activated_at?: string;
  terminated_at?: string;
}
