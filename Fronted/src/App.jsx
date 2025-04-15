import React, { useEffect } from 'react'
import { Navbar } from './components/Navbar'
import { Routes, Route, Navigate } from 'react-router-dom'
import { HomePage } from './Pages/HomePage'
import { LoginPage } from './Pages/LoginPage'
import  {SignupPage}  from './Pages/SignupPage'
import { ProfilePage } from './Pages/ProfilePage'
import { SettingsPage } from './Pages/SettingsPage'
import {Loader} from 'lucide-react'
import { UseAuthStore } from "./store/UseAuthStore"
// import { axiosInstance } from './utils/axios'
import toast,{ Toaster } from 'react-hot-toast'
import { UseThemeStore } from './store/UseThemeStore'



export const App = () => {
 const {authUser,checkAuth,isCheckingAuth,onlineUsers} = UseAuthStore();
 console.log(onlineUsers);
 const {theme} = UseThemeStore();

 useEffect(() => {
  checkAuth(); // this is key for reconnecting socket
}, []);


useEffect(() => {
  document.documentElement.setAttribute('data-theme', theme);
}, [theme]);

if(isCheckingAuth && !authUser){
  return (
  <div className="flex justify-center items-center h-screen">
   <Loader className="w-16 h-16 animate-spin" />
   <span >Checking authentication...</span>
  </div>
  );

}

  return (
    <div data-theme={theme} className="min-h-screen bg-base-100">
      <Navbar />
     <Routes>
      <Route path="/" element={authUser?<HomePage/>:<Navigate to="/login" />} />
      <Route path="/login" element={!authUser?<LoginPage />:<Navigate to="/"/>} />
      <Route path="/signup" element={!authUser?<SignupPage />:<Navigate to="/"/>} />
      <Route path="/profile" element={authUser ? <ProfilePage />:<Navigate to="/login"/>} />
      <Route path="/settings" element={<SettingsPage />} />
    
     </Routes>
     <Toaster/>
  
  </div>
  )
}


export default App;