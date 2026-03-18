export type RoomStatus = 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE';

export interface RoomSummary {
  id: string;
  roomNumber: string;
  propertyId: string;
  propertyName: string;
  floor: number;
  area: number; // sqm
  monthlyPrice: number;
  status: RoomStatus;
}

export interface RoomFormValues {
  roomNumber: string;
  propertyId: string;
  floor: number;
  area: number;
  monthlyPrice: number;
}
