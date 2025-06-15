import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAnimeById,
  fetchAnimes,
  createAnime,
  updateAnime,
  deleteAnime,
} from "../API/animeService";

// Constants for query keys to avoid typos and ensure consistency
const QUERY_KEYS = {
  ANIMES: "animes",
  ANIME: "anime",
};

export const useAnimes = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.ANIMES],
    queryFn: fetchAnimes,
    // Add some default options for better UX
    staleTime: 1000 * 60 * 5, // 5 minutes before data becomes stale
    gcTime: 1000 * 60 * 10, // 10 minutes before garbage collection
  });
};

export const useAnime = (id) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ANIMES, id],
    queryFn: () => fetchAnimeById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};

export const useCreateAnime = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAnime,
    onSuccess: (newAnime) => {
      // Optimistically update the cache instead of invalidating
      queryClient.setQueryData([QUERY_KEYS.ANIMES], (oldAnimes) => {
        return [...oldAnimes, newAnime];
      });
    },
    // Optional: If the API returns the created anime, we can update the cache immediately
    // Otherwise, fall back to invalidation
    onError: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ANIMES] });
    },
  });
};

export const useUpdateAnime = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAnime,
    onMutate: async (updatedAnime) => {
      // Cancel any outgoing refetches to avoid overwriting our optimistic update
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEYS.ANIMES, updatedAnime.id],
      });

      // Snapshot the previous value
      const previousAnime = queryClient.getQueryData([
        QUERY_KEYS.ANIMES,
        updatedAnime.id,
      ]);
      const previousAnimes = queryClient.getQueryData([QUERY_KEYS.ANIMES]);

      // Optimistically update the specific anime
      queryClient.setQueryData(
        [QUERY_KEYS.ANIMES, updatedAnime.id],
        updatedAnime
      );

      // Optimistically update the anime in the list
      if (previousAnimes) {
        queryClient.setQueryData(
          [QUERY_KEYS.ANIMES],
          previousAnimes.map((anime) =>
            anime.id === updatedAnime.id ? updatedAnime : anime
          )
        );
      }

      return { previousAnime, previousAnimes };
    },
    onError: (err, updatedAnime, context) => {
      // Rollback on error
      if (context?.previousAnime) {
        queryClient.setQueryData(
          [QUERY_KEYS.ANIMES, updatedAnime.id],
          context.previousAnime
        );
      }
      if (context?.previousAnimes) {
        queryClient.setQueryData([QUERY_KEYS.ANIMES], context.previousAnimes);
      }
    },
    onSettled: (updatedAnime) => {
      // Always refetch after error or success to ensure consistency
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ANIMES, updatedAnime?.id],
      });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ANIMES] });
    },
  });
};

export const useDeleteAnime = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAnime,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.ANIMES] });

      const previousAnimes = queryClient.getQueryData([QUERY_KEYS.ANIMES]);

      // Optimistically remove the anime from the list
      if (previousAnimes) {
        queryClient.setQueryData(
          [QUERY_KEYS.ANIMES],
          previousAnimes.filter((anime) => anime.id !== id)
        );
      }

      return { previousAnimes };
    },
    onError: (err, id, context) => {
      if (context?.previousAnimes) {
        queryClient.setQueryData([QUERY_KEYS.ANIMES], context.previousAnimes);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ANIMES] });
    },
  });
};
