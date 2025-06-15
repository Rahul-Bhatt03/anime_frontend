import axios from 'axios'
import apiClient from './Client'

export const register=async(userData)=>{
const response=await apiClient.post("/api/User/register",userData)
return response.data;
}

export const login=async(credentials)=>{
    const response=await apiClient.post("/api/User/login",credentials)
    return response.data;
}