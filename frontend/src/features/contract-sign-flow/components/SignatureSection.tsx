import { Button, Badge } from '@/shared/ui';

interface SignatureSectionProps {
  isAgreed: boolean;
  onAgreedChange: (val: boolean) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function SignatureSection({ isAgreed, onAgreedChange, onSubmit, isSubmitting }: SignatureSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4 group cursor-pointer select-none p-4 rounded-xl border border-transparent transition-all hover:bg-slate-50 hover:border-slate-100" onClick={() => onAgreedChange(!isAgreed)}>
        <div className={`mt-0.5 h-6 w-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
          isAgreed ? 'bg-primary-600 border-primary-600 shadow-lg shadow-primary-200 transform scale-110' : 'border-slate-300 bg-white group-hover:border-primary-400'
        }`}>
           {isAgreed && (
             <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
             </svg>
           )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-sm font-black text-slate-800 tracking-tight leading-tight">
              Legal Certification & Electronic Signature
            </p>
            {!isAgreed && (
              <Badge variant="error" className="text-[8px] px-1.5 py-0 font-black uppercase leading-none h-4">Required</Badge>
            )}
          </div>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            I hereby certify that all information presented in this digital instrument is accurate. 
            Execution of this action represents a legally binding commitment to the lease terms specified above.
          </p>
        </div>
      </div>

      <div className="relative group">
        {isAgreed && !isSubmitting && (
          <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-indigo-600 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse" />
        )}
        <Button
          variant="primary"
          size="lg"
          fullWidth
          disabled={!isAgreed || isSubmitting}
          isLoading={isSubmitting}
          onClick={onSubmit}
          className={`relative h-20 text-lg font-black uppercase tracking-[.25em] shadow-2xl transition-all duration-500 overflow-hidden ${
            isAgreed ? 'shadow-primary-300 scale-[1.02] border-primary-400' : 'grayscale opacity-50 shadow-none'
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-indigo-700 opacity-90" />
          <span className="relative flex items-center justify-center gap-4">
            Execute Binding Digital Signature
            <svg className="w-6 h-6 animate-bounce-horizontal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </span>
        </Button>
      </div>

      <p className="text-center text-[10px] text-slate-400 uppercase font-black tracking-widest">
         Authorized Transaction • ISO-27001 Compliant Signing
      </p>
    </div>
  );
}
