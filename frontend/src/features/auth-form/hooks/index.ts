import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/services/endpoints/auth.api';
import { useAuthStore } from '@/store/authStore';
import { normalizeApiError } from '@/shared/lib/api-error';
import { ROUTES } from '@/shared/config/routes';
import type { LoginFormData, RegisterFormData } from '../types';

/**
 * useLogin — handles login API call, store update, and navigation.
 */
export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  const login = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authApi.login(data);
      const { user, accessToken } = res.data.data;
      localStorage.setItem('access_token', accessToken);
      setAuth(user, accessToken);
      navigate(ROUTES.DASHBOARD.HOME);
    } catch (err) {
      const normalized = normalizeApiError(err);
      setError(normalized.message);
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
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  const register = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authApi.register({
        full_name: data.full_name,
        email: data.email,
        password: data.password,
      });
      const { user, accessToken } = res.data.data;
      localStorage.setItem('access_token', accessToken);
      setAuth(user, accessToken);
      navigate(ROUTES.DASHBOARD.HOME);
    } catch (err) {
      const normalized = normalizeApiError(err);
      setError(normalized.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { register, isLoading, error };
}
