const express=require('express');   
const authrouter=express.Router();
const authMiddleware = require('../middleware/auth.middleware.js'); // Adjust the path as needed
const {signup,login,logout,uploadProfilePicture,checkAuth}=require('../controllers/auth.controller.js'); 
const {sendotp,checkotp}=require('../controllers/auth.controller.js');

authrouter.post('/signup',signup);
authrouter.post('/login',login);
authrouter.get('/logout',logout);
authrouter.put('/upload',authMiddleware,uploadProfilePicture);
authrouter.get('/check',authMiddleware,checkAuth)
authrouter.post('/send-otp',sendotp);
authrouter.post('/verify-otp',checkotp);




module.exports=authrouter;