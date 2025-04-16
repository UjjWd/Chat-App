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
const msgrouter = require('./src/routes/msg.route.js');
const { app, server } = require('./src/utils/socket.js');
const { dir } = require('console');

// Constants
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = 'https://chat-app-three-ochre.vercel.app/';

// CORS configuration
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
}));

// Middlewares
// const dirname = path.resolve();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/auth', authrouter);
app.use('/messages', msgrouter);

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
    const path = require('path');
    const dirname = path.resolve();
  
    app.use(express.static(path.join(dirname, '/Frontend/dist')));
  
    app.get('*', (req, res) => {
      res.sendFile(path.join(dirname, '/Frontend/dist/index.html'));
    });
  }
  
// Start server
server.listen(PORT, () => {
  connectDB();
  console.log(`✅ Server is running on port ${PORT}`);
});
