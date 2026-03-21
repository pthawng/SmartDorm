import { type UseFormReturn } from 'react-hook-form';
import { FormField } from '@/shared/form';
import { LandlordRegistrationPayload } from '@/entities/landlord/model/landlord.schema';

interface StepProps {
  form: UseFormReturn<LandlordRegistrationPayload>;
}

export function ActivateLandlordStep({ form }: StepProps) {
  return (
    <div className="space-y-8">
      <div className="mb-4">
        <h3 className="text-2xl font-bold text-slate-900">Activate your Landlord account</h3>
        <p className="text-slate-500 text-sm">Just name your workspace and verify your email to get started.</p>
      </div>

      <FormField
        form={form}
        name="propertyName"
        label="Workspace Name / Business Name"
        placeholder="e.g. Sunny House, SmartDorm Hanoi"
        required
      />

      <FormField
        form={form}
        name="email"
        label="Business Email Address"
        type="email"
        placeholder="john@example.com"
        required
      />
      
      <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100">
        <p className="text-xs text-sky-700 leading-relaxed italic">
          Tip: You can set up your properties, address details, and room pricing in the dashboard after activation.
        </p>
      </div>
    </div>
  );
}
