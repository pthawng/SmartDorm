import { InvoiceData, InvoiceItem } from '@/entities/invoice/types';
import { InvoiceStatus } from '@/entities/invoice/constants';

/**
 * Mock API service for invoice details.
 */

const MOCK_ITEMS: InvoiceItem[] = [
  { id: '1', description: 'Monthly Rent - April 2026', amount: 4500000, type: 'RENT' },
  { id: '2', description: 'Electricity Consumption (240kWh)', amount: 840000, type: 'UTILITY' },
  { id: '3', description: 'Water Usage (12m3)', amount: 120000, type: 'UTILITY' },
  { id: '4', description: 'Service Fee (Cleaning & Security)', amount: 200000, type: 'FEE' },
];

export async function getInvoiceById(id: string): Promise<InvoiceData> {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return {
    id,
    workspace_id: 'ws_1',
    contract_id: 'ct_101',
    renter_id: 'rn_502',
    room_name: 'ROOM-101',
    renter_name: 'Nguyen Van A',
    billing_period_start: '2026-04-01',
    billing_period_end: '2026-04-30',
    amount_due: 5660000,
    status: InvoiceStatus.PENDING,
    due_date: '2026-05-05',
    paid_at: null,
    notes: 'Please pay before the 5th to avoid late fees.',
    items: MOCK_ITEMS,
  };
}

export async function getInvoices(): Promise<InvoiceData[]> {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return [
    {
      id: 'inv_1',
      workspace_id: 'ws_1',
      contract_id: 'ct_101',
      renter_id: 'rn_502',
      room_name: 'ROOM-101',
      renter_name: 'Nguyen Van A',
      billing_period_start: '2026-04-01',
      billing_period_end: '2026-04-30',
      amount_due: 5660000,
      status: InvoiceStatus.PENDING,
      due_date: '2026-05-05',
      paid_at: null,
      notes: null,
    },
    {
      id: 'inv_2',
      workspace_id: 'ws_1',
      contract_id: 'ct_102',
      renter_id: 'rn_503',
      room_name: 'ROOM-102',
      renter_name: 'Tran Thi B',
      billing_period_start: '2026-04-01',
      billing_period_end: '2026-04-30',
      amount_due: 4200000,
      status: InvoiceStatus.PAID,
      due_date: '2026-05-05',
      paid_at: '2026-05-02',
      notes: null,
    },
    {
      id: 'inv_3',
      workspace_id: 'ws_1',
      contract_id: 'ct_103',
      renter_id: 'rn_504',
      room_name: 'ROOM-201',
      renter_name: 'Le Van C',
      billing_period_start: '2026-03-01',
      billing_period_end: '2026-03-31',
      amount_due: 6100000,
      status: InvoiceStatus.OVERDUE,
      due_date: '2026-04-05',
      paid_at: null,
      notes: null,
    },
  ];
}
