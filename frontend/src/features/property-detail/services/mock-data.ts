import type { PropertyDetail, RoomData } from '../types';
import { RoomStatus } from '@/entities/room/constants';

/**
 * Mock data for property detail view.
 * Will be replaced by API when backend is connected.
 */
export const MOCK_PROPERTY: PropertyDetail = {
  id: '1',
  workspace_id: 'ws-1',
  name: 'The Modern Loft',
  address: '123 Nguyen Hue Boulevard',
  city: 'Ho Chi Minh City',
  description:
    'The Modern Loft is a premium co-living space in the heart of District 1. Featuring modern architecture, high-speed internet, and a rooftop garden, it\'s the perfect home for young professionals and students. Each room comes fully furnished with air conditioning, a private bathroom, and access to shared kitchen and laundry facilities.',
  imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&h=600&fit=crop',
  gallery: [
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&h=300&fit=crop',
  ],
  amenities: ['Wi-Fi', 'Parking', 'Laundry', 'Security', 'Air Conditioning', 'Kitchen'],
  rating: 4.8,
  totalRooms: 24,
  availableRooms: 8,
  manager: {
    name: 'Nguyen Van A',
    phone: '+84 901 234 567',
    email: 'manager@modernloft.vn',
  },
};

export const MOCK_ROOMS: RoomData[] = [
  {
    id: 'r1',
    property_id: '1',
    room_number: '101',
    floor: 1,
    area_sqm: 25,
    monthly_price: 4500000,
    status: RoomStatus.AVAILABLE,
    description: 'Cozy single room with balcony view',
  },
  {
    id: 'r2',
    property_id: '1',
    room_number: '201',
    floor: 2,
    area_sqm: 35,
    monthly_price: 6500000,
    status: RoomStatus.OCCUPIED,
    description: 'Spacious double room with ensuite bathroom',
  },
  {
    id: 'r3',
    property_id: '1',
    room_number: '301',
    floor: 3,
    area_sqm: 45,
    monthly_price: 8000000,
    status: RoomStatus.AVAILABLE,
    description: 'Premium suite with living area and city view',
  },
  {
    id: 'r4',
    property_id: '1',
    room_number: '102',
    floor: 1,
    area_sqm: 20,
    monthly_price: 3500000,
    status: RoomStatus.MAINTENANCE,
    description: 'Standard single room',
  },
];
