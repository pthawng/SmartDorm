import { ID, ISOString } from '@/shared/types/common';
import { MaintenanceStatus } from '@/entities/maintenance/constants';
import { InvoiceStatus } from '@/entities/invoice/constants';

export interface StayInfo {
  roomNumber: string;
  propertyName: string;
  address: string;
  startDate: ISOString;
  endDate: ISOString;
  imageUrl: string;
}

export interface DashboardPaymentInfo {
  id: ID;
  nextAmount: number;
  dueDate: ISOString;
  status: InvoiceStatus;
}

export interface MaintenanceSummary {
  id: ID;
  title: string;
  status: MaintenanceStatus;
  createdAt: ISOString;
}

export interface TenantDashboardData {
  tenantName: string;
  stay: StayInfo;
  payment: DashboardPaymentInfo;
  recentMaintenance: MaintenanceSummary[];
}
