/**
 * Property Detail feature — local types extending the entity types.
 */

import type { PropertyData } from '@/entities/property';
import type { RoomData } from '@/entities/room';

/** Property with computed fields for the detail view */
export interface PropertyDetail extends PropertyData {
  imageUrl: string;
  gallery: string[];
  amenities: string[];
  rating: number;
  totalRooms: number;
  availableRooms: number;
  manager?: {
    name: string;
    phone: string;
    email: string;
  };
}

export type { RoomData };
