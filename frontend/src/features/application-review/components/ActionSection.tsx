import { Button } from '@/shared/ui';
import { cn } from '@/shared/utils';

import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/shared/config/routes';

interface ActionSectionProps {
  onApprove: () => void;
  onReject: () => void;
  onRequestRevision: () => void;
  isLoading: boolean;
  currentStatus: string;
}

export function ActionSection({ onApprove, onReject, onRequestRevision, isLoading, currentStatus }: ActionSectionProps) {
  const navigate = useNavigate();
  const isPending = currentStatus === 'PENDING';
  const isApproved = currentStatus === 'APPROVED';

  if (isApproved) {
    return (
      <div className="flex flex-col sm:flex-row gap-4 p-8 border-t-2 border-emerald-500 bg-emerald-50/30 backdrop-blur-md sticky bottom-0 z-20 animate-in slide-in-from-bottom-4 duration-500">
        <div className="flex-1 space-y-1">
           <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600">Protocol Success</h4>
           <p className="text-xs font-bold text-slate-500 italic">This application has been verified. You can now proceed to issue the legal contract.</p>
        </div>
        <Button 
          variant="primary" 
          className="h-14 px-12 rounded-2xl bg-slate-900 hover:bg-slate-800 shadow-2xl font-black text-sm uppercase tracking-widest"
          onClick={() => navigate(`${ROUTES.DASHBOARD.CONTRACTS}/issue?applicationId=current`)}
        >
          Issue Contract
        </Button>
      </div>
    );
  }

  return (
    <div className={cn(
      "flex flex-col sm:flex-row gap-4 p-8 border-t-2 border-slate-900 bg-white/50 backdrop-blur-md sticky bottom-0 z-20",
      !isPending && "opacity-50 pointer-events-none grayscale-[0.5]"
    )}>
      <Button 
        variant="primary" 
        className="flex-1 h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-200 active:scale-[0.98]" 
        onClick={onApprove}
        isLoading={isLoading}
      >
        <div className="flex items-center justify-center gap-2">
           <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
           <span className="font-black text-sm uppercase tracking-widest">Approve Application</span>
        </div>
      </Button>

      <Button 
        variant="outline" 
        className="flex-1 h-14 rounded-2xl border-2 border-slate-200 hover:bg-slate-50 active:scale-[0.98]" 
        onClick={onRequestRevision}
        disabled={isLoading}
      >
        <span className="font-black text-sm uppercase tracking-widest text-slate-500">Request Revision</span>
      </Button>

      <Button 
        variant="outline" 
        className="h-14 px-8 rounded-2xl border-2 border-rose-100 bg-rose-50/50 hover:bg-rose-50 text-rose-600 hover:border-rose-200 active:scale-[0.98]" 
        onClick={onReject}
        disabled={isLoading}
      >
        <span className="font-black text-sm uppercase tracking-widest">Reject</span>
      </Button>
    </div>
  );
}
