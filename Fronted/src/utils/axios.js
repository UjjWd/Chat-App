import axios from "axios";
export const axiosInstance = axios.create({
    // baseURL: "https://chat-app-backend-b6c3.onrender.com",
   baseURL:" https://chat-app-backend-t4ro.onrender.com", 
    
    withCredentials: true, 
    });