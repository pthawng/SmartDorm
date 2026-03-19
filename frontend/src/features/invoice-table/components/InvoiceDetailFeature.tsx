import { useParams, useNavigate } from 'react-router-dom';
import { Loading, ErrorState, Button } from '@/shared/ui';
import { useInvoiceDetail } from '../hooks/useInvoiceDetail';
import { InvoiceHeader } from './InvoiceHeader';
import { InvoiceSummary } from './InvoiceSummary';
import { InvoiceItems } from './InvoiceItems';
import { RenterInfo } from './RenterInfo';
import { PaymentSection } from './PaymentSection';
import { ROUTES } from '@/shared/config/routes';

export function InvoiceDetailFeature() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { invoice, isLoading, isError } = useInvoiceDetail(id || '');

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4">
        <Loading message="Fetching billing breakdown..." />
      </div>
    );
  }

  if (isError || !invoice) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4">
        <ErrorState 
          title="Billing Record Not Found" 
          description="We couldn't retrieve the specific invoice details. It might be archived or restricted."
        />
        <div className="mt-8 text-center">
           <Button variant="secondary" onClick={() => navigate(ROUTES.DASHBOARD.INVOICES)}>
              Back to Invoices
           </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex items-center justify-between">
        <button 
          onClick={() => navigate(ROUTES.DASHBOARD.INVOICES)}
          className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary-600 transition-colors"
        >
          <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Billing
        </button>
        <span className="text-primary-600 font-black text-[10px] uppercase tracking-[0.3em]">Financial Breakdown</span>
      </header>

      <InvoiceHeader 
        invoiceId={invoice.id} 
        status={invoice.status}
        periodStart={invoice.billing_period_start}
        periodEnd={invoice.billing_period_end}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-12">
           <InvoiceSummary 
             totalAmount={invoice.amount_due} 
             dueDate={invoice.due_date} 
             status={invoice.status} 
           />
           
           <InvoiceItems items={invoice.items || []} />
        </div>

        <div className="space-y-10">
           <section className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Identity Context</h4>
              <RenterInfo fullName={invoice.renter_name} roomName={invoice.room_name} />
           </section>

           <section className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Payment Authorization</h4>
              <PaymentSection invoiceId={invoice.id} status={invoice.status} />
           </section>

           <div className="p-6 bg-slate-900 rounded-3xl text-white space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Notice</p>
              <p className="text-xs font-medium leading-relaxed text-slate-300">
                Billing disputes must be filed within 48 hours of invoice generation. 
                Service continuity depends on timely reconciliation.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
