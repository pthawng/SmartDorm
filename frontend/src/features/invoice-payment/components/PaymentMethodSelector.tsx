import { PaymentMethod } from '../types';

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod | null;
  onChange: (method: PaymentMethod) => void;
  disabled?: boolean;
}

const METHODS: { id: PaymentMethod; label: string; icon: string; description: string }[] = [
  { id: 'bank_transfer', label: 'Bank Transfer', icon: '🏦', description: 'Direct wire to corporate account' },
  { id: 'e_wallet', label: 'E-Wallet (Momo/ZaloPay)', icon: '📱', description: 'Instant processing via QR code' },
  { id: 'cash', label: 'Cash at Office', icon: '💵', description: 'Pay at management reception' },
];

export function PaymentMethodSelector({ selectedMethod, onChange, disabled }: PaymentMethodSelectorProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Select Transact Method</h3>
      <div className="grid grid-cols-1 gap-3">
        {METHODS.map((method) => {
          const isSelected = selectedMethod === method.id;
          
          return (
            <button
              key={method.id}
              type="button"
              disabled={disabled}
              onClick={() => onChange(method.id)}
              className={`relative flex items-center p-4 border rounded-2xl transition-all duration-300 text-left ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${
                isSelected 
                  ? 'border-primary-500 bg-primary-50/30' 
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-xl mr-4 transition-colors ${
                isSelected ? 'bg-primary-100 text-primary-600' : 'bg-slate-50 text-slate-500'
              }`}>
                {method.icon}
              </div>
              
              <div className="flex-1">
                <p className={`text-sm font-black tracking-tight ${isSelected ? 'text-primary-900' : 'text-slate-900'}`}>{method.label}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{method.description}</p>
              </div>

              <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                isSelected ? 'border-primary-500 bg-primary-500' : 'border-slate-300'
              }`}>
                {isSelected && <div className="h-2 w-2 bg-white rounded-full" />}
              </div>

              {isSelected && (
                <div className="absolute -inset-px border border-primary-500 rounded-2xl shadow-[0_0_15px_-3px_rgba(59,130,246,0.3)] pointer-events-none" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
