import { Button } from '@/shared/ui';

interface PaymentButtonProps {
  onPay: () => void;
  isLoading: boolean;
  disabled: boolean;
  amount: number;
}

const vndFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
});

export function PaymentButton({ onPay, isLoading, disabled, amount }: PaymentButtonProps) {
  return (
    <div className="relative group mt-8">
      {!disabled && !isLoading && (
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-indigo-600 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse" />
      )}
      <Button
        variant="primary"
        size="lg"
        fullWidth
        disabled={disabled || isLoading}
        isLoading={isLoading}
        onClick={onPay}
        className={`relative h-20 text-lg font-black uppercase tracking-widest shadow-2xl transition-all duration-500 overflow-hidden ${
          !disabled ? 'shadow-primary-300 scale-[1.02] border-primary-400' : 'grayscale opacity-50 shadow-none'
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-primary-600 opacity-90" />
        <span className="relative flex items-center justify-center gap-4">
          <span className="tracking-[.2em]">Authorize Settlement</span>
          <span className="tabular-nums bg-white/20 px-3 py-1 rounded-full text-white tracking-tight backdrop-blur-sm flex items-center gap-1">
             <span className="text-[8px] opacity-60">TOTAL</span>
             {vndFormatter.format(amount)}
          </span>
          <svg className="w-6 h-6 animate-bounce-horizontal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </span>
      </Button>
      <div className="flex justify-center mt-3 gap-2 text-[8px] font-black uppercase tracking-widest text-slate-400 text-center">
         <span className="flex items-center gap-1"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg> 256-Bit SSL Encryption</span>
         <span>•</span>
         <span>Instant Reconciliation</span>
      </div>
    </div>
  );
}
