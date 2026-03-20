import { TenantDashboardData } from '../types';
import { MaintenanceStatus } from '@/entities/maintenance/constants';
import { InvoiceStatus } from '@/entities/invoice/constants';

import { ContractStatus } from '@/entities/contract/constants';

/**
 * Mock API to simulate fetching lifestyle-focused tenant dashboard data.
 */
export async function getTenantDashboardData(): Promise<TenantDashboardData> {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 800));

  return {
    tenantName: 'Alex Rivers',
    activeContract: {
      id: 'ctr-v2-001',
      room_number: 'Luxe Suite 402',
      property_name: 'Veridian Residences',
      start_date: '2024-04-01',
      end_date: '2025-04-01',
      monthly_rent: 5500000,
      status: ContractStatus.PENDING_SIGNATURE, // For E2E Flow Testing
    },
    stay: {
      roomNumber: 'Luxe Suite 402',
      propertyName: 'Veridian Residences',
      address: '128 Orchard Road, District 9, Singapore',
      startDate: '2024-04-01',
      endDate: '2025-04-01',
      imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=2070',
    },
    upcomingInvoice: {
      id: 'inv-curr-001',
      amount: 5500000,
      due_date: '2024-04-05T00:00:00Z',
      status: InvoiceStatus.PENDING,
      title: 'Security Deposit & First Month Rent',
    },
    recentInvoices: [
       {
         id: 'inv-curr-001',
         amount: 5500000,
         due_date: '2024-04-05T00:00:00Z',
         status: InvoiceStatus.PENDING,
         title: 'Initial Payment',
       }
    ],
    activeIssues: [
      {
        id: 'req-101',
        title: 'Check-in Inspection',
        status: MaintenanceStatus.OPEN,
        createdAt: '2024-03-25',
      }
    ]
  };
}
