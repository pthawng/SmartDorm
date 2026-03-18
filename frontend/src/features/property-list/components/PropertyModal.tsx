import { useState, useEffect } from 'react';
import { Modal, Button, Input } from '@/shared/ui';
import type { PropertyFormValues } from '../types';

interface PropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: PropertyFormValues) => void;
  isSubmitting?: boolean;
  defaultValues?: PropertyFormValues;
  mode?: 'create' | 'edit';
}

const EMPTY: PropertyFormValues = { name: '', address: '', city: '' };

export function PropertyModal({
  isOpen, onClose, onSubmit, isSubmitting, defaultValues, mode = 'create',
}: PropertyModalProps) {
  const [values, setValues] = useState<PropertyFormValues>(defaultValues ?? EMPTY);

  // Reset form state when modal opens with new values
  useEffect(() => {
    if (isOpen) {
      setValues(defaultValues ?? EMPTY);
    }
  }, [isOpen, defaultValues]);

  const set = (field: keyof PropertyFormValues) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setValues(v => ({ ...v, [field]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!values.name || !values.city) return;
    onSubmit(values);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Add Property' : 'Edit Property'}
      description={mode === 'create' ? 'Fill in details for your new property portfolio.' : 'Update the property details below.'}
      size="md"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit as any} disabled={isSubmitting || !values.name || !values.city}>
            {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Property' : 'Save Changes'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Property Name <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="e.g. The Modern Loft"
            value={values.name}
            onChange={set('name')}
            required
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            City <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="e.g. Ho Chi Minh"
            value={values.city}
            onChange={set('city')}
            required
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Address</label>
          <Input
            placeholder="Street address"
            value={values.address}
            onChange={set('address')}
          />
        </div>
      </form>
    </Modal>
  );
}
