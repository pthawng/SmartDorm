import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/apiClient';
import { useForm, FormProvider, useWatch } from 'react-hook-form';
import { FormField } from '@/shared/form';
import { useDebounce } from '@/shared/hooks/use-debounce'; 
// Assuming useDebounce(value, delay) exists

export default function PropertyEditPage() {
  const { pid } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const stepParam = searchParams.get('step');
  const step = stepParam ? parseInt(stepParam, 10) : 2;

  // Fetch draft data
  const { data: property, isLoading } = useQuery({
    queryKey: ['property', pid],
    queryFn: async () => {
      const resp = await apiClient.get(`/api/v1/properties/${pid}`);
      return resp.data.data;
    },
    enabled: !!pid,
  });

  const handleNext = () => {
    if (step < 5) {
      setSearchParams({ step: (step + 1).toString() });
    } else {
      navigate(`/dashboard/properties/${pid}`); // go to detail draft page
    }
  };

  const handleBack = () => {
    if (step > 2) {
      setSearchParams({ step: (step - 1).toString() });
    } else {
      navigate('/dashboard/properties/new');
    }
  };

  if (isLoading) return <div className="p-8 flex justify-center"><div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full"></div></div>;
  if (!property) return <div className="p-8 text-center text-slate-500">Property draft not found.</div>;

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      {/* Wizard Header / Navigation */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Property Setup</h1>
        <div className="flex items-center gap-4 text-sm font-medium">
           <span className={step === 2 ? "text-indigo-600" : "text-slate-400"}>Location</span>
           <span className="text-slate-300">/</span>
           <span className={step === 3 ? "text-indigo-600" : "text-slate-400"}>Description</span>
           <span className="text-slate-300">/</span>
           <span className={step === 4 ? "text-indigo-600" : "text-slate-400"}>Amenities</span>
           <span className="text-slate-300">/</span>
           <span className={step === 5 ? "text-indigo-600" : "text-slate-400"}>Photos</span>
        </div>
      </div>

      {/* Render Steps */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 min-h-[400px]">
        {step === 2 && <StepLocation property={property} pid={pid!} />}
        {step === 3 && <StepDescription property={property} pid={pid!} />}
        {step === 4 && <StepAmenities property={property} pid={pid!} />}
        {step === 5 && <StepImages property={property} pid={pid!} />}
      </div>

      <div className="mt-8 flex justify-between items-center border-t border-slate-200 pt-6">
          <button onClick={handleBack} className="text-slate-600 font-medium hover:text-slate-900 transition-colors">
            ← Back
          </button>
          
          <button onClick={handleNext} className="bg-slate-900 hover:bg-black text-white px-8 py-2.5 rounded-lg font-medium transition-colors">
            {step === 5 ? 'Done' : 'Next Step'}
          </button>
      </div>
    </div>
  );
}

// ---- STUB FOR AUTO SAVE HOOK ----
function useAutoSave(form: any, mutateFn: any) {
   const [isSaving, setIsSaving] = useState(false);
   const [lastSaved, setLastSaved] = useState<Date | null>(null);
   const values = useWatch({ control: form.control });
   const debouncedValues = useDebounce(values, 800);

   useEffect(() => {
      if (Object.keys(debouncedValues).length === 0) return;
      setIsSaving(true);
      mutateFn(debouncedValues, {
         onSuccess: () => {
            setIsSaving(false);
            setLastSaved(new Date());
         },
         onError: () => setIsSaving(false)
      });
   }, [debouncedValues, mutateFn]);

   return { isSaving, lastSaved };
}

// ---- STEP 2: LOCATION ----
function StepLocation({ property, pid }: { property: any, pid: string }) {
  const queryClient = useQueryClient();
  const form = useForm({
    defaultValues: {
      address: property.address || '',
      latitude: property.latitude || undefined,
      longitude: property.longitude || undefined,
    }
  });

  const { mutate } = useMutation({
    mutationFn: async (data: any) => {
      // Clean up empty coords
      const payload = { ...data };
      if (!payload.latitude) delete payload.latitude; else payload.latitude = Number(payload.latitude);
      if (!payload.longitude) delete payload.longitude; else payload.longitude = Number(payload.longitude);
      await apiClient.patch(`/api/v1/properties/${pid}`, payload);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['property', pid] })
  });

  const { isSaving, lastSaved } = useAutoSave(form, mutate);

  return (
    <FormProvider {...form}>
      <form className="space-y-6">
        <div>
           <h2 className="text-xl font-bold mb-1">Where is it located?</h2>
           <p className="text-slate-500 text-sm mb-6">Provide the exact address.</p>
        </div>
        
        <FormField form={form} name="address" label="Street Address" placeholder="123 Example St" />
        
        <div className="grid grid-cols-2 gap-4">
           {/* Optionals for Map Picker */}
           <FormField form={form} name="latitude" label="Latitude (Optional)" type="number" />
           <FormField form={form} name="longitude" label="Longitude (Optional)" type="number" />
        </div>

        <SaveIndicator isSaving={isSaving} lastSaved={lastSaved} />
      </form>
    </FormProvider>
  );
}

