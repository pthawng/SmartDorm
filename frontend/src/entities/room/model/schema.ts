import { z } from 'zod';
import { RoomStatus } from '../constants';

export const RoomSchema = z.object({
  room_number: z.string().min(1, 'Please enter a room number (e.g., 101)'),
  property_id: z.string().min(1, 'Please select the property this room belongs to'),
  floor: z.number({ required_error: 'Floor is required' })
    .int('Floor must be a whole number')
    .min(1, 'Floor number must be at least 1'),
  area_sqm: z.number({ required_error: 'Area is required' })
    .min(1, 'Area must be at least 1 m²'),
  monthly_price: z.number({ required_error: 'Price is required' })
    .min(0, 'Price cannot be negative'),
  status: z.nativeEnum(RoomStatus, { required_error: 'Please select the current room status' }),
  description: z.string().nullable().optional(),
  images: z.array(z.string()).default([]),
});

export type RoomFormPayload = z.infer<typeof RoomSchema>;
