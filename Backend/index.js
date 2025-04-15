const express=require('express');
const mongoose=require('mongoose'); 
const cors=require('cors');
const dotenv=require('dotenv');
const path=require('path');
dotenv.config();
// const cors=require('cors');
const connectDB=require('./src/db/connection.db.js');
const authrouter=require('./src/routes/auth.route.js');
const msgrouter=require('./src/routes/msg.route.js')
const cookieParser = require('cookie-parser');

const {app, server} = require('./src/utils/socket.js');

const PORT=process.env.PORT;
// const __dirname=path.resolve();
// const app=express();

app.use(cors({
    origin:'http://localhost:5173',
    credentials:true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:false}));
app.use('/uploads',express.static('uploads'));

app.use('/auth',authrouter);
app.use('/messages',msgrouter)

server.listen(PORT || 5000,()=>{   
    connectDB();
    console.log(`Server is running on port ${PORT}`)
    
}
);