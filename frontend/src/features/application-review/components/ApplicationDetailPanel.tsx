import { ApplicantInfoCard } from './ApplicantInfoCard';
import { RoomInfoCard } from './RoomInfoCard';
import { ActionSection } from './ActionSection';
import type { LeaseApplication, ApplicationStatus } from '../types';

interface ApplicationDetailPanelProps {
  application: LeaseApplication;
  onAction: (id: string, status: ApplicationStatus) => void;
  isActionLoading: boolean;
}

export function ApplicationDetailPanel({ application, onAction, isActionLoading }: ApplicationDetailPanelPanelProps) {
  return (
    <div className="flex-1 flex flex-col min-h-full">
      <div className="flex-1 p-10 space-y-12 animate-in slide-in-from-right-4 duration-500">
        <header className="space-y-2">
          <span className="text-emerald-600 font-black text-[10px] uppercase tracking-[0.4em]">Review Context</span>
          <h2 className="text-4xl font-display font-black tracking-tighter text-slate-900 uppercase">Vetting Protocol</h2>
          <p className="text-slate-400 font-medium italic text-sm">Please cross-reference all tenant identity data and occupancy history before finalizing the approval.</p>
        </header>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">01. Identity & Profile</h3>
            <span className="h-px bg-slate-100 flex-1 ml-6" />
          </div>
          <ApplicantInfoCard applicant={application.applicant} />
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">02. Asset Allocation</h3>
            <span className="h-px bg-slate-100 flex-1 ml-6" />
          </div>
          <RoomInfoCard 
            propertyName={application.property_name} 
            roomNumber={application.room_number} 
            terms={application.terms} 
          />
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">03. Message & Intent</h3>
            <span className="h-px bg-slate-100 flex-1 ml-6" />
          </div>
          <div className="p-8 rounded-3xl bg-slate-50/50 border border-slate-100 italic font-medium text-slate-600 leading-relaxed shadow-sm">
            "{application.message || 'No personal statement provided by the applicant.'}"
          </div>
        </section>
        
        {/* Spacer for sticky actions */}
        <div className="h-20" />
      </div>

      <ActionSection 
        currentStatus={application.status}
        onApprove={() => onAction(application.id, 'APPROVED')}
        onReject={() => onAction(application.id, 'REJECTED')}
        onRequestRevision={() => onAction(application.id, 'REVISION_REQUESTED')}
        isLoading={isActionLoading}
      />
    </div>
  );
}

// Fixed typo in props interface
type ApplicationDetailPanelPanelProps = ApplicationDetailPanelProps;
