import { Card } from '@/shared/ui';

interface RenterInfoProps {
  fullName: string;
  roomName: string;
}

export function RenterInfo({ fullName, roomName }: RenterInfoProps) {
  return (
    <Card className="p-6 border-slate-200 bg-slate-50/30">
       <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-xl shadow-sm border border-slate-100">👤</div>
          <div>
             <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">Billing Recipient</p>
             <p className="text-lg font-black text-slate-900 tracking-tight leading-none">{fullName}</p>
             <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Allocation: <span className="text-primary-600">{roomName}</span></p>
          </div>
       </div>
    </Card>
  );
}
