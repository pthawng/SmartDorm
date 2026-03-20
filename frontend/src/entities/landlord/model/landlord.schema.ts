import { z } from 'zod';

/**
 * Zod validation schema for Landlord Registration.
 * Matches production requirements for phone formatting, room counts, and pricing.
 */
export const landlordSchema = z.object({
  // Step 1: Basic Info
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  phoneNumber: z.string().regex(/^[0-9]{9,11}$/, 'Invalid phone number (9-11 digits)'),
  email: z.string().email('Invalid email address'),

  // Step 2: Property Info
  propertyName: z.string().min(3, 'Property name must be at least 3 characters'),
  address: z.string().min(5, 'Please provide a complete address'),
  numberOfRooms: z.number().min(1, 'Must have at least 1 room').max(500),

  // Step 3: Details
  amenities: z.array(z.string()).min(1, 'Select at least one amenity'),
  pricePerMonth: z.number().min(0, 'Price cannot be negative'),
  images: z.array(z.string()).optional().default([]),

  // Step 4: Confirmation
  agreedToTerms: z.boolean().refine(val => val === true, 'You must agree to the terms'),
});

export type LandlordRegistrationPayload = z.infer<typeof landlordSchema>;

export const DEFAULT_FORM_VALUES: LandlordRegistrationPayload = {
  fullName: '',
  phoneNumber: '',
  email: '',
  propertyName: '',
  address: '',
  numberOfRooms: 1,
  amenities: [],
  pricePerMonth: 0,
  images: [],
  agreedToTerms: false,
};
