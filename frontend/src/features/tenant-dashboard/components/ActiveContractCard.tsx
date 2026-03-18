import { Card, CardContent, Badge } from '@/shared/ui';
import type { ContractSummary } from '../types';

interface ActiveContractCardProps {
  contract: ContractSummary | null;
}

const vndFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

export function ActiveContractCard({ contract }: ActiveContractCardProps) {
  if (!contract) {
    return (
      <Card className="h-full border-slate-200">
        <CardContent className="flex h-full flex-col items-center justify-center p-6 text-center">
          <div className="mb-3 rounded-full bg-slate-100 p-3 text-slate-400">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-slate-900">No Active Contract</p>
          <p className="mt-1 text-xs text-slate-500">You are not currently renting any room.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full border-primary-100 bg-white">
      <div className="p-5 border-b border-slate-100 flex justify-between items-start">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Active Contract</h3>
          <p className="mt-1 text-lg font-bold text-slate-900">Room {contract.room_number}</p>
        </div>
        <Badge variant={contract.status === 'ACTIVE' ? 'success' : 'warning'}>
          {contract.status}
        </Badge>
      </div>
      <CardContent className="p-5 space-y-4">
        <div>
          <p className="text-xs text-slate-500">Property</p>
          <p className="font-medium text-slate-900">{contract.property_name}</p>
        </div>
        
        <div className="flex justify-between border-t border-slate-100 pt-4">
          <div>
            <p className="text-xs text-slate-500">Dates</p>
            <p className="font-medium text-slate-900 text-sm">
              {dateFormatter.format(new Date(contract.start_date))} - {dateFormatter.format(new Date(contract.end_date))}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500">Monthly Rent</p>
            <p className="font-medium text-slate-900 text-sm">{vndFormatter.format(contract.monthly_rent)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
