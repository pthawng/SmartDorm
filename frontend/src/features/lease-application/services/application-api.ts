import { ApplicationStatus, CreateApplicationPayload, LeaseApplication } from '@/entities/application/types';

/**
 * Mock API for lease applications.
 */
export const applicationApi = {
  /**
   * Submit a new lease application for review.
   */
  async submitApplication(payload: CreateApplicationPayload): Promise<LeaseApplication> {
    console.log('[API] Submitting application:', payload);
    
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    return {
      id: `app-${Math.random().toString(36).substr(2, 9)}`,
      room_id: payload.room_id,
      tenant_id: 'current-user-id',
      start_date: payload.start_date,
      duration_months: payload.duration_months,
      expected_move_in: payload.expected_move_in,
      full_name: payload.full_name,
      phone: payload.phone,
      id_number: payload.id_number,
      note: payload.note,
      status: ApplicationStatus.PENDING,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  },

  /**
   * Fetch applications for the current tenant.
   */
  async getTenantApplications(): Promise<LeaseApplication[]> {
     await new Promise((resolve) => setTimeout(resolve, 800));
     return [];
  }
};
