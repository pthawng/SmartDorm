import { Link } from 'react-router-dom';
import { useAppForm } from '@/shared/form';
import { Button, Input } from '@/shared/ui';
import { ROUTES } from '@/shared/config/routes';
import { registerSchema, type RegisterFormData } from '../types';

interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => void;
  isLoading?: boolean;
  error?: string | null;
}

/**
 * RegisterForm — pure presentational. Receives onSubmit + state via props.
 */
export function RegisterForm({ onSubmit, isLoading, error }: RegisterFormProps) {
  const form = useAppForm(registerSchema, {
    defaultValues: { full_name: '', email: '', password: '', confirm_password: '' },
  });

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 lg:hidden">
          <span className="text-lg font-bold text-white">S</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 font-display">Create your account</h1>
        <p className="mt-2 text-sm text-slate-500">
          Start managing your properties today
        </p>
      </div>

      {/* Error alert */}
      {error && (
        <div className="mb-6 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Full Name"
          type="text"
          placeholder="John Doe"
          error={form.formState.errors.full_name?.message}
          {...form.register('full_name')}
        />

        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          error={form.formState.errors.email?.message}
          {...form.register('email')}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Minimum 8 characters"
          error={form.formState.errors.password?.message}
          {...form.register('password')}
        />

        <Input
          label="Confirm Password"
          type="password"
          placeholder="Re-enter your password"
          error={form.formState.errors.confirm_password?.message}
          {...form.register('confirm_password')}
        />

        <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
          Create Account
        </Button>
      </form>

      {/* Footer link */}
      <p className="mt-8 text-center text-sm text-slate-500">
        Already have an account?{' '}
        <Link to={ROUTES.LOGIN} className="font-semibold text-primary-600 hover:text-primary-700 transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}
