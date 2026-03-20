import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';
import { landlordSchema, type LandlordRegistrationPayload, DEFAULT_FORM_VALUES } from '@/entities/landlord/model/landlord.schema';
import { landlordApi } from '@/services/endpoints/landlord.api';
import { ROUTES } from '@/shared/config/routes';

const STORAGE_KEY = 'landlord_onboarding_draft';

export function useLandlordForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { hydrateAuth: refreshAuth, user } = useAuthStore();

  // Initialize form with local persistence
  const getInitialValues = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_FORM_VALUES;
      }
    }
    return { ...DEFAULT_FORM_VALUES, fullName: user?.full_name || '', email: user?.email || '', phoneNumber: user?.phone || '' };
  };

  const form = useForm<LandlordRegistrationPayload>({
    resolver: zodResolver(landlordSchema),
    defaultValues: getInitialValues(),
    mode: 'onChange',
  });

  const { watch, handleSubmit, formState: { errors, isValid } } = form;
  const formValues = watch();

  // Persist form state on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formValues));
  }, [formValues]);

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const onSubmit = async (data: LandlordRegistrationPayload) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    const toastId = toast.loading('Registering you as a Landlord...');

    try {
      await landlordApi.register(data);
      
      // 1. Refresh auth to get new JWT with LANDLORD role
      await refreshAuth();
      
      toast.success('Welcome to the Landlord community!', { id: toastId });
      
      // 2. Clear draft
      localStorage.removeItem(STORAGE_KEY);
      
      // 3. Redirect to dashboard
      navigate(ROUTES.DASHBOARD.HOME);
    } catch (error: any) {
      console.error('Landlord Registration Error:', error);
      
      if (error.response?.status === 422) {
        toast.error('Validation failed. Please check your inputs.', { id: toastId });
      } else {
        toast.error(error.message || 'Something went wrong. Please try again.', { id: toastId });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    currentStep,
    isSubmitting,
    nextStep,
    prevStep,
    onSubmit: handleSubmit(onSubmit),
    isValid,
    errors,
  };
}
