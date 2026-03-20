import { type UseFormReturn } from 'react-hook-form';
import { FormField } from '@/shared/form';
import { LandlordRegistrationPayload } from '@/entities/landlord/model/landlord.schema';

interface StepProps {
  form: UseFormReturn<LandlordRegistrationPayload>;
}

export function PropertyInfoStep({ form }: StepProps) {
  return (
    <div className="space-y-8">
      <div className="mb-4">
        <h3 className="text-2xl font-bold text-slate-900">Tell us about your property</h3>
        <p className="text-slate-500 text-sm">Where are your rooms located and what's your brand?</p>
      </div>

      <FormField
        form={form}
        name="propertyName"
        label="Property Name / Business Name"
        placeholder="e.g. Sunny House, SmartDorm Hanoi"
        required
      />

      <FormField
        form={form}
        name="address"
        label="Full Address"
        placeholder="123 Tran Duy Hung, Cau Giay, Hanoi"
        required
      />

      <FormField
        form={form}
        name="numberOfRooms"
        label="Number of Rooms"
        type="number"
        placeholder="1"
        required
      />
    </div>
  );
}
