const path = require('path');
const express=require('express')
const cookieParser=require('cookie-parser')
const cors=require('cors');
const { authrouter } = require('./routes/authroutes')


const dotenv=require('dotenv');
const { connectDb } = require('./config/db');
dotenv.config()  //{ path: path.join(__dirname, '.env') }

const App=express(); //express ke andr jitne bhi function hai vo sbhi app mai aa gye
const port=process.env.PORT||5000;

//Global MiddleWare
App.use(cors({
    origin: 'http://localhost:5173', // Replace with your frontend URL
    credentials:true, // Allow cookies to be sent with requests
}))
App.use(express.json())
App.use(cookieParser())

App.use('/api/auth',authrouter)

App.get('/',(req,res)=>{
    res.send('<h1> hello home KD page </h1>')
})

const startServer = async () => {
//always phle connect db then start server

    try {
        await connectDb();
        App.listen(port,()=>{
            console.log('app start listening');
        })
    } catch (err) {
        console.log('server startup failed', err.message);
    }
};

startServer();




/*


*/