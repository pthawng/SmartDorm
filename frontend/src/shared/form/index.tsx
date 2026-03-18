/**
 * Form abstraction — unified React Hook Form + Zod integration.
 * Uses shared/ui design system components (Input, Textarea, Select, Button).
 *
 * Usage:
 *   const form = useAppForm(roomSchema, { defaultValues: { ... } });
 *   <FormField form={form} name="room_number" label="Room Number" />
 */

import {
  useForm,
  type UseFormReturn,
  type UseFormProps,
  type FieldValues,
  type Path,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ZodSchema } from 'zod';
import { Input, Textarea } from '@/shared/ui/Input';

/**
 * Typed wrapper around useForm with automatic Zod resolver.
 */
export function useAppForm<T extends FieldValues>(
  schema: ZodSchema<T>,
  options?: Omit<UseFormProps<T>, 'resolver'>,
): UseFormReturn<T> {
  return useForm<T>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    ...options,
  });
}

// ── Reusable Form Field ───────────────────────────────────────

interface FormFieldProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'textarea';
  placeholder?: string;
  required?: boolean;
}

/**
 * Render a typed form field backed by a design system Input or Textarea.
 * Error messages are passed directly — no custom error rendering needed.
 */
export function FormField<T extends FieldValues>({
  form,
  name,
  label,
  type = 'text',
  placeholder,
  required = false,
}: FormFieldProps<T>) {
  const { register, formState: { errors } } = form;
  const errorMessage = errors[name]?.message as string | undefined;

  if (type === 'textarea') {
    return (
      <Textarea
        label={label}
        placeholder={placeholder}
        required={required}
        error={errorMessage}
        rows={3}
        {...register(name)}
      />
    );
  }

  return (
    <Input
      type={type}
      label={label}
      placeholder={placeholder}
      required={required}
      error={errorMessage}
      {...register(name, { valueAsNumber: type === 'number' })}
    />
  );
}

// ── Re-exports for convenience inside feature forms ───────────
export { Button } from '@/shared/ui/Button';
export { Input, Textarea } from '@/shared/ui/Input';
export { Select } from '@/shared/ui/Select';
