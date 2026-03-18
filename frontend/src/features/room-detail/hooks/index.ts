import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/shared/config/query-keys';
import { MOCK_ROOM, MOCK_PROPERTY } from '../services/mock-data';

// Uncomment when backend is ready:
// import { roomApi } from '@/services/endpoints/room.api';
// import { propertyApi } from '@/services/endpoints/property.api';

/**
 * useRoomDetail — fetches room data + parent property via TanStack Query.
 */
export function useRoomDetail(roomId: string) {
  const roomQuery = useQuery({
    queryKey: queryKeys.rooms.detail(roomId),
    queryFn: async () => {
      // TODO: Replace with real API call
      // const res = await roomApi.getById(roomId);
      // return res.data.data;
      return MOCK_ROOM;
    },
    enabled: !!roomId,
    staleTime: 1 * 60 * 1000,
  });

  const propertyId = roomQuery.data?.property_id;

  const propertyQuery = useQuery({
    queryKey: queryKeys.properties.detail(propertyId ?? ''),
    queryFn: async () => {
      // TODO: Replace with real API call
      // const res = await propertyApi.getById(propertyId!);
      // return res.data.data;
      return MOCK_PROPERTY;
    },
    enabled: !!propertyId,
    staleTime: 5 * 60 * 1000,
  });

  return {
    room: roomQuery.data,
    property: propertyQuery.data,
    isLoading: roomQuery.isLoading,
    isPropertyLoading: propertyQuery.isLoading,
    isError: roomQuery.isError || propertyQuery.isError,
    error: roomQuery.error ?? propertyQuery.error,
    refetch: () => {
      roomQuery.refetch();
      if (propertyId) propertyQuery.refetch();
    },
  };
}
