import { type UseFormReturn } from 'react-hook-form';
import { LandlordRegistrationPayload } from '@/entities/landlord/model/landlord.schema';
import { Badge } from '@/shared/ui/Badge';

interface StepProps {
  form: UseFormReturn<LandlordRegistrationPayload>;
}

export function ReviewStep({ form }: StepProps) {
  const values = form.getValues();

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold text-slate-900">Review your application</h3>
        <p className="text-slate-500 text-sm">Please verify all details before finalizing your registration.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Basic Info Summary */}
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Personal & Contact</label>
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
             <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Name</span>
                <span className="font-bold text-slate-900">{values.fullName}</span>
             </div>
             <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Phone</span>
                <span className="font-bold text-slate-900">{values.phoneNumber}</span>
             </div>
          </div>
        </div>

        {/* Property Summary */}
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Property Details</label>
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
             <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Brand</span>
                <span className="font-bold text-slate-900">{values.propertyName}</span>
             </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Rooms</span>
                <Badge variant="info" className="rounded-lg">{values.numberOfRooms}</Badge>
              </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Amenities & Pricing</label>
        <div className="p-5 rounded-2xl bg-sky-50/50 border border-sky-100 flex flex-wrap gap-2">
           {values.amenities.map((a: string) => (
             <Badge key={a} variant="info" className="rounded-lg">
                {a.charAt(0).toUpperCase() + a.slice(1)}
             </Badge>
           ))}
           <div className="w-full mt-4 pt-4 border-t border-primary-100 flex justify-between items-center">
              <span className="text-slate-500 text-sm">Base Price</span>
              <span className="text-xl font-black text-primary-700">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(values.pricePerMonth)}
              </span>
           </div>
        </div>
      </div>

      {/* Terms Confirmation */}
      <div className="pt-4">
        <label className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-white transition-all group">
          <input 
            type="checkbox" 
            className="mt-1 h-5 w-5 rounded-lg border-slate-300 text-primary-600 focus:ring-primary-500"
            {...form.register('agreedToTerms')}
          />
          <div className="flex-1">
            <span className="text-sm font-bold text-slate-900 group-hover:text-primary-700 transition-colors">I agree to the SmartDorm Landlord Policy</span>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">By registering, you confirm that you own or are authorized to manage the property mentioned above.</p>
          </div>
        </label>
        {form.formState.errors.agreedToTerms && (
          <p className="mt-2 text-xs text-rose-500 font-medium">{form.formState.errors.agreedToTerms.message}</p>
        )}
      </div>
    </div>
  );
}
