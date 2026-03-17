/**
 * Form abstraction — unified React Hook Form + Zod integration.
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

// ── Reusable Form Field Component ────────────────────────────

interface FormFieldProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'textarea';
  placeholder?: string;
  required?: boolean;
}

export function FormField<T extends FieldValues>({
  form,
  name,
  label,
  type = 'text',
  placeholder,
  required = false,
}: FormFieldProps<T>) {
  const { register, formState: { errors } } = form;
  const error = errors[name];

  const inputClasses =
    'w-full rounded-md border px-3 py-2 text-sm outline-none transition-colors ' +
    (error
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500');

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>

      {type === 'textarea' ? (
        <textarea
          id={name}
          className={inputClasses}
          placeholder={placeholder}
          rows={3}
          {...register(name)}
        />
      ) : (
        <input
          id={name}
          type={type}
          className={inputClasses}
          placeholder={placeholder}
          {...register(name, { valueAsNumber: type === 'number' })}
        />
      )}

      {error && (
        <p className="text-xs text-red-500">{error.message as string}</p>
      )}
    </div>
  );
}
