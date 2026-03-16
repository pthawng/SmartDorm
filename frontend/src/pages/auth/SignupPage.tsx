import React from 'react';
import { AuthLayout, SignupForm } from '@/features/auth';

const SignupPage: React.FC = () => {
  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join SmartDorm and find your perfect student accommodation today."
    >
      <SignupForm />
    </AuthLayout>
  );
};

export default SignupPage;
