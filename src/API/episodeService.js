import apiClient from "./Client";

//get episode by season
export const fetchEpisodesBySeasonId=async(seasonId)=>{
    const response=await apiClient.get(`/api/Episodes/season/${seasonId}`);
    return response.data;
}
//get episode by id
export const fetchEpisodeById = async (episodeId) => {
  const response = await apiClient.get(`/api/Episodes/${episodeId}`);
  return response.data;
};
//create episode
export const createEpisode=async(episodeData)=>{
    const response=await apiClient.post("/api/Episodes",episodeData);
    return response.data;
}
//update episode
export const updateEpisode=async({id,...episodeData})=>{
    const response=await apiClient.put(`/api/Episodes/${id}`,episodeData);
    return response.data;
}
//delete episode
export const deleteEpisode=async(id)=>{
    await apiClient.delete(`/api/Episodes/${id}`);
    return id;
}