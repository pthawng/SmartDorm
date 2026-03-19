import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLeaseApplication } from '../hooks/useLeaseApplication';
import { ApplicationForm } from './ApplicationForm';
import { ApplicationSuccess } from './ApplicationSuccess';
import { ErrorState } from '@/shared/ui';
import { ROUTES } from '@/shared/config/routes';

export function LeaseApplicationFeature() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const roomId = searchParams.get('room_id') || '';
  
  const { apply, isSubmitting, isSuccess, application, error } = useLeaseApplication();

  const handleDashboard = () => {
    navigate(ROUTES.DASHBOARD.TENANT_HOME);
  };

  if (!roomId) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4">
        <ErrorState 
           title="Invalid Application Request" 
           description="We couldn't detect which room you're applying for. Please return to the room detail page and try again."
        />
      </div>
    );
  }

  if (isSuccess && application) {
    return (
      <div className="py-10">
        <ApplicationSuccess application={application} onDashboard={handleDashboard} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <span className="text-primary-600 font-black text-[10px] uppercase tracking-[0.4em]">Lifecycle Phase 01</span>
          <h1 className="text-5xl font-display font-black tracking-tighter text-slate-900 uppercase">Start your stay</h1>
          <p className="text-slate-500 font-medium max-w-lg">
            Submit your profile and stay preferences. Once approved, we'll generate your digital lease for signature.
          </p>
        </div>
        
        <div className="hidden lg:flex items-center gap-10">
           <div className="text-center">
              <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest mb-1">Step 01</p>
              <p className="font-black text-slate-900 text-xs uppercase underline underline-offset-8 decoration-2 decoration-primary-500">Apply</p>
           </div>
           <div className="text-center opacity-30">
              <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest mb-1">Step 02</p>
              <p className="font-black text-slate-900 text-xs uppercase">Review</p>
           </div>
           <div className="text-center opacity-30">
              <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest mb-1">Step 03</p>
              <p className="font-black text-slate-900 text-xs uppercase">Sign</p>
           </div>
        </div>
      </header>

      {error && (
        <ErrorState 
          title="Submission Failed" 
          description="We encountered a temporary issue while processing your application. Your data remains safe, please try again." 
        />
      )}

      <ApplicationForm 
        roomId={roomId} 
        onSubmit={apply} 
        isSubmitting={isSubmitting} 
      />
    </div>
  );
}
