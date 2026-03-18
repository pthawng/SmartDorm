import { Input } from '@/shared/ui';
import { UseFormReturn } from 'react-hook-form';
import type { RoomFormPayload } from '@/entities/room';

interface PriceInputProps {
  form: UseFormReturn<RoomFormPayload>;
}

export function PriceInput({ form }: PriceInputProps) {
  const { register, formState: { errors } } = form;
  const errorMessage = errors.monthly_price?.message;

  return (
    <div className="relative">
      <Input
        label="Monthly Price (VND)"
        type="number"
        placeholder="0"
        required
        error={errorMessage}
        className="pr-12"
        {...register('monthly_price', { valueAsNumber: true })}
      />
      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center pt-6 text-sm font-medium text-slate-400">
        ₫
      </div>
    </div>
  );
}
