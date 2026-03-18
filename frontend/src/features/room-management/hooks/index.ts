import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MOCK_ROOMS } from '../services/mock-data';
import type { RoomFormValues, RoomSummary } from '../types';

const QUERY_KEY = ['rooms', 'list'];

export function useRoomList() {
  return useQuery<RoomSummary[]>({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      await new Promise(r => setTimeout(r, 700));
      return MOCK_ROOMS;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateRoom() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (values: RoomFormValues) => {
      await new Promise(r => setTimeout(r, 500));
      const newRoom: RoomSummary = {
        id: `r-${Date.now()}`,
        roomNumber: values.roomNumber,
        propertyId: values.propertyId,
        propertyName: 'New Property', // would come from API
        floor: values.floor,
        area: values.area,
        monthlyPrice: values.monthlyPrice,
        status: 'AVAILABLE',
      };
      return newRoom;
    },
    onSuccess: (newRoom) => {
      qc.setQueryData<RoomSummary[]>(QUERY_KEY, (old = []) => [...old, newRoom]);
    },
  });
}

export function useUpdateRoomStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: RoomSummary['status'] }) => {
      await new Promise(r => setTimeout(r, 300));
      return { id, status };
    },
    onSuccess: ({ id, status }) => {
      qc.setQueryData<RoomSummary[]>(QUERY_KEY, (old = []) =>
        old.map(r => (r.id === id ? { ...r, status } : r)),
      );
    },
  });
}

export function useDeleteRoom() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await new Promise(r => setTimeout(r, 400));
      return id;
    },
    onSuccess: (deletedId) => {
      qc.setQueryData<RoomSummary[]>(QUERY_KEY, (old = []) =>
        old.filter(r => r.id !== deletedId),
      );
    },
  });
}
