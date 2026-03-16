export interface Property {
  id: string;
  workspace_id: string;
  name: string;
  address: string;
  city: string;
  description?: string;
  created_at: string;
}

export interface Room {
  id: string;
  property_id: string;
  workspace_id: string;
  room_number: string;
  floor?: number;
  area_sqm?: number;
  monthly_price: number;
  status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE';
  description?: string;
}
