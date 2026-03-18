/**
 * Room Detail feature — extending the base entity types.
 */

import type { RoomData } from '@/entities/room';
import type { PropertyData } from '@/entities/property';

export interface RoomDetail extends RoomData {
  gallery: string[];
  amenities: string[];
  deposit_months: number;
}

export type { PropertyData };
