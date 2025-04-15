const express=require('express');
const msgrouter=express.Router();
const authMiddleware = require('../middleware/auth.middleware.js'); // Adjust the path as needed
const {getUsersForSidebar,getMessages,sendMessage}=require('../controllers/msg.controller.js');
const router = express.Router();

msgrouter.get("/users", authMiddleware, getUsersForSidebar);
msgrouter.get("/:id", authMiddleware, getMessages);

msgrouter.post("/send/:id",authMiddleware,sendMessage);


module.exports=msgrouter;