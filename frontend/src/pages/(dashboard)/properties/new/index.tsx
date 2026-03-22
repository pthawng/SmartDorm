import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { apiClient } from '@/services/apiClient';
import { useMutation } from '@tanstack/react-query';
import { FormField } from '@/shared/form'; // Assuming FormField handles simple inputs

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.string().min(1, 'Type is required'),
  city: z.string().min(1, 'City is required'),
  district: z.string().min(1, 'District is required'),
});

type FormValues = z.infer<typeof formSchema>;

export default function PropertyCreatePage() {
  const navigate = useNavigate();
  // Using crypto.randomUUID() for idempotency key on mount
  const [idempotencyKey] = useState(() => crypto.randomUUID());

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', type: '', city: '', district: '' },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: FormValues) => {
      const resp = await apiClient.post('/api/v1/properties', data, {
        headers: { 'Idempotency-Key': idempotencyKey }
      });
      return resp.data.data;
    },
    onSuccess: (data) => {
      // Redirect to wizard step 2
      navigate(`/dashboard/properties/${data.id}/edit?step=2`);
    },
    onError: (err) => {
      console.error("Failed to create property draft", err);
    }
  });

  return (
    <div className="max-w-2xl mx-auto py-12 px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Create New Property</h1>
        <p className="text-slate-500 mt-2">Let's start with some basic information to create a draft.</p>
      </div>
      
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit((d) => mutate(d))} className="space-y-6 bg-white p-8 rounded-xl shadow-sm border border-slate-100">
          <FormField form={form} name="name" label="Property Name" placeholder="e.g. Sunny Apartments" required />
          <FormField form={form} name="type" label="Property Type" placeholder="e.g. Dormitory, Apartment, Studio" required />
          
          <div className="grid grid-cols-2 gap-4">
            <FormField form={form} name="city" label="City / Province" placeholder="e.g. Hanoi" required />
            <FormField form={form} name="district" label="District" placeholder="e.g. Cau Giay" required />
          </div>
          
          <div className="pt-6 border-t border-slate-100 flex justify-end">
            <button 
              type="submit" 
              disabled={isPending}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-colors disabled:opacity-50"
            >
              {isPending ? 'Creating Draft...' : 'Continue'}
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
