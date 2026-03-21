import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/services/apiClient';

export interface PropertyCardData {
  id: string;
  name: string;
  location: string;
  status: 'draft' | 'published' | 'archived';
  roomCount?: number;
  thumbnailUrl?: string;
  cities?: string;
}

export function useProperties(workspaceId?: string) {
  return useQuery({
    queryKey: ['properties', workspaceId],
    queryFn: async () => {
      const response = await apiClient.get('/properties', {
        headers: {
          'x-workspace-id': workspaceId
        }
      });
      
      const rawData = response.data?.data || [];
      return rawData.map((item: any) => ({
        id: item.id,
        name: item.name,
        location: item.address,
        status: item.status,
        roomCount: item.room_count,
        thumbnailUrl: item.images?.find((img: any) => img.is_primary)?.url || item.images?.[0]?.url,
      })) as PropertyCardData[];
    },
    enabled: !!workspaceId,
    staleTime: 5 * 60 * 1000,
  });
}
