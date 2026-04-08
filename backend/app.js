import  express from 'express'
import cors from 'cors';
import { userRouter } from './routes/UserRoute.js';
import { trackRouter } from './routes/TrackRoute.js';
const app=express();
app.use(cors());
app.use(express.json());
app.use("/user",userRouter)
app.use('/track',trackRouter)
export{
    app
}