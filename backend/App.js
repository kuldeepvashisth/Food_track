const path = require('path');
const express=require('express')
const cookieParser=require('cookie-parser')
const cors=require('cors');
const { authrouter } = require('./routes/authroutes')
const userRouter = require('./routes/userRoutes')


const dotenv=require('dotenv');
dotenv.config({ path: path.join(__dirname, '.env') });
const { connectDb } = require('./config/db');
const shopRouter = require('./routes/shopRoutes');
const itemRouter = require('./routes/itemsRoutes');

const App=express(); //express ke andr jitne bhi function hai vo sbhi app mai aa gye
// const port = Number(process.env.PORT || process.env.port || 8000);
const port = process.env.PORT || 5000;
// const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';

const corsOrigin = 'http://localhost:5173';

//Global MiddleWare
App.use(cors({
    origin: corsOrigin,
    credentials:true, // Allow cookies to be sent with requests
}))
App.use(express.json())
App.use(cookieParser())

App.use('/api/auth',authrouter)
App.use('/api/user',userRouter)
App.use('/api/shop',shopRouter)
App.use('/api/item',itemRouter)
 
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
