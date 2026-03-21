import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';
import { landlordSchema, type LandlordRegistrationPayload, DEFAULT_FORM_VALUES } from '@/entities/landlord/model/landlord.schema';
import { workspaceApi } from '@/services/endpoints/workspace.api';
import { propertyApi } from '@/services/endpoints/property.api';
import { ROUTES } from '@/shared/config/routes';

const STORAGE_KEY = 'landlord_onboarding_v4';

interface DraftState {
  step: number;
  formData: LandlordRegistrationPayload;
  workspaceId?: string;
  phase: 1 | 2;
}

export function useLandlordForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [workspaceId, setWorkspaceId] = useState<string | undefined>(undefined);
  const [phase, setPhase] = useState<1 | 2>(1);

  const navigate = useNavigate();
  const { user } = useAuthStore();

  // 1. Initialize from Persistence
  const getInitialDraft = useCallback((): DraftState => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed;
      } catch (e) { /* fallback */ }
    }
    return {
      step: 1,
      formData: { ...DEFAULT_FORM_VALUES, fullName: user?.full_name || '', email: user?.email || '', phoneNumber: user?.phone || '' },
      phase: 1
    };
  }, [user]);

  const initialDraft = getInitialDraft();

  const form = useForm<LandlordRegistrationPayload>({
    resolver: zodResolver(landlordSchema),
    defaultValues: initialDraft.formData,
    mode: 'onChange',
  });

  const { watch, handleSubmit, trigger } = form;
  const formValues = watch();

  // 2. Rehydration
  useEffect(() => {
    if (initialDraft.step > 1) setCurrentStep(initialDraft.step);
    if (initialDraft.workspaceId) setWorkspaceId(initialDraft.workspaceId);
    if (initialDraft.phase === 2) setPhase(2);
  }, []);

  // 3. Persistence Sync
  useEffect(() => {
    const draft: DraftState = {
      step: currentStep,
      formData: formValues,
      workspaceId,
      phase,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  }, [formValues, currentStep, workspaceId, phase]);

  // 4. Navigation Logic
  const nextStep = async () => {
    // If on Step 1, moving to Dashboard triggers Phase 1
    if (currentStep === 1) {
      const isStepValid = await trigger(['propertyName', 'email']);
      if (!isStepValid) {
        toast.error('Please provide a workspace name and valid email.');
        return;
      }

      const success = await handlePhase1();
      if (success) {
        navigate(ROUTES.BECOME_LANDLORD_SETUP);
      }
      return;
    }

    setCurrentStep((prev) => Math.min(prev + 1, 1));
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  // --- Helper: Retry Strategy ---
  const withRetry = async <T>(fn: () => Promise<T>, attempts = 3, delay = 1000): Promise<T> => {
    try {
      return await fn();
    } catch (error) {
      if (attempts <= 1) throw error;
      await new Promise(res => setTimeout(res, delay));
      return withRetry(fn, attempts - 1, delay * 2);
    }
  };

  // --- PHASE 1: Create Workspace & Switch Context ---
  const handlePhase1 = async () => {
    if (workspaceId && phase === 2) return true; // Already done

    setIsSubmitting(true);
    const toastId = 'onboarding-phase1';
    toast.loading('Initializing your Landlord account...', { id: toastId });

    try {
      // 1. Create Workspace
      let id = workspaceId;
      if (!id) {
        console.log('[Onboarding] Creating workspace:', formValues.propertyName);
        const wsResp = await workspaceApi.create({ name: formValues.propertyName });
        id = wsResp.data.data.id;
        setWorkspaceId(id);
      }

      // 2. Switch Context using centralized store method (Atomic Sync)
      console.log('[Onboarding] Switching context to workspace:', id);
      const { switchContext } = useAuthStore.getState();
      const response = await switchContext(id!);

      const { accessToken, context } = response;

      if (!accessToken || (context?.type !== 'LANDLORD' && context?.type !== 'landlord')) {
        console.warn('[Onboarding] Unexpected context type:', context?.type);
        // We continue anyway if we have an access token, but log a warning
      }

      // 3. Update Draft Phase
      setPhase(2);

      toast.success('Workspace created! Now tell us about your rooms.', { id: toastId });
      console.log('[Onboarding] Phase 1 success. Workspace ID:', id);
      return true;
    } catch (error: any) {
      console.error('[Onboarding] Phase 1 failed:', error);
      toast.error(error.message || 'Phase 1 failed. Please try again.', { id: toastId });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- PHASE 2: Create Property & Finalize ---
  const onSubmit = async (data: LandlordRegistrationPayload) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const toastId = 'onboarding-phase2';
    toast.loading('Publishing your property listing...', { id: toastId });

    try {
      const { accessToken } = useAuthStore.getState();

      // 1. Create Property (with Retry)
      const propertyData = {
        workspace_id: workspaceId,
        name: data.propertyName,
        address: data.address,
        city: 'Ho Chi Minh',
        description: `Premium rental managed by ${data.fullName}`,
      };

      await withRetry(() => propertyApi.create(propertyData, {
        headers: { Authorization: `Bearer ${accessToken}` }
      }));

      // 2. Activate Workspace
      await workspaceApi.updateStatus(workspaceId!, 'active');

      toast.success('Property published! Redirecting...', { id: toastId });

      // 3. Cleanup
      localStorage.removeItem(STORAGE_KEY);
      navigate(ROUTES.DASHBOARD.HOME);
    } catch (error: any) {
      toast.error(error.message || 'Finalization failed. Your draft is safe.', { id: toastId });
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
    isValid: phase === 1 ? true : form.formState.isValid, // Allow partial progress in Phase 1
    phase,
  };
}
