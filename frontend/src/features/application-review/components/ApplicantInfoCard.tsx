import { Card, Badge } from '@/shared/ui';
import type { ApplicantInfo } from '../types';

interface ApplicantInfoCardProps {
  applicant: ApplicantInfo;
}

export function ApplicantInfoCard({ applicant }: ApplicantInfoCardProps) {
  return (
    <Card className="p-8 border-none bg-slate-50/50 shadow-sm relative overflow-hidden group hover:bg-slate-50 transition-colors">
      <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
        {/* Avatar / Initials */}
        <div className="shrink-0">
          {applicant.avatar_url ? (
            <div className="h-20 w-20 rounded-2xl overflow-hidden shadow-xl ring-4 ring-white">
              <img src={applicant.avatar_url} alt={applicant.full_name} className="h-full w-full object-cover" />
            </div>
          ) : (
            <div className="h-20 w-20 rounded-2xl bg-white shadow-lg flex items-center justify-center text-2xl font-black text-slate-300 ring-4 ring-white uppercase">
              {applicant.full_name.charAt(0)}
            </div>
          )}
        </div>

        {/* Info Grid */}
        <div className="flex-1 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-2xl font-display font-black text-slate-900 uppercase tracking-tighter">{applicant.full_name}</h3>
                {applicant.verification_status === 'VERIFIED' && (
                  <div className="h-5 w-5 bg-emerald-500 rounded-full flex items-center justify-center text-white p-1 shadow-sm">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </div>
                )}
              </div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{applicant.occupation}</p>
            </div>
            
            <Badge variant="outline" className="rounded-full px-3 py-1 bg-white border-slate-200 text-slate-400 font-bold text-[10px] uppercase tracking-widest h-fit">
              ID: {applicant.id_number}
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-12 pt-6 border-t border-slate-100">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Primary Contact</span>
              <p className="text-sm font-bold text-slate-700">{applicant.email}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Phone Number</span>
              <p className="text-sm font-bold text-slate-700">{applicant.phone}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative Vetting Indicator */}
      <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none group-hover:opacity-[0.05] transition-opacity">
         <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>
      </div>
    </Card>
  );
}
