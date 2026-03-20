import { useContractIssue } from '../hooks/useContractIssue';
import { RoomSelector } from './RoomSelector.tsx';
import { TenantSelector } from './TenantSelector.tsx';
import { ContractForm } from './ContractForm.tsx';
import { ReviewStep } from './ReviewStep.tsx';
import { SuccessStep } from './SuccessStep.tsx';
import { cn } from '@/shared/utils';

/**
 * ContractIssueFeature — The Landlord's Lease Builder.
 * A high-fidelity, 5-step stepper for proactive lease issuance.
 */
export function ContractIssueFeature() {
  const { 
    step, 
    draft, 
    prev, 
    updateDraft, 
    selectRoom, 
    selectTenant, 
    submitOffer, 
    isSubmitting 
  } = useContractIssue();

  const steps = [
    { id: 'ROOM', label: 'Select Room' },
    { id: 'TENANT', label: 'Select Tenant' },
    { id: 'TERMS', label: 'Set Terms' },
    { id: 'REVIEW', label: 'Review Offer' },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === step);

  if (step === 'SUCCESS') {
    return <SuccessStep />;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      {/* Stepper Header */}
      <nav className="flex items-center justify-between px-4 sm:px-0">
        <ul className="flex items-center gap-8 w-full">
          {steps.map((s, index) => (
            <li key={s.id} className="flex-1 group">
              <div className="flex flex-col gap-3">
                <div className={cn(
                  "h-1.5 w-full rounded-full transition-all duration-500",
                  index <= currentStepIndex ? "bg-emerald-500" : "bg-slate-100"
                )} />
                <div className="flex flex-col">
                   <span className={cn(
                     "text-[9px] font-black uppercase tracking-[0.2em] transition-colors",
                     index <= currentStepIndex ? "text-emerald-500" : "text-slate-300"
                   )}>Step 0{index + 1}</span>
                   <span className={cn(
                     "text-xs font-bold uppercase tracking-wider transition-colors",
                     index === currentStepIndex ? "text-slate-900" : "text-slate-400"
                   )}>{s.label}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </nav>

      <main className="bg-white rounded-[2rem] border border-slate-100 shadow-2xl shadow-slate-200/40 overflow-hidden min-h-[600px] flex flex-col">
        <div className="flex-1 p-8 sm:p-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
           {step === 'ROOM' && (
             <RoomSelector onSelect={selectRoom} />
           )}
           {step === 'TENANT' && (
             <TenantSelector onSelect={selectTenant} onBack={prev} />
           )}
           {step === 'TERMS' && (
             <ContractForm 
               draft={draft} 
               updateDraft={updateDraft} 
               onBack={prev} 
               onNext={() => updateDraft({})} // Dummy trigger for next step logic is handled in Form
             />
           )}
           {step === 'REVIEW' && (
             <ReviewStep 
               draft={draft} 
               onBack={prev} 
               onConfirm={submitOffer} 
               isSubmitting={isSubmitting} 
             />
           )}
        </div>
      </main>
    </div>
  );
}
