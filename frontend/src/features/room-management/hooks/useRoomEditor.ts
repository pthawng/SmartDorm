import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getRoomById, updateRoom } from '../services/room.service';
import type { RoomFormPayload } from '@/entities/room';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RoomSchema, RoomStatus } from '@/entities/room';
import { useEffect } from 'react';

export function useRoomEditor(roomId: string) {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ['rooms', roomId],
    queryFn: () => getRoomById(roomId),
    staleTime: 5 * 60 * 1000,
  });

  const form = useForm<RoomFormPayload>({
    resolver: zodResolver(RoomSchema),
    defaultValues: {
      room_number: '',
      property_id: '',
      floor: 1,
      area_sqm: 20,
      monthly_price: 0,
      status: RoomStatus.AVAILABLE,
      description: null,
      images: [],
    },
  });

  // Pre-fill form when data loads
  useEffect(() => {
    if (query.data) {
      form.reset({
        room_number: query.data.room_number,
        property_id: query.data.property_id,
        floor: query.data.floor,
        area_sqm: query.data.area_sqm,
        monthly_price: query.data.monthly_price,
        status: query.data.status,
        description: query.data.description,
        images: query.data.images ?? [],
      });
    }
  }, [query.data, form]);

  const updateMutation = useMutation({
    mutationFn: (payload: RoomFormPayload) => updateRoom(roomId, payload),
    onSuccess: (updatedRoom) => {
      // Refresh the specific room cache
      qc.setQueryData(['rooms', roomId], updatedRoom);
      
      // Also update the room in the list cache if it exists
      qc.setQueryData(['rooms', 'list'], (old: any[] | undefined) => {
        if (!old) return old;
        return old.map(r => r.id === roomId ? { ...r, ...updatedRoom } : r);
      });
    },
    onError: () => {
      // In a real app we'd show an error toast here
    }
  });

  const onSubmit = (values: RoomFormPayload) => {
    return updateMutation.mutateAsync(values);
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isLoading: query.isLoading,
    isError: query.isError,
    isSubmitting: updateMutation.isPending,
  };
}
