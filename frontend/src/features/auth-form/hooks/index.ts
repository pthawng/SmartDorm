import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
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

  /**
   * Simulated Login Flow as Tenant.
   */
  const login = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      // High-Fidelity Simulation Delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockUser = {
        id: 'mock-tenant-123',
        email: data.email || 'alex@smartdorm.com',
        full_name: 'Alex Tenant',
        phone: '090-123-4567',
        role: 'TENANT' as const,
        is_active: true,
        created_at: new Date().toISOString(),
      };
      const mockToken = 'mock-jwt-token-tenant';

      localStorage.setItem('access_token', mockToken);
      setAuth(mockUser, mockToken);
      // Redirect to dedicated Tenant Home
      navigate(ROUTES.DASHBOARD.TENANT_HOME);
    } catch (err) {
      setError('Simulated login failure. Please try again.');
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

  /**
   * Simulated Registration Flow as Landlord.
   */
  const register = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);
    try {
       // High-Fidelity Simulation Delay
       await new Promise(resolve => setTimeout(resolve, 1000));

       const mockUser = {
         id: 'mock-landlord-456',
         email: data.email || 'larry@smartdorm.com',
         full_name: data.full_name || 'Landlord Larry',
         phone: '091-888-9999',
         role: 'LANDLORD' as const,
         is_active: true,
         created_at: new Date().toISOString(),
       };
       const mockToken = 'mock-jwt-token-landlord';

       localStorage.setItem('access_token', mockToken);
       setAuth(mockUser, mockToken);
       navigate(ROUTES.DASHBOARD.HOME);
    } catch (err) {
      setError('Simulated registration failure. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return { register, isLoading, error };
}
