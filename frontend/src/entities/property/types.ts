/**
 * Property entity — a building or facility containing multiple rooms.
 */

import type { ID, Nullable } from '@/shared/types/common';

export type PropertyStatus = 'draft' | 'published' | 'archived';

export interface PropertyImage {
  id: ID;
  url: string;
  is_primary: boolean;
  display_order: number;
}

export interface PropertyData {
  id: ID;
  workspace_id: ID;
  name: string;
  address: string;
  city: string;
  type?: string;
  status: PropertyStatus;
  amenities: string[];
  description: Nullable<string>;
  images?: PropertyImage[];
}
