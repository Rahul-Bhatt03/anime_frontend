import { useQuery,useMutation,useQueryClient } from "@tanstack/react-query";
import { fetchSeasonByAnimeId,createSeason,updateSeason,deleteSeason } from "../API/seasonService";

export const useSeasons = (animeId) => {
  return useQuery({
    queryKey: ['seasons', animeId],
    queryFn: () => fetchSeasonByAnimeId(animeId),
    enabled: !!animeId, // Only fetch when animeId exists
       select: (seasons) => seasons.map(season => ({
      ...season,
      episodeCount: season.episodes?.length || 0
    })),
    staleTime: 1000 * 60 * 5 // 5 minutes
  });
};

// export const useSeason=(id)=>{
//     return useQuery({
//         queryKey:["season",id],
//         queryFn:()=>fetchSeasons(id),
//         enabled:!!id,
//     })
// }

export const useCreateSeason=()=>{
    const queryClient=useQueryClient();
    return useMutation({
        mutationFn:createSeason,
        onSuccess:(data,variables)=>{
            queryClient.invalidateQueries(['seasons', variables.animeId]);
            queryClient.invalidateQueries(['anime', variables.animeId]);
        }
    })
}

export const useUpdateSeason=()=>{
    const queryClient=useQueryClient();
    return useMutation({
        mutationFn:updateSeason,
        onSuccess:(data,variables)=>{
            queryClient.invalidateQueries(['seasons', variables.animeId]);
            queryClient.invalidateQueries(['anime', variables.animeId]);
        }
    })
}

export const useDeleteSeason=()=>{
    const queryClient=useQueryClient();
    return useMutation({
        mutationFn:deleteSeason,
        onSuccess:(data,variables)=>{
            queryClient.invalidateQueries(['seasons', variables.animeId]);
            queryClient.invalidateQueries(['anime', variables.animeId]);
        }
    })
}