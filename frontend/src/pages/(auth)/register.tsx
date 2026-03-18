/**
 * Register Page — THIN PAGE. No business logic.
 * Composes AuthCard + RegisterForm from auth-form feature.
 */

import { AuthCard, RegisterForm, useRegister } from '@/features/auth-form';

export default function RegisterPage() {
  const { register, isLoading, error } = useRegister();

  return (
    <AuthCard>
      <RegisterForm onSubmit={register} isLoading={isLoading} error={error} />
    </AuthCard>
  );
}
