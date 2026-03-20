import { Button, Input } from '@/shared/ui';
import type { ContractDraft } from '../types';

interface ContractFormProps {
  draft: ContractDraft;
  updateDraft: (updates: Partial<ContractDraft>) => void;
  onBack: () => void;
  onNext: () => void;
}

export function ContractForm({ draft, updateDraft, onBack, onNext }: ContractFormProps) {
  return (
    <div className="space-y-12 animate-in slide-in-from-right-4 duration-500">
      <header className="flex items-center justify-between">
        <div className="space-y-2">
           <h3 className="text-2xl font-display font-black text-slate-900 uppercase tracking-tighter">Terms & Conditions</h3>
           <p className="text-slate-500 font-medium italic">Define the financial and temporal parameters for this lease offer.</p>
        </div>
        <Button variant="outline" size="sm" onClick={onBack} className="rounded-xl font-bold uppercase tracking-widest text-[10px] px-4">
           Back
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <section className="space-y-8">
           <div className="flex items-center gap-4">
              <div className="h-8 w-8 bg-emerald-500 rounded-full flex items-center justify-center text-white text-[10px] font-black">01</div>
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Financial Ledger</h4>
           </div>
           
           <div className="space-y-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-1">Monthly Rent (VND)</label>
                 <Input 
                   type="number" 
                   value={draft.monthly_rent} 
                   onChange={e => updateDraft({ monthly_rent: Number(e.target.value) })}
                   className="h-14 rounded-2xl bg-slate-50 border-none shadow-inner font-black text-slate-900"
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-1">Security Deposit (VND)</label>
                 <Input 
                   type="number" 
                   value={draft.deposit_amount} 
                   onChange={e => updateDraft({ deposit_amount: Number(e.target.value) })}
                   className="h-14 rounded-2xl bg-slate-50 border-none shadow-inner font-black text-slate-900"
                 />
              </div>
           </div>
        </section>

        <section className="space-y-8">
           <div className="flex items-center gap-4">
              <div className="h-8 w-8 bg-slate-900 rounded-full flex items-center justify-center text-white text-[10px] font-black">02</div>
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Temporal Scope</h4>
           </div>

           <div className="space-y-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-1">Lease Start Date</label>
                 <Input 
                   type="date" 
                   value={draft.start_date.split('T')[0]} 
                   onChange={e => updateDraft({ start_date: new Date(e.target.value).toISOString() })}
                   className="h-14 rounded-2xl bg-slate-50 border-none shadow-inner font-bold text-slate-600"
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-1">Duration (Months)</label>
                 <div className="grid grid-cols-4 gap-4">
                    {[6, 12, 18, 24].map(m => (
                      <button
                        key={m}
                        onClick={() => updateDraft({ duration_months: m })}
                        className={cn(
                          "h-12 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                          draft.duration_months === m 
                            ? "bg-slate-900 text-white shadow-lg" 
                            : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                        )}
                      >
                         {m}M
                      </button>
                    ))}
                 </div>
              </div>
           </div>
        </section>
      </div>

      <div className="pt-12 border-t border-slate-100 flex justify-end">
         <Button 
           variant="primary" 
           className="h-16 px-12 rounded-[2rem] bg-slate-900 shadow-2xl hover:bg-slate-800 transition-all font-black text-sm uppercase tracking-widest"
           onClick={onNext}
         >
            Finalize Offer Preview
         </Button>
      </div>
    </div>
  );
}

const cn = (...classes: any) => classes.filter(Boolean).join(' ');
