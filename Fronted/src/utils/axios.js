import axios from "axios";
export const axiosInstance = axios.create({
    baseURL: "https://chat-app-e5s9.vercel.app/",
    withCredentials: true, 
    });