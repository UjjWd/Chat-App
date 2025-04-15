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
    origin:'https://chat-app-fronted-nq99.onrender.com',
    credentials:true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:false}));
app.use('/uploads',express.static('uploads'));

app.use('/auth',authrouter);
app.use('/messages',msgrouter)
if(process.env.NODE_ENV==='production'){
    app.use(express.static(path.join(__dirname,'../Frontend/dist')));
    app.get('*',(req,res)=>{
        res.sendFile(path.join(__dirname,'../Frontend','dist','index.html'));
    }); 

}
server.listen(PORT || 5000,()=>{   
    connectDB();
    console.log(`Server is running on port ${PORT}`)
    
}
);