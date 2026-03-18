import type { RoomDetail, PropertyData } from '../types';
import { RoomStatus } from '@/entities/room/constants';

/**
 * Mock data for room detail view.
 */
export const MOCK_ROOM: RoomDetail = {
  id: 'r1',
  property_id: '1',
  room_number: '101',
  floor: 1,
  area_sqm: 25,
  monthly_price: 4500000,
  status: RoomStatus.AVAILABLE,
  description:
    'Experience comfortable living in our premium single room. Featuring a large window allowing abundant natural light, this room is perfect for young professionals. It comes fully equipped with a comfortable bed, a dedicated workspace, and ample storage space.',
  gallery: [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800&h=600&fit=crop',
  ],
  amenities: [
    'Queen Bed',
    'Desk & Chair',
    'Air Conditioning',
    'Large Window',
    'Private Bathroom',
    'Wardrobe',
  ],
  deposit_months: 1,
};

export const MOCK_PROPERTY: PropertyData = {
  id: '1',
  workspace_id: 'ws-1',
  name: 'The Modern Loft',
  address: '123 Nguyen Hue Boulevard',
  city: 'Ho Chi Minh City',
  description: null,
};
