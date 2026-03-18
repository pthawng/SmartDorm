import type { RoomSummary } from '../types';

export const MOCK_ROOMS: RoomSummary[] = [
  { id: 'r-1', roomNumber: '101', propertyId: 'p-1', propertyName: 'The Modern Loft', floor: 1, area: 25, monthlyPrice: 4500000, status: 'AVAILABLE' },
  { id: 'r-2', roomNumber: '102', propertyId: 'p-1', propertyName: 'The Modern Loft', floor: 1, area: 30, monthlyPrice: 5500000, status: 'OCCUPIED' },
  { id: 'r-3', roomNumber: '201', propertyId: 'p-1', propertyName: 'The Modern Loft', floor: 2, area: 28, monthlyPrice: 5000000, status: 'AVAILABLE' },
  { id: 'r-4', roomNumber: '205', propertyId: 'p-1', propertyName: 'The Modern Loft', floor: 2, area: 22, monthlyPrice: 4000000, status: 'MAINTENANCE' },
  { id: 'r-5', roomNumber: '301', propertyId: 'p-2', propertyName: 'Sunrise Villas', floor: 3, area: 35, monthlyPrice: 6500000, status: 'OCCUPIED' },
  { id: 'r-6', roomNumber: '304', propertyId: 'p-2', propertyName: 'Sunrise Villas', floor: 3, area: 32, monthlyPrice: 6000000, status: 'AVAILABLE' },
  { id: 'r-7', roomNumber: '102', propertyId: 'p-3', propertyName: 'Green Bay Residency', floor: 1, area: 20, monthlyPrice: 3500000, status: 'OCCUPIED' },
  { id: 'r-8', roomNumber: '103', propertyId: 'p-3', propertyName: 'Green Bay Residency', floor: 1, area: 20, monthlyPrice: 3500000, status: 'AVAILABLE' },
];
