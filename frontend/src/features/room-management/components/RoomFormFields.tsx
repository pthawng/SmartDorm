import { UseFormReturn } from 'react-hook-form';
import { FormField } from '@/shared/form';
import type { RoomFormPayload } from '@/entities/room';
import { StatusSelect } from './StatusSelect';
import { PriceInput } from './PriceInput';
import { ImageUpload } from './ImageUpload';
import { Select } from '@/shared/ui';

interface RoomFormFieldsProps {
  form: UseFormReturn<RoomFormPayload>;
}

// In a real app we'd fetch properties from API
const MOCK_PROPERTIES = [
  { label: 'The Modern Loft', value: 'p-1' },
  { label: 'Sunrise Villas', value: 'p-2' },
  { label: 'Green Bay Residency', value: 'p-3' },
];

export function RoomFormFields({ form }: RoomFormFieldsProps) {
  const { register, formState: { errors } } = form;

  return (
    <div className="space-y-10">
      {/* Group 1: Basic Information */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-4 w-1 rounded-full bg-primary-500" />
          <h2 className="text-base font-semibold text-slate-900">Basic Information</h2>
        </div>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <FormField 
            form={form} 
            name="room_number" 
            label="Room Number" 
            placeholder="e.g. 101, A-01" 
            required 
          />
          
          <Select
            label="Property"
            options={[{ label: 'Select Property', value: '' }, ...MOCK_PROPERTIES]}
            required
            error={errors.property_id?.message}
            {...register('property_id')}
          />
        </div>
      </section>

      {/* Group 2: Pricing & Specifications */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-4 w-1 rounded-full bg-emerald-500" />
          <h2 className="text-base font-semibold text-slate-900">Pricing & Specifications</h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <FormField 
            form={form} 
            name="floor" 
            label="Floor" 
            type="number" 
            required 
          />
          <FormField 
            form={form} 
            name="area_sqm" 
            label="Area (m²)" 
            type="number" 
            required 
          />
          <PriceInput form={form} />
        </div>
      </section>

      {/* Group 3: Status & Media */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-4 w-1 rounded-full bg-amber-500" />
          <h2 className="text-base font-semibold text-slate-900">Status & Media</h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <StatusSelect form={form} />
        </div>

        <FormField 
          form={form} 
          name="description" 
          label="Description (Optional)" 
          type="textarea"
          placeholder="Add any extra details about this room (furnishings, views, etc.)..." 
        />

        <div className="pt-2">
          <ImageUpload form={form} />
        </div>
      </section>
    </div>
  );
}
