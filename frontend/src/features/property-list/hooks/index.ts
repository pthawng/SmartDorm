import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MOCK_PROPERTIES } from '../services/mock-data';
import type { PropertyFormValues, PropertySummary } from '../types';

const QUERY_KEY = ['properties', 'list'];

export function usePropertyList() {
  return useQuery<PropertySummary[]>({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      await new Promise(r => setTimeout(r, 700));
      return MOCK_PROPERTIES;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateProperty() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (values: PropertyFormValues) => {
      await new Promise(r => setTimeout(r, 500));
      const newProp: PropertySummary = {
        id: `p-${Date.now()}`,
        name: values.name,
        address: values.address,
        city: values.city,
        totalRooms: 0,
        availableRooms: 0,
        status: 'ACTIVE',
      };
      return newProp;
    },
    onSuccess: (newProp) => {
      qc.setQueryData<PropertySummary[]>(QUERY_KEY, (old = []) => [...old, newProp]);
    },
  });
}

export function useDeleteProperty() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await new Promise(r => setTimeout(r, 400));
      return id;
    },
    onSuccess: (deletedId) => {
      qc.setQueryData<PropertySummary[]>(QUERY_KEY, (old = []) =>
        old.filter(p => p.id !== deletedId)
      );
    },
  });
}
