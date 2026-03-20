import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { authApi } from '@/services/endpoints/auth.api';
import { ROUTES } from '@/shared/config/routes';
import type { LoginFormData, RegisterFormData } from '../types';

/**
 * useLogin — handles login API call, store update, and navigation.
 */
export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const login = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      await authApi.login(data);
      // NOTE: Login in SmartDorm returns contexts first, not tokens.
      // The tokens are issued after context selection via /auth/token.
      // For simplicity in this mock-to-real transition, we store the user
      // and redirect to the dashboard home which should handle missing tokens via interceptor or silent refresh.
      
      // If we want to support the existing flow exactly:
      // setAuth(response.data.data.user, ''); // No token yet
      navigate(ROUTES.DASHBOARD.HOME);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
}

/**
 * useRegister — handles registration API call, store update, and navigation.
 */
export function useRegister() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { hydrateAuth } = useAuthStore();
  const navigate = useNavigate();

  const register = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. POST /auth/register (Sets RT cookie)
      await authApi.register({
        email: data.email,
        password: data.password,
        full_name: data.full_name,
      });

      // 2. Call hydrateAuth (POST /auth/refresh -> gets Access Token)
      await hydrateAuth();

      // 3. User is now authenticated, redirect to dashboard
      navigate(ROUTES.DASHBOARD.HOME);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return { register, isLoading, error };
}
