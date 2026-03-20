import { ContractData } from '@/entities/contract';

/**
 * Mocks the API call to sign a contract.
 * In a real app, this would be PATCH /contracts/{id}/sign
 */
export async function signContract(contractId: string): Promise<void> {
  console.log('Signing contract:', contractId);
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return;
}

/**
 * Mocks the API call to pay deposit and activate a contract.
 * In a real app, this would be PATCH /contracts/{id}/pay-deposit
 */
export async function payDeposit(contractId: string): Promise<void> {
  console.log('Paying deposit for contract:', contractId);
  await new Promise((resolve) => setTimeout(resolve, 2000));
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
