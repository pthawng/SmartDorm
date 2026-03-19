import { Card, Badge } from '@/shared/ui';
import { StayInfo } from '../types';

interface CurrentStayCardProps {
  stay: StayInfo;
}

export function CurrentStayCard({ stay }: CurrentStayCardProps) {
  return (
    <Card className="p-0 overflow-hidden border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] hover:shadow-[0_48px_80px_-16px_rgba(0,0,0,0.12)] transition-all duration-700 rounded-[40px] group cursor-pointer bg-white">
      <div className="relative aspect-[21/9] overflow-hidden">
        <img 
          src={stay.imageUrl} 
          alt={stay.propertyName} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
        />
        <div className="absolute top-6 left-6">
          <Badge variant="success" className="px-5 py-2 bg-emerald-500 shadow-xl border-none text-[10px] font-black uppercase tracking-widest ring-8 ring-white/20 backdrop-blur-md">
            Verified Active
          </Badge>
        </div>
      </div>
      
      <div className="p-12 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-600 bg-primary-50 px-3 py-1 rounded-lg">Unit {stay.roomNumber.replace('Luxe Suite ', '')}</span>
               <span className="h-1.5 w-1.5 rounded-full bg-slate-200" />
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">{stay.roomNumber}</span>
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">{stay.propertyName}</h2>
            <p className="text-slate-400 font-bold text-sm tracking-tight leading-relaxed max-w-lg">{stay.address}</p>
          </div>

          <div className="hidden md:block">
             <button className="h-14 px-8 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-600 transition-all active:scale-95 shadow-xl shadow-slate-200">
                Reside Detail
             </button>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-50 grid grid-cols-2 md:grid-cols-3 gap-8">
           <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 block">Check-In</span>
              <p className="text-sm font-black text-slate-700 tracking-widest">{stay.startDate}</p>
           </div>
           <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 block">Renewal</span>
              <p className="text-sm font-black text-slate-700 tracking-widest">{stay.endDate}</p>
           </div>
           <div className="space-y-1 col-span-2 md:col-span-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 block">Host Contact</span>
              <p className="text-sm font-black text-slate-700 tracking-widest hover:text-primary-600 cursor-pointer">+65 8292 XXXX</p>
           </div>
        </div>
      </div>
    </Card>
  );
}
