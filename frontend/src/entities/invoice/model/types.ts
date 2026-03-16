export interface Invoice {
  id: string;
  workspace_id: string;
  contract_id: string;
  renter_id: string;
  billing_period_start: string;
  billing_period_end: string;
  amount_due: number;
  status: 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  due_date: string;
  paid_at?: string;
  notes?: string;
}
