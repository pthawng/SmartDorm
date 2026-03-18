/**
 * Login Page — THIN PAGE. No business logic.
 * Composes AuthCard + LoginForm from auth-form feature.
 */

import { AuthCard, LoginForm, useLogin } from '@/features/auth-form';

export default function LoginPage() {
  const { login, isLoading, error } = useLogin();

  return (
    <AuthCard>
      <LoginForm onSubmit={login} isLoading={isLoading} error={error} />
    </AuthCard>
  );
}
