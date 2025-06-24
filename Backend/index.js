const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');

dotenv.config();

// Custom modules
const connectDB = require('./src/db/connection.db.js');
const authrouter = require('./src/routes/auth.route.js');
const streamRoutes = require("./src/routes/streamRoutes.js");
const msgrouter = require('./src/routes/msg.route.js');
const { app, server } = require('./src/utils/socket.js');

// Constants
const PORT = process.env.PORT || 5005;
const FRONTEND_URL = 'https://chat-app-three-ochre.vercel.app';

// CORS configuration
app.use(cors({
  origin: FRONTEND_URL, // Change to FRONTEND_URL in production
  credentials: true,
}));

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.get('/ping', (req, res) => {
  res.send('pong');
});


// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/auth', authrouter);
app.use('/messages', msgrouter);
app.use("/api/stream", streamRoutes);


// Start server
server.listen(PORT, () => {
  connectDB();
  console.log(`✅ Server is running on port ${PORT}`);
});
