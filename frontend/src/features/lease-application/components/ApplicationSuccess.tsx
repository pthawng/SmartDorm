import { Button, Card } from '@/shared/ui';
import { LeaseApplication } from '@/entities/application/types';

interface ApplicationSuccessProps {
  application: LeaseApplication;
  onDashboard: () => void;
}

export function ApplicationSuccess({ application, onDashboard }: ApplicationSuccessProps) {
  return (
    <div className="max-w-md mx-auto py-12 px-4 text-center space-y-10 animate-in zoom-in duration-500">
      <div className="relative inline-block">
        <div className="absolute inset-0 bg-primary-100 rounded-full animate-ping opacity-25" />
        <div className="relative h-24 w-24 bg-primary-600 rounded-full flex items-center justify-center text-white shadow-2xl shadow-primary-200">
           <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
           </svg>
        </div>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Submitted!</h2>
        <p className="text-slate-500 font-medium leading-relaxed">
          Your lease application for <span className="font-bold text-slate-900">Room {application.room_id}</span> has been successfully queued for review.
        </p>
      </div>

      <Card className="p-8 bg-slate-50 border-slate-200 space-y-6 relative overflow-hidden">
         <div className="absolute top-0 right-0 p-2">
            <span className="text-[8px] font-black uppercase tracking-widest text-slate-300 opacity-50 select-none">Auth: SmartDorm</span>
         </div>

         <div className="space-y-4">
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
               <span>Reference ID</span>
               <span className="text-emerald-600 font-black">{application.id.toUpperCase()}</span>
            </div>
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
               <span>Status</span>
               <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-black">Under Review</span>
            </div>
         </div>

         <div className="pt-4 border-t border-slate-200 space-y-4">
            <p className="text-xs text-slate-500 font-medium italic">
              "We'll notify you via email and dashboard notification as soon as the manager makes a decision."
            </p>
            <Button variant="primary" fullWidth size="lg" onClick={onDashboard}>
               Return to Guest Portal
            </Button>
         </div>
      </Card>
    </div>
  );
}
