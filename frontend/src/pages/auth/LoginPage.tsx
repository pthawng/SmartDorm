import React from 'react';
import { AuthLayout, LoginForm } from '@/features/auth';

const LoginPage: React.FC = () => {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to your SmartDorm account to continue"
    >
      <LoginForm />
    </AuthLayout>
  );
};

export default LoginPage;
