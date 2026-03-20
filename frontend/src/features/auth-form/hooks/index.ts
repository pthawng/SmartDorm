import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  const { hydrateAuth } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const login = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. POST /auth/login (Sets RT cookie)
      await authApi.login(data);
      
      // 2. Hydrate session (POST /auth/refresh -> gets User + AT)
      await hydrateAuth();

      // 3. Navigate back to origin or home
      const from = (location.state as any)?.from?.pathname || ROUTES.DASHBOARD.HOME;
      navigate(from, { replace: true });
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
  const location = useLocation();

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

      // 3. User is now authenticated, redirect to origin or dashboard
      const from = (location.state as any)?.from?.pathname || ROUTES.DASHBOARD.HOME;
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return { register, isLoading, error };
}
