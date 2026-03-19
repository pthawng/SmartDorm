import { UseFormReturn } from 'react-hook-form';
import { FormField, Select } from '@/shared/form';
import { Card } from '@/shared/ui';
import type { ContractSignFlowPayload } from '../types';

interface StepProps {
  form: UseFormReturn<ContractSignFlowPayload>;
}

// Mock rooms for selection
const MOCK_ROOMS = [
  { label: 'Room 101 (Available)', value: 'room-101' },
  { label: 'Room 102 (Available)', value: 'room-102' },
  { label: 'Room 205 (Available)', value: 'room-205' },
];

export function ContractFormStep({ form }: StepProps) {
  const { register, formState: { errors } } = form;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="p-6 space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Select
            label="Target Room"
            options={[{ label: 'Select a room', value: '' }, ...MOCK_ROOMS]}
            required
            error={errors.room_id?.message}
            {...register('room_id')}
          />
          
          <FormField
            form={form}
            name="monthly_rent"
            label="Monthly Rent (VND)"
            type="number"
            required
            placeholder="e.g. 5000000"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <FormField
            form={form}
            name="start_date"
            label="Lease Start Date"
            type="date"
            required
          />
          
          <FormField
            form={form}
            name="end_date"
            label="Lease End Date"
            type="date"
            required
          />
        </div>

        <FormField
          form={form}
          name="deposit_amount"
          label="Security Deposit (VND)"
          type="number"
          required
          placeholder="e.g. 10000000"
        />

        <FormField
          form={form}
          name="terms_notes"
          label="Special Terms or Notes (Optional)"
          type="textarea"
          placeholder="Add any specific agreements or room condition notes..."
        />
      </Card>
    </div>
  );
}
