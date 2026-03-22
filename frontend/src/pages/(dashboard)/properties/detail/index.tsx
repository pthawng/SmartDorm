import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '@/services/apiClient';

export default function PropertyDetailPage() {
  const { pid } = useParams();
  const navigate = useNavigate();
  const [publishError, setPublishError] = useState<{ error: string; missing: string[] } | null>(null);

  const { data: property, isLoading, refetch } = useQuery({
    queryKey: ['property', pid],
    queryFn: async () => {
      const resp = await apiClient.get(`/api/v1/properties/${pid}`);
      return resp.data.data;
    },
    enabled: !!pid,
  });

  const publishMutation = useMutation({
    mutationFn: async () => {
      // Clear previous error
      setPublishError(null);
      const resp = await apiClient.post(`/api/v1/properties/${pid}/publish`);
      return resp.data.data;
    },
    onSuccess: () => {
      refetch();
    },
    onError: (err: any) => {
      if (err.response?.data?.error === 'property_not_ready') {
        setPublishError(err.response.data);
      } else {
        console.error('Failed to publish', err);
      }
    }
  });

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (!property) return <div className="p-8">Not found</div>;

  const isDraft = property.status === 'draft';
  const hasImages = property.images && property.images.length > 0;
  const hasRooms = property.unit_count > 0;

  // Let's calculate a simple progress %
  let progress = 20; // Basic info is there
  if (property.address) progress += 20;
  if (property.description) progress += 20;
  if (hasImages) progress += 20;
  if (hasRooms) progress += 20;

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      <div className="flex justify-between items-start mb-8 border-b pb-6">
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-slate-900">{property.name}</h1>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wider ${isDraft ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
              {property.status}
            </span>
          </div>
          <p className="text-slate-500">{property.address}, {property.district}, {property.city}</p>
        </div>
        
        {isDraft && (
          <div className="flex gap-2">
            <button 
              onClick={() => navigate(`/dashboard/properties/${pid}/edit?step=2`)}
              className="btn-secondary px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-lg whitespace-nowrap"
            >
              Continue Setup
            </button>
            <button 
               onClick={() => publishMutation.mutate()}
               disabled={publishMutation.isPending}
               className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium whitespace-nowrap"
            >
               {publishMutation.isPending ? 'Publishing...' : 'Publish'}
            </button>
          </div>
        )}
      </div>

      {isDraft && (
        <div className="bg-white border text-slate-800 border-slate-200 p-6 rounded-xl mb-8 shadow-sm">
          <h3 className="font-semibold text-lg mb-4">Setup Progress: {progress}%</h3>
          
          <div className="w-full bg-slate-100 rounded-full h-2.5 mb-6">
            <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>

          <div className="space-y-3">
            {!hasImages && (
              <div className="flex items-center text-amber-700 bg-amber-50 p-3 rounded-lg">
                <span className="mr-2">❌</span>
                Missing primary image
              </div>
            )}
            {!hasRooms && (
              <div className="flex items-center text-amber-700 bg-amber-50 p-3 rounded-lg">
                <span className="mr-2">❌</span>
                Missing rooms (Units)
              </div>
            )}
          </div>
          
          {publishError && (
             <div className="mt-6 p-4 border border-red-200 bg-red-50 text-red-800 rounded-lg">
               <p className="font-bold">Cannot publish property yet.</p>
               <ul className="list-disc pl-5 mt-2">
                 {publishError.missing?.map(m => (
                    <li key={m}>Missing: {m}</li>
                 ))}
               </ul>
             </div>
          )}
        </div>
      )}

      {/* Property Details Content... */}
      <div className="grid grid-cols-3 gap-8">
         <div className="col-span-2 space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
               <h3 className="text-xl font-bold mb-4">About</h3>
               <p className="text-slate-600 whitespace-pre-wrap">{property.description || 'No description provided yet.'}</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
               <div className="flex justify-between items-center mb-4">
                 <h3 className="text-xl font-bold">Rooms</h3>
                 <button className="text-indigo-600 text-sm font-medium">Add Room</button>
               </div>
               {property.unit_count === 0 ? (
                 <p className="text-slate-500">No rooms added yet. Add a room to start accepting tenants.</p>
               ) : (
                 <p>{property.unit_count} rooms</p>
               )}
            </div>
         </div>
      </div>
    </div>
  );
}
