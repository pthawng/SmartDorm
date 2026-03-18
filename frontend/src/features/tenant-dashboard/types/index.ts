export interface ContractSummary {
  id: string;
  room_number: string;
  property_name: string;
  start_date: string;
  end_date: string;
  monthly_rent: number;
  status: 'ACTIVE' | 'PENDING' | 'EXPIRED' | 'TERMINATED';
}

export interface InvoiceSummary {
  id: string;
  amount: number;
  due_date: string;
  status: 'PAID' | 'UNPAID' | 'OVERDUE';
  title: string;
}

export interface MaintenanceSummary {
  id: string;
  title: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';
  created_at: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface TenantDashboardData {
  activeContract: ContractSummary | null;
  upcomingInvoice: InvoiceSummary | null;
  recentInvoices: InvoiceSummary[];
  activeIssues: MaintenanceSummary[];
}
