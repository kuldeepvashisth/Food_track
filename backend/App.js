import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { authrouter } from './routes/authroutes.js';
import userRouter from './routes/userRoutes.js';
import orderRouter from './routes/OrderRoutes.js';
import { connectDb } from './config/db.js';
import shopRouter from './routes/shopRoutes.js';
import itemRouter from './routes/itemsRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

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
App.use('/api/order',orderRouter)
 
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
