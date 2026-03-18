import { useState, useEffect } from 'react';
import { Modal, Button, Input } from '@/shared/ui';
import type { RoomFormValues } from '../types';

interface RoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: RoomFormValues) => void;
  isSubmitting?: boolean;
  defaultValues?: Partial<RoomFormValues>;
  mode?: 'create' | 'edit';
}

const EMPTY: RoomFormValues = { roomNumber: '', propertyId: '', floor: 1, area: 20, monthlyPrice: 0 };

export function RoomModal({
  isOpen, onClose, onSubmit, isSubmitting, defaultValues, mode = 'create',
}: RoomModalProps) {
  const [values, setValues] = useState<RoomFormValues>({ ...EMPTY, ...defaultValues });

  // Reset form state when modal opens with new values
  useEffect(() => {
    if (isOpen) {
      setValues({ ...EMPTY, ...defaultValues });
    }
  }, [isOpen, defaultValues]);

  const setField = <K extends keyof RoomFormValues>(key: K, val: RoomFormValues[K]) =>
    setValues(v => ({ ...v, [key]: val }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!values.roomNumber) return;
    onSubmit(values);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Add Room' : 'Edit Room'}
      description={mode === 'create' ? 'Fill in room details.' : 'Update room information.'}
      size="md"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit as any} disabled={isSubmitting || !values.roomNumber}>
            {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Room' : 'Save Changes'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Room Number <span className="text-red-500">*</span>
          </label>
          <Input placeholder="e.g. 201" value={values.roomNumber} onChange={e => setField('roomNumber', e.target.value)} required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Floor</label>
            <Input type="number" min={1} value={values.floor} onChange={e => setField('floor', Number(e.target.value))} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Area (m²)</label>
            <Input type="number" min={1} value={values.area} onChange={e => setField('area', Number(e.target.value))} />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Monthly Price (VND)</label>
          <Input type="number" min={0} step={100000} value={values.monthlyPrice} onChange={e => setField('monthlyPrice', Number(e.target.value))} />
        </div>
      </form>
    </Modal>
  );
}
