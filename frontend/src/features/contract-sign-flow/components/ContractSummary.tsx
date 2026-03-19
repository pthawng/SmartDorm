import { Card } from '@/shared/ui';

interface ContractSummaryProps {
  rent: number;
  deposit: number;
  startDate: string;
  endDate: string;
  onEdit?: () => void;
}

const vndFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
});

export function ContractSummary({ rent, deposit, startDate, endDate, onEdit }: ContractSummaryProps) {
  return (
    <Card className="p-0 overflow-hidden border-slate-200 shadow-xl shadow-slate-100/50 flex flex-col lg:flex-row">
      {/* Financial Spotlight */}
      <div className="bg-slate-900 p-6 md:p-8 text-white space-y-8 lg:w-72 shrink-0">
        <div>
           <div className="flex items-center gap-2 mb-1">
             <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Monthly Commitment</span>
           </div>
           <p className="text-4xl font-black text-white tabular-nums tracking-tighter leading-none">
             {vndFormatter.format(rent)}
           </p>
        </div>

        <div className="pt-8 border-t border-slate-800">
           <div className="flex items-center gap-2 mb-1">
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-400">Immediate Total Due</span>
           </div>
           <p className="text-3xl font-black text-primary-400 tabular-nums tracking-tighter leading-none mb-1">
             {vndFormatter.format(rent + deposit)}
           </p>
           <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest italic">(Rent + Security Deposit)</p>
        </div>
      </div>

      {/* Details & Timeline */}
      <div className="p-6 md:p-8 flex-1 bg-white space-y-8 min-w-0">
        <div className="flex items-center justify-between">
           <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Lease Specification</h3>
              <p className="text-xs text-slate-400 font-medium italic select-none">Legal Instrument ID: {Math.random().toString(36).substring(7).toUpperCase()}</p>
           </div>
           {onEdit && (
              <button 
                onClick={onEdit}
                className="group flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 text-slate-500 hover:bg-primary-50 hover:text-primary-600 transition-all font-black text-[10px] uppercase tracking-widest border border-slate-100"
              >
                Modify Data
                <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
           )}
        </div>

        {/* Lease Timeline */}
        <div className="space-y-4 pt-4">
           <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
              <span>Commencement</span>
              <span>Expiration</span>
           </div>
           
           <div className="relative pt-2">
             <div className="absolute inset-0 flex items-center" aria-hidden="true">
               <div className="w-full border-t-2 border-slate-100"></div>
             </div>
             <div className="relative flex justify-between">
               <div className="bg-white pr-4">
                  <div className="h-4 w-4 rounded-full border-4 border-emerald-500 shadow-lg shadow-emerald-200 flex-shrink-0 mb-3" />
                  <p className="text-sm font-black text-slate-900 tabular-nums">{startDate}</p>
               </div>
               <div className="bg-white pl-4 text-right">
                  <div className="h-4 w-4 rounded-full border-4 border-slate-300 shadow-sm ml-auto mb-3" />
                  <p className="text-sm font-black text-slate-900 tabular-nums">{endDate}</p>
               </div>
             </div>
           </div>

           <div className="bg-slate-50 p-4 rounded-xl flex items-center gap-4 border border-slate-100">
              <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center text-lg shadow-sm border border-slate-100">🛡️</div>
              <div>
                 <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Fixed Security Deposit</p>
                 <p className="text-sm font-black text-slate-700">{vndFormatter.format(deposit)}</p>
              </div>
           </div>
        </div>
      </div>
    </Card>
  );
}