// ---- STEP 3: DESCRIPTION ----
function StepDescription({ property, pid }: { property: any, pid: string }) {
  const queryClient = useQueryClient();
  const form = useForm({
    defaultValues: {
      description: property.description || '',
    }
  });

  const { mutate } = useMutation({
    mutationFn: async (data: any) => {
      await apiClient.patch(`/api/v1/properties/${pid}`, data);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['property', pid] })
  });

  const { isSaving, lastSaved } = useAutoSave(form, mutate);

  return (
    <FormProvider {...form}>
      <form className="space-y-6">
        <div>
           <h2 className="text-xl font-bold mb-1">Describe your property</h2>
           <p className="text-slate-500 text-sm mb-6">Write a great description to attract tenants. Highlight key features.</p>
        </div>
        
        <FormField form={form} name="description" label="Description" type="textarea" placeholder="This beautiful property features..." />

        <SaveIndicator isSaving={isSaving} lastSaved={lastSaved} />
      </form>
    </FormProvider>
  );
}

// ---- STEP 4: AMENITIES ----
function StepAmenities({ property, pid }: { property: any, pid: string }) {
  const queryClient = useQueryClient();
  const form = useForm({
    defaultValues: {
      amenities: property.amenities || [],
    }
  });

  const { mutate } = useMutation({
    mutationFn: async (data: any) => {
      await apiClient.patch(`/api/v1/properties/${pid}`, data);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['property', pid] })
  });

  const { isSaving, lastSaved } = useAutoSave(form, mutate);

  const availableAmenities = ['Wifi', 'Parking', 'Air Conditioner', 'Security', 'Elevator', 'Laundry'];
  const currentAmenities = form.watch('amenities') as string[];

  const toggleAmenity = (am: string) => {
      if (currentAmenities.includes(am)) {
          form.setValue('amenities', currentAmenities.filter(a => a !== am));
      } else {
          form.setValue('amenities', [...currentAmenities, am]);
      }
  };

  return (
    <FormProvider {...form}>
      <form className="space-y-6">
        <div>
           <h2 className="text-xl font-bold mb-1">What amenities are included?</h2>
           <p className="text-slate-500 text-sm mb-6">Select all that apply to the entire property.</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
           {availableAmenities.map(am => (
               <label key={am} className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${currentAmenities.includes(am) ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200 hover:border-slate-300'}`}>
                   <input 
                      type="checkbox" 
                      className="hidden" 
                      checked={currentAmenities.includes(am)} 
                      onChange={() => toggleAmenity(am)} 
                   />
                   <span className={currentAmenities.includes(am) ? 'text-indigo-800 font-medium' : 'text-slate-700'}>{am}</span>
               </label>
           ))}
        </div>

        <SaveIndicator isSaving={isSaving} lastSaved={lastSaved} />
      </form>
    </FormProvider>
  );
}

// ---- STEP 5: IMAGES ----
function StepImages({ property, pid }: { property: any, pid: string }) {
  const [isUploading, setIsUploading] = useState(false);
  const queryClient = useQueryClient();

  const handleUploadFake = async () => {
      setIsUploading(true);
      // Simulate file upload
      setTimeout(async () => {
         await apiClient.post(`/api/v1/properties/${pid}/images`, {
             url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267", // fake image
             is_primary: property.images?.length === 0,
             display_order: property.images?.length || 0
         });
         queryClient.invalidateQueries({ queryKey: ['property', pid] });
         setIsUploading(false);
      }, 1000);
  };

  return (
    <div>
       <h2 className="text-xl font-bold mb-1">Upload property photos</h2>
       <p className="text-slate-500 text-sm mb-6">Add at least one photo. Real photos attract more tenants.</p>
       
       <div className="border-2 border-dashed border-slate-300 rounded-xl p-10 text-center hover:bg-slate-50 transition-colors cursor-pointer" onClick={handleUploadFake}>
           <div className="text-4xl mb-3">📸</div>
           <p className="font-medium text-slate-700 mb-1">Click to simulate upload</p>
           <p className="text-sm text-slate-500">Supports JPG, PNG (Max 5MB)</p>
       </div>

       {property.images && property.images.length > 0 && (
           <div className="mt-8">
               <h3 className="font-semibold mb-4">Uploaded Photos ({property.images.length})</h3>
               <div className="grid grid-cols-3 gap-4">
                   {property.images.map((img: any) => (
                       <div key={img.id} className="relative aspect-video rounded-lg overflow-hidden bg-slate-100 border">
                           <img src={img.url} alt="Property" className="w-full h-full object-cover" />
                           {img.is_primary && <span className="absolute top-2 left-2 bg-indigo-600 text-white text-xs px-2 py-1 rounded font-medium shadow-sm">Primary</span>}
                       </div>
                   ))}
               </div>
           </div>
       )}
    </div>
  );
}

// ---- UTILS ----
function SaveIndicator({ isSaving, lastSaved }: { isSaving: boolean, lastSaved: Date | null }) {
    if (isSaving) return <p className="text-sm text-indigo-600 font-medium flex items-center gap-2 mt-6"><span className="animate-pulse">●</span> Saving changes...</p>;
    if (lastSaved) return <p className="text-sm text-slate-400 mt-6">✓ Saved at {lastSaved.toLocaleTimeString()}</p>;
    return <p className="text-sm text-transparent select-none mt-6">_</p>; // Layout placeholder
}
