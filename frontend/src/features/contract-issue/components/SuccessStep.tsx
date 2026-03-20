import { Button } from '@/shared/ui';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/shared/config/routes';

export function SuccessStep() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-20 px-8 text-center animate-in zoom-in-95 duration-700">
      <div className="relative mb-12">
        <div className="h-32 w-32 bg-emerald-500 rounded-[2.5rem] rotate-12 flex items-center justify-center text-white shadow-2xl shadow-emerald-200">
           <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
           </svg>
        </div>
        <div className="absolute -top-4 -right-4 h-12 w-12 bg-slate-900 rounded-2xl -rotate-12 flex items-center justify-center text-white shadow-xl animate-bounce">
           <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg>
        </div>
      </div>

      <h3 className="text-5xl font-display font-black text-slate-900 uppercase tracking-tighter mb-4">Offer Dispatched</h3>
      <p className="text-slate-400 font-medium max-w-sm italic mb-12">
        Protocol complete. The digital lease offer has been securely delivered to your prospective tenant.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
         <Button 
           variant="primary" 
           fullWidth 
           className="h-16 rounded-[2rem] bg-slate-900 font-black text-sm uppercase tracking-widest shadow-2xl hover:bg-slate-800"
           onClick={() => navigate(ROUTES.DASHBOARD.HOME)}
         >
            Return to Command Center
         </Button>
         <Button 
           variant="outline" 
           fullWidth 
           className="h-16 rounded-[2rem] border-2 border-slate-100 font-black text-sm uppercase tracking-widest hover:bg-slate-50"
           onClick={() => navigate(ROUTES.DASHBOARD.CONTRACTS)}
         >
            View Active Leases
         </Button>
      </div>
    </div>
  );
}
