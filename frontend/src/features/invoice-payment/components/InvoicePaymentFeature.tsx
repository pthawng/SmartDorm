import { useParams, useNavigate } from 'react-router-dom';
import { ErrorState, Button, Card } from '@/shared/ui';
import { useInvoicePayment } from '../hooks/useInvoicePayment';
import { PaymentHeader } from './PaymentHeader';
import { PaymentSummary } from './PaymentSummary';
import { PaymentMethodSelector } from './PaymentMethodSelector';
import { PaymentBreakdown } from './PaymentBreakdown';
import { PaymentButton } from './PaymentButton';
import { PaymentSuccessView } from './PaymentSuccessView';
import { ROUTES } from '@/shared/config/routes';
import { InvoiceStatus } from '@/entities/invoice/constants';

function CheckoutSkeleton() {
  return (
    <div className="max-w-5xl mx-auto py-10 px-4 space-y-10 animate-pulse">
      <div className="h-4 w-24 bg-slate-100 rounded" />
      <div className="h-16 w-1/2 bg-slate-100 rounded-2xl" />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-3 space-y-8">
           <div className="h-40 bg-slate-100 rounded-3xl" />
           <div className="space-y-4">
              <div className="h-16 bg-slate-50 rounded-2xl" />
              <div className="h-16 bg-slate-50 rounded-2xl" />
              <div className="h-16 bg-slate-50 rounded-2xl" />
           </div>
        </div>
        <div className="lg:col-span-2 space-y-6">
           <div className="h-60 bg-slate-50 rounded-3xl" />
           <div className="h-20 bg-slate-100 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

export function InvoicePaymentFeature() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    invoice,
    selectedMethod,
    setMethod,
    onPay,
    isLoading,
    isSubmitting,
    isSuccess,
    paymentReference,
    isError,
  } = useInvoicePayment(id || '');

  if (isLoading) return <CheckoutSkeleton />;

  if (isError || !invoice) {
    return (
      <div className="max-w-3xl mx-auto py-20 px-4 text-center">
        <ErrorState 
          title="Payment Session Invalid" 
          description="We couldn't initialize the payment sequence. The invoice may be invalid or already settled."
        />
        <Button variant="secondary" onClick={() => navigate(ROUTES.DASHBOARD.INVOICES)} className="mt-8">
           Return to Billing
        </Button>
      </div>
    );
  }

  if (isSuccess && paymentReference) {
    return (
      <PaymentSuccessView 
        reference={paymentReference} 
        amount={invoice.amount_due} 
      />
    );
  }

  // Defensively handle settled invoices
  if (invoice.status === InvoiceStatus.PAID) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center space-y-6">
        <div className="h-24 w-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-emerald-100 shadow-xl shadow-emerald-50">
           <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
           </svg>
        </div>
        <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Invoice Fully Settled</h2>
        <p className="text-slate-500 font-medium">This transaction has already been reconciled into our financial records.</p>
        <div className="pt-4 flex justify-center gap-4">
          <Button variant="primary" onClick={() => navigate(ROUTES.DASHBOARD.INVOICE_DETAIL(invoice.id))}>
             View History
          </Button>
          <Button variant="outline" onClick={() => navigate(ROUTES.DASHBOARD.INVOICES)}>
             Invoices List
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <header className="flex items-center justify-between">
        <button 
          onClick={() => navigate(ROUTES.DASHBOARD.INVOICE_DETAIL(invoice.id))}
          className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary-600 transition-colors"
        >
          <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
          </svg>
          Cancel Payment
        </button>
      </header>

      <PaymentHeader invoiceId={invoice.id} status={invoice.status} />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-3 space-y-8">
           <PaymentSummary 
             totalAmount={invoice.amount_due} 
             dueDate={invoice.due_date} 
             status={invoice.status} 
           />
           
           <PaymentMethodSelector 
             selectedMethod={selectedMethod} 
             onChange={setMethod} 
             disabled={isSubmitting} 
           />
        </div>

        <div className="lg:col-span-2 space-y-6">
           <PaymentBreakdown items={invoice.items || []} />
           
           <PaymentButton 
             onPay={onPay} 
             isLoading={isSubmitting} 
             disabled={!selectedMethod} 
             amount={invoice.amount_due}
           />

           <Card className="p-6 bg-slate-50 border-slate-200">
              <div className="space-y-4">
                 <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Security Guarantee</span>
                 </div>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                    Transactions are processed via high-availability financial gateways with 256-bit AES encryption. No payment data is stored on workspace servers.
                 </p>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
}
