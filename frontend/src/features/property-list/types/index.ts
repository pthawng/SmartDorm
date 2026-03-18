export type PropertyStatus = 'ACTIVE' | 'INACTIVE';

export interface PropertySummary {
  id: string;
  name: string;
  address: string;
  city: string;
  totalRooms: number;
  availableRooms: number;
  status: PropertyStatus;
}

export interface PropertyFormValues {
  name: string;
  address: string;
  city: string;
}
