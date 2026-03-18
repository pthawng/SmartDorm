import { RoomData, RoomStatus } from '@/entities/room';
import { RoomFormPayload } from '@/entities/room/model/schema';

// Mock service for fetching existing room
export async function getRoomById(id: string): Promise<RoomData> {
  await new Promise((resolve) => setTimeout(resolve, 800));
  
  // Return mock data mimicking the DB record
  return {
    id,
    property_id: 'p-1',
    room_number: '101',
    floor: 1,
    area_sqm: 25,
    monthly_price: 4500000,
    status: RoomStatus.AVAILABLE,
    description: 'A cozy modern loft room with great lighting.',
    images: [],
  };
}

// Mock service for updating an existing room
export async function updateRoom(id: string, payload: RoomFormPayload): Promise<RoomData> {
  await new Promise((resolve) => setTimeout(resolve, 800));
  
  // In a real app we'd call PATCH /rooms/:id
  return {
    id,
    property_id: payload.property_id,
    room_number: payload.room_number,
    floor: payload.floor,
    area_sqm: payload.area_sqm,
    monthly_price: payload.monthly_price,
    status: payload.status,
    description: payload.description ?? null,
    images: payload.images ?? [],
  };
}
