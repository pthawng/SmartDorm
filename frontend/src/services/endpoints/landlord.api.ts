import { apiClient } from '@/services/apiClient';
import type { LandlordRegistrationPayload } from '@/entities/landlord/model/landlord.schema';

/**
 * API abstraction for Landlord-specific operations.
 * Decouples components from direct axios/fetch calls.
 */
export const landlordApi = {
  /**
   * Register the current user as a landlord and create their first workspace.
   */
  register: async (data: LandlordRegistrationPayload) => {
    // Note: Ensuring numeric values are correctly typed for the backend
    const payload = {
      ...data,
      numberOfRooms: Number(data.numberOfRooms),
      pricePerMonth: Number(data.pricePerMonth),
    };
    
    return apiClient.post('/landlord/register', payload);
  },
};
