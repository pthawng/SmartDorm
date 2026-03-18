import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/shared/config/query-keys';
import { MOCK_PROPERTY, MOCK_ROOMS } from '../services/mock-data';

// Uncomment when backend is ready:
// import { propertyApi } from '@/services/endpoints/property.api';
// import { roomApi } from '@/services/endpoints/room.api';

/**
 * usePropertyDetail — fetches property data + rooms via TanStack Query.
 * Exposes separate loading states for property and rooms so the UI
 * can progressively render (show property header while rooms still load).
 */
export function usePropertyDetail(propertyId: string) {
  const propertyQuery = useQuery({
    queryKey: queryKeys.properties.detail(propertyId),
    queryFn: async () => {
      // TODO: Replace with real API call when backend is ready
      // const res = await propertyApi.getById(propertyId);
      // return res.data.data;
      return MOCK_PROPERTY;
    },
    enabled: !!propertyId,
    staleTime: 5 * 60 * 1000, // 5 min — property data is unlikely to change frequently
  });

  const roomsQuery = useQuery({
    queryKey: queryKeys.rooms.list({ property_id: propertyId }),
    queryFn: async () => {
      // TODO: Replace with real API call
      // const res = await roomApi.getAll({ property_id: propertyId });
      // return res.data.data;
      return MOCK_ROOMS;
    },
    enabled: !!propertyId,
    staleTime: 1 * 60 * 1000, // 1 min — room availability changes more often
  });

  return {
    property: propertyQuery.data,
    rooms: roomsQuery.data ?? [],
    isLoading: propertyQuery.isLoading,
    isRoomsLoading: roomsQuery.isLoading,
    isError: propertyQuery.isError || roomsQuery.isError,
    error: propertyQuery.error ?? roomsQuery.error,
    refetch: () => {
      propertyQuery.refetch();
      roomsQuery.refetch();
    },
  };
}
