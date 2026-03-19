import { z } from 'zod';

export const RenterSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  id_number: z.string().min(9, 'ID number must be at least 9 characters'),
  email: z.string().email('Invalid email address').optional().nullable(),
  date_of_birth: z.string().optional().nullable(),
  emergency_contact_name: z.string().optional().nullable(),
  emergency_contact_phone: z.string().optional().nullable(),
});

export type RenterFormPayload = z.infer<typeof RenterSchema>;
