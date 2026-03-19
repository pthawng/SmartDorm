import { TenantDashboardData } from '../types';
import { MaintenanceStatus } from '@/entities/maintenance/constants';
import { InvoiceStatus } from '@/entities/invoice/constants';

/**
 * Mock API to simulate fetching lifestyle-focused tenant dashboard data.
 */
export async function getTenantDashboardData(): Promise<TenantDashboardData> {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 800));

  return {
    tenantName: 'Alex Rivers',
    stay: {
      roomNumber: 'Luxe Suite 402',
      propertyName: 'Veridian Residences',
      address: '128 Orchard Road, District 9, Singapore',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=2070',
    },
    payment: {
      id: 'inv-curr-001',
      nextAmount: 5500000,
      dueDate: '2024-04-05T00:00:00Z',
      status: InvoiceStatus.PENDING,
    },
    recentMaintenance: [
      {
        id: 'req-101',
        title: 'Aircon unit making unusual noise',
        status: MaintenanceStatus.IN_PROGRESS,
        createdAt: '2024-03-15',
      },
      {
        id: 'req-102',
        title: 'Bathroom lightbulb replacement',
        status: MaintenanceStatus.RESOLVED,
        createdAt: '2024-03-02',
      }
    ]
  };
}
