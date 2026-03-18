import { ContractStatus } from '@/entities/contract';
import type { ContractSummary } from '../types';

export const MOCK_CONTRACTS: ContractSummary[] = [
  {
    id: 'CON-001',
    renter_name: 'Nguyen Van A',
    room_number: '101',
    start_date: '2024-01-01T00:00:00Z',
    end_date: '2024-12-31T23:59:59Z',
    monthly_rent: 4500000,
    status: ContractStatus.ACTIVE,
  },
  {
    id: 'CON-002',
    renter_name: 'Tran Thi B',
    room_number: '202',
    start_date: '2023-06-15T00:00:00Z',
    end_date: '2024-06-14T23:59:59Z',
    monthly_rent: 5200000,
    status: ContractStatus.ACTIVE,
  },
  {
    id: 'CON-003',
    renter_name: 'Le Van C',
    room_number: '103',
    start_date: '2023-01-01T00:00:00Z',
    end_date: '2023-12-31T23:59:59Z',
    monthly_rent: 4000000,
    status: ContractStatus.EXPIRED,
  },
  {
    id: 'CON-004',
    renter_name: 'Pham Minh D',
    room_number: '305',
    start_date: '2024-03-01T00:00:00Z',
    end_date: '2025-02-28T23:59:59Z',
    monthly_rent: 6000000,
    status: ContractStatus.DRAFT,
  },
  {
    id: 'CON-005',
    renter_name: 'Hoang Xuan E',
    room_number: '401',
    start_date: '2023-05-20T00:00:00Z',
    end_date: '2023-11-20T23:59:59Z',
    monthly_rent: 4800000,
    status: ContractStatus.TERMINATED,
  },
];

export async function getContracts(): Promise<ContractSummary[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));
  return MOCK_CONTRACTS;
}
