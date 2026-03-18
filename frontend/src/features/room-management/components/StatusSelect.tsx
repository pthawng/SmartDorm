import { Select } from '@/shared/ui';
import { UseFormReturn } from 'react-hook-form';
import { RoomStatus } from '@/entities/room';
import type { RoomFormPayload } from '@/entities/room';

interface StatusSelectProps {
  form: UseFormReturn<RoomFormPayload>;
}

const OPTIONS = [
  { label: 'Available', value: RoomStatus.AVAILABLE },
  { label: 'Occupied', value: RoomStatus.OCCUPIED },
  { label: 'Maintenance', value: RoomStatus.MAINTENANCE },
];

export function StatusSelect({ form }: StatusSelectProps) {
  const { register, formState: { errors } } = form;
  const errorMessage = errors.status?.message;

  return (
    <Select
      label="Room Status"
      options={OPTIONS}
      required
      error={errorMessage}
      {...register('status')}
    />
  );
}
