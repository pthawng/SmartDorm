import { type UseFormReturn } from 'react-hook-form';
import { FormField } from '@/shared/form';
import { LandlordRegistrationPayload } from '@/entities/landlord/model/landlord.schema';
import { Wifi, Wind, Coffee, Zap, Car, Shield } from 'lucide-react';

interface StepProps {
  form: UseFormReturn<LandlordRegistrationPayload>;
}

const AMENITIES = [
  { id: 'wifi', label: 'High-speed WiFi', icon: <Wifi className="w-4 h-4" /> },
  { id: 'ac', label: 'Air Conditioning', icon: <Wind className="w-4 h-4" /> },
  { id: 'parking', label: 'Parking Space', icon: <Car className="w-4 h-4" /> },
  { id: 'security', label: '24/7 Security', icon: <Shield className="w-4 h-4" /> },
  { id: 'kitchen', label: 'Shared Kitchen', icon: <Coffee className="w-4 h-4" /> },
  { id: 'power', label: 'Backup Power', icon: <Zap className="w-4 h-4" /> },
];

export function PricingStep({ form }: StepProps) {
  const selectedAmenities = form.watch('amenities') || [];

  const toggleAmenity = (id: string) => {
    const next = selectedAmenities.includes(id)
      ? selectedAmenities.filter(a => a !== id)
      : [...selectedAmenities, id];
    form.setValue('amenities', next, { shouldValidate: true });
  };

  return (
    <div className="space-y-10">
      <div>
        <h3 className="text-2xl font-bold text-slate-900">Amenities & Pricing</h3>
        <p className="text-slate-500 text-sm">What makes your place special?</p>
      </div>

      <div className="space-y-4">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Select Amenities</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {AMENITIES.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => toggleAmenity(item.id)}
              className={`flex items-center gap-3 p-4 rounded-2xl border transition-all text-left ${
                selectedAmenities.includes(item.id)
                  ? 'bg-primary-50 border-primary-200 text-primary-700 shadow-sm shadow-primary-100/50'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <div className={selectedAmenities.includes(item.id) ? 'text-primary-600' : 'text-slate-400'}>
                {item.icon}
              </div>
              <span className="text-xs font-bold leading-tight">{item.label}</span>
            </button>
          ))}
        </div>
        {form.formState.errors.amenities && (
          <p className="text-[0.8rem] font-medium text-destructive mt-2">{form.formState.errors.amenities.message}</p>
        )}
      </div>

      <FormField
        form={form}
        name="pricePerMonth"
        label="Default Price per Month (VND)"
        type="number"
        placeholder="e.g. 3000000"
        required
      />
    </div>
  );
}
