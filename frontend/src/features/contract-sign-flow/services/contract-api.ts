import { ContractData } from '@/entities/contract';

/**
 * Mocks the API call to activate a contract.
 * In a real app, this would be PATCH /contracts/{id}/activate
 */
export async function activateContract(contractId: string): Promise<void> {
  console.log('Activating contract:', contractId);
  
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 2000));
  
  // MOCK SUCCESS
  return;
}

/**
 * Mocks fetching a specific contract for review.
 * GET /contracts/{id}
 */
export async function getContractById(id: string): Promise<ContractData> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  return {
    id,
    room_id: 'room-101',
    monthly_rent: 4500000,
    deposit_amount: 9000000,
    start_date: '2026-04-01',
    end_date: '2027-03-31',
    status: 'DRAFT',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    tenant: {
      full_name: 'Nguyen Van A',
      phone: '0901234567',
      id_number: '123456789',
      email: 'nva@example.com',
    }
  } as any;
}
