import { Card } from '@/shared/ui';

interface RenterInfoProps {
  fullName: string;
  phone: string;
  idNumber: string;
  email?: string;
  onEdit?: () => void;
}

export function RenterInfo({ fullName, phone, idNumber, email, onEdit }: RenterInfoProps) {
  return (
    <Card className="p-6 space-y-6 border-slate-200 bg-slate-50/20 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-xl text-blue-700">
             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
             </svg>
          </div>
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Tenant Identity Profile</h3>
        </div>
        {onEdit && (
          <button 
            onClick={onEdit}
            className="text-[10px] font-black text-primary-600 hover:text-primary-700 uppercase tracking-widest border-b border-primary-200"
          >
            Edit
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
           <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Legal Full Name</span>
              <p className="text-xl font-black text-slate-900 uppercase tracking-tight">{fullName}</p>
           </div>
           <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Digital Mail</span>
              <p className="font-bold text-slate-700 underline underline-offset-4 decoration-slate-200">{email || 'N/A'}</p>
           </div>
        </div>

        <div className="space-y-4">
           <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Verified Contact</span>
              <p className="font-bold text-slate-800">{phone}</p>
           </div>
           <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Goverment ID</span>
              <p className="font-mono font-bold text-slate-900 bg-white border border-slate-200 px-3 py-1 rounded inline-block shadow-sm">
                {idNumber}
              </p>
           </div>
        </div>
      </div>
    </Card>
  );
}
