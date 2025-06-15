import apiClient from "./Client";

//get all animes 
export const fetchAnimes=async()=>{
    const response=await apiClient.get("/api/animes");
    return response.data;
}

//get anime by id
export const fetchAnimeById=async(id)=>{
    const response=await apiClient.get(`/api/animes/${id}`);
    return response.data;
}
//create new anime
export const createAnime=async(animeData)=>{
    const response=await apiClient.post("/api/animes",animeData);
    return response.data;
}
//update existing anime
export const updateAnime=async({id,...animeData})=>{
    const response=await apiClient.put(`/api/animes/${id}`,animeData);
    return response.data;
}
//delete anime
export const deleteAnime=async(id)=>{
    const response=await apiClient.delete(`/api/animes/${id}`);
    return id; //returns the deleted id for catch updates 
}

