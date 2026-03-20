import { type UseFormReturn } from 'react-hook-form';
import { FormField } from '@/shared/form';
import { LandlordRegistrationPayload } from '@/entities/landlord/model/landlord.schema';

interface StepProps {
  form: UseFormReturn<LandlordRegistrationPayload>;
}

export function BasicInfoStep({ form }: StepProps) {
  return (
    <div className="space-y-8">
      <div className="mb-4">
        <h3 className="text-2xl font-bold text-slate-900">Let's start with basics</h3>
        <p className="text-slate-500 text-sm">Verify your contact information for potential tenants.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <FormField
          form={form}
          name="fullName"
          label="Full Name"
          placeholder="e.g. John Doe"
          required
        />

        <FormField
          form={form}
          name="email"
          label="Email Address"
          type="email"
          placeholder="john@example.com"
          required
        />
      </div>

      <FormField
        form={form}
        name="phoneNumber"
        label="Phone Number"
        placeholder="0912345678"
        required
      />
    </div>
  );
}
