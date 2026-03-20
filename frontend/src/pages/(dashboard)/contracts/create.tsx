import { ContractIssueFeature } from '@/features/contract-issue';

export default function ContractCreatePage() {
  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-20">
      <header className="max-w-5xl mx-auto px-4 sm:px-0">
        <div className="flex items-center gap-3 mb-2">
           <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Operational Protocol 06</span>
        </div>
        <h1 className="text-5xl font-display font-black tracking-tighter text-slate-900 uppercase">Issue Digital Lease</h1>
        <p className="text-slate-500 font-medium mt-1">Configure and dispatch official rental agreements to prospective residents.</p>
      </header>

      <ContractIssueFeature />
    </div>
  );
}
