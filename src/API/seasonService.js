import apiClient from "./Client";

//get season by animeID
export const fetchSeasonByAnimeId = async (animeId) => {
  try {
    const response = await apiClient.get(`/api/Seasons/anime/${animeId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching seasons:', error);
    throw error;
  }
};
//create new season
export const createSeason=async(seasonData)=>{
    const response=await apiClient.post("/api/Seasons",seasonData);
    return response.data;
}
//update season
export const updateSeason=async({id,...seasonData})=>{
    const response=await apiClient.put(`/api/Seasons/${id}`,seasonData);
    return response.data;
}
//delete season
export const deleteSeason=async(id)=>{
await apiClient.delete(`/api/Seasons/${id}`);
return id;
}