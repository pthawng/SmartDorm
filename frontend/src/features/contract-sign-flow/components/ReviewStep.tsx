import { UseFormReturn } from 'react-hook-form';
import { Card, Badge } from '@/shared/ui';
import type { ContractSignFlowPayload } from '../types';

interface StepProps {
  form: UseFormReturn<ContractSignFlowPayload>;
}

const vndFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
});

export function ReviewStep({ form }: StepProps) {
  const values = form.getValues();

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Contract Summary */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 text-slate-900">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <span className="text-lg">📄</span>
            </div>
            <h3 className="text-sm font-black uppercase tracking-widest">Lease Terms</h3>
          </div>
          
          <Card className="p-0 overflow-hidden border-slate-200 shadow-sm">
            <div className="bg-slate-50/50 p-6 border-b border-slate-100 italic text-slate-500 text-sm">
              Standard residential lease agreement for high-occupancy dormitories.
            </div>
            <div className="p-6 space-y-5">
              <div className="flex justify-between items-center group">
                <span className="text-slate-400 text-sm font-medium group-hover:text-slate-600 transition-colors">Target Inventory</span>
                <Badge variant="info" className="font-black px-3 py-1 text-xs">ROOM {values.room_id.split('-').pop()?.toUpperCase()}</Badge>
              </div>
              
              <div className="flex justify-between items-center border-t border-slate-50 pt-4">
                <span className="text-slate-400 text-sm font-medium">Monthly Rent</span>
                <span className="font-black text-xl text-emerald-600 tabular-nums tracking-tight">
                  {vndFormatter.format(values.monthly_rent)}
                </span>
              </div>

              <div className="flex justify-between items-center border-t border-slate-50 pt-4">
                <span className="text-slate-400 text-sm font-medium">Security Deposit</span>
                <span className="font-bold text-slate-800 tabular-nums">
                  {vndFormatter.format(values.deposit_amount)}
                </span>
              </div>

              <div className="border-t border-slate-50 pt-4">
                <span className="text-[10px] text-slate-400 block mb-2 uppercase font-black tracking-widest">Active Lease Period</span>
                <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="flex-1 text-center">
                    <span className="block text-[9px] uppercase font-bold text-slate-400 mb-1">From</span>
                    <span className="font-bold text-slate-900">{values.start_date}</span>
                  </div>
                  <div className="h-6 w-px bg-slate-200" />
                  <div className="flex-1 text-center">
                    <span className="block text-[9px] uppercase font-bold text-slate-400 mb-1">To</span>
                    <span className="font-bold text-slate-900">{values.end_date}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Tenant Summary */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 text-slate-900">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-lg">👤</span>
            </div>
            <h3 className="text-sm font-black uppercase tracking-widest">Tenant ID Profile</h3>
          </div>

          <Card className="p-6 space-y-6 border-slate-200 shadow-sm">
            <div>
              <span className="text-[10px] text-slate-400 block mb-1.5 uppercase font-black tracking-widest">Primary Identity</span>
              <p className="font-black text-slate-900 text-2xl tracking-tight uppercase">{values.full_name}</p>
            </div>

            <div className="grid grid-cols-2 gap-10">
              <div>
                <span className="text-[10px] text-slate-400 block mb-1 uppercase font-bold tracking-wider">Verified Phone</span>
                <p className="font-bold text-slate-800 text-sm hover:text-primary-600 transition-colors">{values.phone}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block mb-1 uppercase font-bold tracking-wider">Document ID</span>
                <p className="font-mono font-bold text-slate-800 text-sm bg-slate-100 px-2 py-0.5 rounded leading-none inline-block">
                  {values.id_number}
                </p>
              </div>
            </div>

            {values.email && (
              <div className="border-t border-slate-50 pt-4">
                <span className="text-[10px] text-slate-400 block mb-1 uppercase font-bold tracking-wider">Digital Correspondence</span>
                <p className="font-medium text-slate-700 underline decoration-slate-200 underline-offset-4">{values.email}</p>
              </div>
            )}

            <div className="border-t border-slate-50 pt-4 bg-slate-50/50 -mx-6 -mb-6 px-6 pb-6 mt-6">
               <span className="text-[10px] text-slate-400 block mb-2 uppercase font-bold tracking-wider">Emergency Protocol</span>
               <div className="flex justify-between items-center text-xs">
                 <span className="font-bold text-slate-700">{values.emergency_contact_name || 'Not provided'}</span>
                 <span className="text-slate-500 italic">{values.emergency_contact_phone || 'No phone'}</span>
               </div>
            </div>
          </Card>
        </section>
      </div>

      <div className="group p-5 rounded-2xl bg-primary-50 border border-primary-100 text-primary-900 text-sm flex items-start gap-4 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="h-6 w-6 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold shrink-0 shadow-sm group-hover:scale-110 transition-transform">!</div>
        <p className="leading-relaxed font-medium">
          By proceeding with "Submit & Sign", you are authorizing the generation of a legally binding digital lease. 
          Please ensure all financial values and tenant identity markers have been cross-verified.
        </p>
      </div>
    </div>
  );
}
