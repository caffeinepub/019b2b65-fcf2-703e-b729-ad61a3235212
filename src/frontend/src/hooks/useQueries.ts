import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Pin } from '@/backend';

export function useGetAllPins() {
  const { actor, isFetching } = useActor();

  return useQuery<[bigint, Pin][]>({
    queryKey: ['pins'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPins();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreatePin() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { latitude: number; longitude: number; memo: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.createPin(data.latitude, data.longitude, data.memo);
    },
    onSuccess: () => {
      // Invalidate and refetch pins to show the new pin immediately
      queryClient.invalidateQueries({ queryKey: ['pins'] });
    },
  });
}
