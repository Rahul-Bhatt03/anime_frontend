import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchEpisodesBySeasonId, fetchEpisodeById,createEpisode, updateEpisode, deleteEpisode } from "../API/episodeService";

// Enhanced useEpisodes hook with better error handling and caching
export const useEpisodes = (seasonId) => {
  return useQuery({
    queryKey: ['episodes', seasonId],
    queryFn: () => fetchEpisodesBySeasonId(seasonId),
    enabled: !!seasonId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    onError: (error) => {
      console.error(`Failed to fetch episodes for season ${seasonId}:`, error);
    }
  });
};

// Enhanced useEpisode hook for single episode
export const useEpisode = (episodeId) => {
  return useQuery({
    queryKey: ['episode', episodeId],
    queryFn: () => fetchEpisodeById(episodeId),
    enabled: !!episodeId,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
  });
};

// Enhanced useCreateEpisode hook
export const useCreateEpisode = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEpisode,
    onSuccess: (data, variables) => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries(['animes']);
      queryClient.invalidateQueries(['episodes', variables.seasonId]);
      queryClient.invalidateQueries(['seasons']); // Also invalidate seasons to update episode counts
      
      // Optionally show success message
      console.log('Episode created successfully:', data);
    },
    onError: (error, variables) => {
      console.error('Failed to create episode:', error);
    }
  });
};

// Enhanced useUpdateEpisode hook
export const useUpdateEpisode = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateEpisode,
    onSuccess: (data, variables) => {
      // Update the specific episode in cache
      queryClient.setQueryData(['episode', variables.id], data);
      
      // Invalidate related queries
      queryClient.invalidateQueries(['animes']);
      queryClient.invalidateQueries(['episodes', variables.seasonId]);
      queryClient.invalidateQueries(['seasons']);
      
      console.log('Episode updated successfully:', data);
    },
    onError: (error, variables) => {
      console.error('Failed to update episode:', error);
    }
  });
};

// Enhanced useDeleteEpisode hook
export const useDeleteEpisode = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteEpisode,
    onSuccess: (data, variables) => {
      // Remove the episode from cache
      queryClient.removeQueries(['episode', variables.episodeId]);
      
      // Invalidate related queries
      queryClient.invalidateQueries(['animes']);
      queryClient.invalidateQueries(['episodes', variables.seasonId]);
      queryClient.invalidateQueries(['seasons']);
      
      console.log('Episode deleted successfully');
    },
    onError: (error, variables) => {
      console.error('Failed to delete episode:', error);
    }
  });
};

// New hook for batch operations
export const useEpisodesBatch = (seasonIds) => {
  return useQuery({
    queryKey: ['episodes-batch', seasonIds],
    queryFn: async () => {
      const promises = seasonIds.map(seasonId => fetchEpisodesBySeasonId(seasonId));
      const results = await Promise.allSettled(promises);
      
      return results.reduce((acc, result, index) => {
        if (result.status === 'fulfilled') {
          acc[seasonIds[index]] = result.value;
        } else {
          acc[seasonIds[index]] = [];
          console.error(`Failed to fetch episodes for season ${seasonIds[index]}:`, result.reason);
        }
        return acc;
      }, {});
    },
    enabled: seasonIds && seasonIds.length > 0,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000
  });
}