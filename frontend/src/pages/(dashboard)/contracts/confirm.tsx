import { ContractConfirmFeature } from '@/features/contract-confirm/components/ContractConfirmFeature';

export default function ContractConfirmPage() {
  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-20">
      <header className="max-w-5xl mx-auto px-4 sm:px-0">
        <div className="flex items-center gap-3 mb-2">
           <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Counter-Sign Protocol 09</span>
        </div>
        <h1 className="text-5xl font-display font-black tracking-tighter text-slate-900 uppercase">Lease Validation</h1>
        <p className="text-slate-500 font-medium mt-1">Finalize the legal agreement and activate the tenant's residence access.</p>
      </header>

      <div className="px-4 sm:px-0">
        <ContractConfirmFeature />
      </div>
    </div>
  );
}
