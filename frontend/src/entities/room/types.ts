/**
 * Room entity — individual rental units.
 */

import type { ID, Nullable } from '@/shared/types/common';
import { RoomStatus } from './constants';

export interface RoomData {
  id: ID;
  property_id: ID;
  room_number: string;
  floor: number;
  area_sqm: number;
  monthly_price: number;
  status: RoomStatus;
  description: Nullable<string>;
  images: string[];
}
