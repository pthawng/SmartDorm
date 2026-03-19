import { UseFormReturn } from 'react-hook-form';
import { FormField } from '@/shared/form';
import { Card } from '@/shared/ui';
import type { ContractSignFlowPayload } from '../types';

interface StepProps {
  form: UseFormReturn<ContractSignFlowPayload>;
}

export function RenterInfoStep({ form }: StepProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 outline-none">
      <Card className="p-6 space-y-6">
        <FormField
          form={form}
          name="full_name"
          label="Tenant Full Name"
          required
          placeholder="As shown on ID card"
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <FormField
            form={form}
            name="phone"
            label="Phone Number"
            required
            placeholder="e.g. 0912345678"
          />
          
          <FormField
            form={form}
            name="email"
            label="Email Address (Optional)"
            type="email"
            placeholder="tenant@example.com"
          />
        </div>

        <FormField
          form={form}
          name="id_number"
          label="National ID / Passport Number"
          required
          placeholder="e.g. 0123456789"
        />

        <FormField
          form={form}
          name="date_of_birth"
          label="Date of Birth (Optional)"
          type="date"
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <FormField
            form={form}
            name="emergency_contact_name"
            label="Emergency Contact Name"
            placeholder="Relative or friend"
          />
          
          <FormField
            form={form}
            name="emergency_contact_phone"
            label="Emergency Contact Phone"
            placeholder="e.g. 0987654321"
          />
        </div>
      </Card>
    </div>
  );
}
