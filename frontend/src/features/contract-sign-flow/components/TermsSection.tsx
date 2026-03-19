import { Card, Badge } from '@/shared/ui';

export function TermsSection() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Critical Stipulations</h3>
        <Badge variant="neutral" className="px-2 py-0 text-[8px] font-black uppercase tracking-widest">Subject to Code of Conduct</Badge>
      </div>

      {/* Featured Terms Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { icon: '🏠', label: 'Single Occupancy', active: true },
          { icon: '🚭', label: 'No Indoor Smoking', active: true },
          { icon: '💵', label: 'Late Fee: 3 Days', active: true },
          { icon: '🔇', label: 'Quiet Hours: 10PM', active: true },
        ].map((term) => (
          <div key={term.label} className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl shadow-sm shadow-slate-100/50">
             <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-base">{term.icon}</div>
             <span className="text-[10px] font-black uppercase tracking-tight text-slate-700">{term.label}</span>
          </div>
        ))}
      </div>

      <Card className="p-6 space-y-6 border-slate-200 bg-slate-950 text-slate-300">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Legal Document Fragment</h3>
          <span className="text-[9px] font-medium italic text-slate-600 italic">v2.4.0-LEGAL</span>
        </div>
        
        <div className="space-y-6 text-[11px] leading-relaxed max-h-[140px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-slate-800 select-none">
          <section className="space-y-1">
            <p className="font-black text-white uppercase text-[9px] tracking-widest">1. Payment Obligations</p>
            <p>
              Tenant agrees to pay monthly rent by the 5th. 
              Late payments beyond 3 days incur a 5% penalty.
            </p>
          </section>

          <section className="space-y-1">
            <p className="font-black text-white uppercase text-[9px] tracking-widest">2. Security Deposit</p>
            <p>
              Held for unit damage/arrears. 
              Refundable within 14 days subject to inspection.
            </p>
          </section>

          <section className="space-y-1">
            <p className="font-black text-white uppercase text-[9px] tracking-widest">3. Occupancy Rules</p>
            <p>
              Quiet hours (10PM - 6AM). 
              Subletting without written consent is grounds for termination.
            </p>
          </section>
        </div>
      </Card>
    </div>
  );
}
