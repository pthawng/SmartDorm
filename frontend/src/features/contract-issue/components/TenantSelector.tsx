import { useState } from 'react';
import { Card, Button, Input } from '@/shared/ui';
import type { SelectionTenant } from '../types';

const MOCK_APPLICANTS: SelectionTenant[] = [
  { id: 'usr-1', full_name: 'Sarah Chen', email: 'sarah.chen@university.edu', avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150' },
  { id: 'usr-2', full_name: 'Marcus Thorne', email: 'm.thorne@design.com', avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150' },
  { id: 'usr-3', full_name: 'Elena Gilbert', email: 'e.gilbert@town.org' },
];

interface TenantSelectorProps {
  onSelect: (tenant: SelectionTenant) => void;
  onBack: () => void;
}

export function TenantSelector({ onSelect, onBack }: TenantSelectorProps) {
  const [search, setSearch] = useState('');
  const [manualEmail, setManualEmail] = useState('');

  const filteredTenants = MOCK_APPLICANTS.filter(t => 
    t.full_name.toLowerCase().includes(search.toLowerCase()) || 
    t.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleManualSelect = () => {
    if (manualEmail.includes('@')) {
       onSelect({ 
         id: `manual-${Date.now()}`, 
         full_name: manualEmail.split('@')[0] || 'Unknown', 
         email: manualEmail 
       });
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <header className="flex items-center justify-between">
        <div>
           <h3 className="text-2xl font-display font-black text-slate-900 uppercase tracking-tighter">Tenant Mapping</h3>
           <p className="text-slate-500 font-medium">Link this lease to an existing applicant or issue a fresh invite via email.</p>
        </div>
        <Button variant="outline" size="sm" onClick={onBack} className="rounded-xl font-bold uppercase tracking-widest text-[10px] px-4">
           Back
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
           <Input 
             placeholder="Search active applicants..." 
             value={search}
             onChange={e => setSearch(e.target.value)}
             className="h-14 rounded-2xl bg-slate-50 border-none shadow-inner"
           />
           
           <div className="space-y-4">
             {filteredTenants.map(tenant => (
               <button 
                 key={tenant.id}
                 onClick={() => onSelect(tenant)}
                 className="w-full text-left group transition-all"
               >
                 <Card className="p-4 border-slate-50 hover:border-emerald-500 hover:shadow-lg transition-all flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center font-black text-slate-300">
                       {tenant.avatar_url ? (
                         <img src={tenant.avatar_url} alt={tenant.full_name} className="h-full w-full object-cover" />
                       ) : (
                         tenant.full_name.charAt(0)
                       )}
                    </div>
                    <div className="flex-1">
                       <p className="text-sm font-black text-slate-900 uppercase tracking-tighter">{tenant.full_name}</p>
                       <p className="text-[10px] font-bold text-slate-400 truncate uppercase mt-0.5">{tenant.email}</p>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-emerald-500">
                       <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z"/></svg>
                    </div>
                 </Card>
               </button>
             ))}
           </div>
        </div>

        <div className="space-y-6">
           <Card className="p-8 border-none bg-slate-900 text-white space-y-6 rounded-[2rem] shadow-2xl shadow-slate-300">
              <header className="space-y-1">
                 <span className="text-emerald-400 font-black text-[9px] uppercase tracking-[0.3em]">Protocol Alpha</span>
                 <h4 className="text-xl font-display font-black uppercase tracking-tighter">Direct Invite</h4>
                 <p className="text-slate-400 text-xs font-medium italic">Issue an offer to a tenant who hasn't applied through the platform yet.</p>
              </header>
              <Input 
                 placeholder="Enter tenant email..." 
                 className="bg-white/10 border-white/20 text-white placeholder:text-slate-500 rounded-xl"
                 value={manualEmail}
                 onChange={e => setManualEmail(e.target.value)}
              />
              <Button 
                variant="primary" 
                fullWidth 
                className="bg-white text-slate-900 hover:bg-emerald-50 h-12 rounded-xl"
                disabled={!manualEmail.includes('@')}
                onClick={handleManualSelect}
              >
                 <span className="font-black text-xs uppercase tracking-widest">Issue Directly</span>
              </Button>
           </Card>
        </div>
      </div>
    </div>
  );
}
