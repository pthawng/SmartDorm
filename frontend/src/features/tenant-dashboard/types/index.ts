import { ID, ISOString } from '@/shared/types/common';
import { MaintenanceStatus } from '@/entities/maintenance/constants';
import { InvoiceStatus } from '@/entities/invoice/constants';
import { ContractStatus } from '@/entities/contract/constants';

export interface ContractSummary {
  id: ID;
  room_number: string;
  property_name: string;
  start_date: ISOString;
  end_date: ISOString;
  monthly_rent: number;
  status: ContractStatus;
}

export interface StayInfo {
  roomNumber: string;
  propertyName: string;
  address: string;
  startDate: ISOString;
  endDate: ISOString;
  imageUrl: string;
  contract?: ContractSummary;
}

export interface InvoiceSummary {
  id: ID;
  amount: number;
  due_date: ISOString;
  status: InvoiceStatus;
  title: string;
}

export interface MaintenanceSummary {
  id: ID;
  title: string;
  status: MaintenanceStatus;
  createdAt: ISOString;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface TenantDashboardData {
  tenantName: string;
  activeContract?: ContractSummary;
  stay: StayInfo;
  upcomingInvoice?: InvoiceSummary;
  recentInvoices: InvoiceSummary[];
  activeIssues: MaintenanceSummary[];
}
