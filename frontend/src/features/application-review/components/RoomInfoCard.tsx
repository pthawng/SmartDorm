import { Card } from '@/shared/ui';
import type { LeaseTerms } from '../types';

interface RoomInfoCardProps {
  propertyName: string;
  roomNumber: string;
  terms: LeaseTerms;
}

const vndFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
});

export function RoomInfoCard({ propertyName, roomNumber, terms }: RoomInfoCardProps) {
  return (
    <Card className="p-8 border-none bg-white shadow-sm ring-1 ring-slate-100 flex flex-col md:flex-row gap-8 items-center">
      <div className="shrink-0 h-16 w-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg">
         <span className="text-xs font-black uppercase tracking-widest">{roomNumber}</span>
      </div>
      
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div className="space-y-1">
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Asset Location</span>
          <p className="text-sm font-bold text-slate-900 truncate uppercase">{propertyName}</p>
        </div>
        <div className="space-y-1">
          <span className="text-[10px] font-black text-emerald-300 uppercase tracking-[0.2em]">Monthly Rent</span>
          <p className="text-lg font-black text-emerald-600 tabular-nums">{vndFormatter.format(terms.monthly_rent)}</p>
        </div>
        <div className="space-y-1">
          <span className="text-[10px] font-black text-sky-300 uppercase tracking-[0.2em]">Security Deposit</span>
          <p className="text-lg font-black text-sky-600 tabular-nums">{vndFormatter.format(terms.deposit_amount)}</p>
        </div>
      </div>
    </Card>
  );
}
