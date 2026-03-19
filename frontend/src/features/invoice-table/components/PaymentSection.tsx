import { useNavigate } from 'react-router-dom';
import { Button, Card } from '@/shared/ui';
import { InvoiceStatus } from '@/entities/invoice/constants';
import { ROUTES } from '@/shared/config/routes';

interface PaymentSectionProps {
  invoiceId: string;
  status: InvoiceStatus;
}

export function PaymentSection({ invoiceId, status }: PaymentSectionProps) {
  const navigate = useNavigate();
  const needsPayment = status === InvoiceStatus.PENDING || status === InvoiceStatus.OVERDUE;
  const isPaid = status === InvoiceStatus.PAID;

  const handlePay = () => {
    navigate(ROUTES.DASHBOARD.INVOICE_PAY(invoiceId));
  };

  return (
    <div className="relative group p-1">
      {needsPayment && (
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-primary-600 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse" />
      )}
      
      <Card className={`relative p-8 border-transparent transition-all duration-500 overflow-hidden ${
        isPaid ? 'bg-emerald-50 border-emerald-100' : 'bg-white border-slate-100'
      }`}>
        {isPaid ? (
          <div className="flex flex-col items-center text-center space-y-4">
             <div className="h-16 w-16 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                   <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
             </div>
             <div className="space-y-1">
                <h3 className="text-xl font-black text-slate-900 uppercase">Transaction Confirmed</h3>
                <p className="text-sm text-slate-500 font-medium">This invoice has been reconciled. No further action is required.</p>
             </div>
             <Button variant="secondary" onClick={() => window.print()} className="px-8">
               Print Receipt
             </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-1">
               <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Direct Payment Action</h3>
               <p className="text-xs text-slate-400 font-medium">Use our secure payment gateway to settle this balance immediately.</p>
            </div>
            
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handlePay}
              className="h-16 text-base font-black uppercase tracking-[.25em] shadow-xl shadow-primary-200 transition-all active:scale-95"
            >
              <span className="flex items-center gap-3">
                Process Payment Now
                <svg className="w-5 h-5 animate-bounce-horizontal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </Button>

            <div className="flex items-center justify-center gap-6 opacity-40 grayscale group-hover:grayscale-0 transition-all duration-700">
               <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Secured By</span>
               <div className="h-4 w-12 bg-slate-200 rounded" />
               <div className="h-4 w-12 bg-slate-200 rounded" />
               <div className="h-4 w-12 bg-slate-200 rounded" />
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
