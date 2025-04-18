import axios from "axios";
export const axiosInstance = axios.create({
    baseURL: "https://chat-app-backend-b6c3.onrender.com",
   // baseURL: "http://localhost:5005", // Change to your backend URL in development
    
    withCredentials: true, 
    });