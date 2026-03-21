import { z } from 'zod';

/**
 * Zod validation schema for Landlord Registration.
 * Matches production requirements for phone formatting, room counts, and pricing.
 */
export const landlordSchema = z.object({
  // Step 1: Basic Info (Email is now part of unified step)
  fullName: z.string().min(2, 'Name must be at least 2 characters').optional().or(z.literal('')),
  phoneNumber: z.string().regex(/^[0-9]{9,11}$/, 'Invalid phone number (9-11 digits)').optional().or(z.literal('')),
  email: z.string().email('Invalid email address'),

  // Step 2: Workspace Info (Name is now part of unified step)
  propertyName: z.string().min(3, 'Workspace name must be at least 3 characters'),
  address: z.string().min(5, 'Please provide a complete address').optional().or(z.literal('')),
  numberOfRooms: z.number().min(1, 'Must have at least 1 room').max(500).optional().default(1),

  // Step 3: Details
  amenities: z.array(z.string()).min(1, 'Select at least one amenity').optional().default([]),
  pricePerMonth: z.number().min(0, 'Price cannot be negative').optional().default(0),
  images: z.array(z.string()).optional().default([]),

  // Step 4: Confirmation
  agreedToTerms: z.boolean().refine(val => val === true, 'You must agree to the terms').optional().default(true),
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
