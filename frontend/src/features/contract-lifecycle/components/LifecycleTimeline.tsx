import { Timeline, TimelineItem } from '@/shared/ui/Timeline';
import { ContractStatus } from '@/entities/contract';
import { cn } from '@/shared/utils';

const STEPS = [
  { id: 'ISSUE', status: [ContractStatus.DRAFT], title: 'Issuance', desc: 'Hồ sơ đang soạn thảo' },
  { id: 'SIGN', status: [ContractStatus.PENDING_SIGNATURE], title: 'Signature', desc: 'Ký xác nhận điện tử' },
  { id: 'DEPOSIT', status: [ContractStatus.SIGNED], title: 'Deposit', desc: 'Thanh toán cọc' },
  { id: 'ACTIVATE', status: [ContractStatus.DEPOSIT_PAID, ContractStatus.ACTIVE], title: 'Activation', desc: 'Kích hoạt nơi ở' },
];

export function LifecycleTimeline({ currentStatus, className }: { currentStatus: ContractStatus, className?: string }) {
  const currentStepIndex = STEPS.findIndex(s => s.status.includes(currentStatus));

  const items: TimelineItem[] = STEPS.map((step, idx) => {
    let status: TimelineItem['status'] = 'PENDING';
    if (idx < currentStepIndex) status = 'COMPLETED';
    else if (idx === currentStepIndex) status = 'CURRENT';

    return {
      id: step.id,
      title: step.title,
      description: step.desc,
      status
    };
  });

  return (
    <div className={cn("p-10 bg-white rounded-[2.5rem] border border-slate-50 shadow-sm", className)}>
       <header className="mb-12 flex items-center justify-between">
          <div className="space-y-1">
             <h3 className="text-xl font-display font-black text-slate-900 uppercase tracking-tighter">Lease Progression</h3>
             <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Lifecycle Protocol 04-A</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
       </header>
       <Timeline items={items} orientation="horizontal" />
    </div>
  );
}
