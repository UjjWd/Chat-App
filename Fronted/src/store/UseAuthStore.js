import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import {axiosInstance} from '../utils/axios';
// import {'toast'} from 'react-hot-toast';
import {toast} from 'react-hot-toast';
// import { connect, disconnect } from 'mongoose';
import { io } from "socket.io-client";

const BASE_URL = "https://chat-app-backend-t4ro.onrender.com"; 
 export const UseAuthStore = create((set,get )=>({
    authUser:null,
    isSigningUp:false,
    isLoggingIn:false,
    isUpdatingProfile:false,
    isCheckingAuth:true,
    onlineUsers:[],
    socket:null,
    otpSent:false,


    // otpVerified:false,
    sendOtp: async (email) => {
        set({ otpSent: true });

        try {
            const res = await axiosInstance.post('/auth/send-otp', { email });
            console.log(res.data);
            toast.success("OTP sent to your email");
        } catch (error) {
            console.error('Error sending OTP:', error);
            toast.error("Error sending OTP");
        } 
      },
      verifyOtp: async (email, otp) => {
        try {
          const res = await axiosInstance.post('/auth/verify-otp', { email, otp });
          console.log(res.data);
          // toast.success("OTP verified successfully");
          return true; // ✅ important
        } catch (error) {
          console.error('Error verifying OTP:', error);
          // toast.error("Invalid OTP"); // move toast here
          return false; // ✅ important
        }
      },
      



    checkAuth: async () => {
        try {
            const response = await axiosInstance.get('/auth/check');
            set({ authUser: response.data.user, isCheckingAuth: false });
            // console.log(response.data.user);
            get().connectSocket();
        } catch (error) {
            // console.error('Error checking authentication:', error);
            // console.log(error.response.data.message);
            // toast.error("Error checking authentication");
            set({ isCheckingAuth: false });
            
        }
    },
    signup: async (data) => {
        set({ isSigningUp: true });
        try {
          const res = await axiosInstance.post("/auth/signup", data);
          console.log(res.data);
          set({ authUser: res.data.user });
          toast.success("Account created successfully");
          get().connectSocket();
      
        } catch (error) {
          toast.error(error.response.data.message);
          // console.error("Error signing up:", error.response.data.message);
        } finally {
          set({ isSigningUp: false });
          set({ otpSent: false });
        }
      },
     logout:async () => {
        try {
            await axiosInstance.get('/auth/logout');
            set({ authUser: null});
            toast.success("Logged out successfully");
            get().disconnectSocket();
        } catch (error) {
            console.error('Error logging out:', error);
            toast.error("Error logging out");
        } 
      },
      login:async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post('/auth/login',data);
            console.log(res.data);
            set({ authUser: res.data.user });
            toast.success("Logged in successfully");
            get().connectSocket();
          
        } catch (error) {
          //  toast.error(error.response.message);
          toast.error("Error logging in");
        } finally {
            set({ isLoggingIn: false });
        }
      }
    ,
      updateProfile:async (data) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.put('/auth/upload', data);
            set({ authUser: res.data.user });
            toast.success("Profile updated successfully");
        } catch (error) {
            toast.error("Error updating profile");
        } finally {
            set({ isUpdatingProfile: false });
        }
      },
      connectSocket: () => {
        const { authUser } = get();
        console.log("Trying to connect socket with user:", authUser); // 👀
      
        if (!authUser || get().socket?.connected) return;
      
        const socket = io(BASE_URL, {
          query: { userId: authUser._id },
        });
      
        socket.connect();
      
        socket.on("connect", () => {
          console.log("Socket connected after refresh:", socket.id); // ✅
        });
      
        socket.on("getOnlineUsers", (userIds) => {
          console.log("Online users:", userIds);
          set({ onlineUsers: userIds });
        });
      
        set({ socket });
      },
      
      disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
      },
    }),

    )