import express, {Request , Response} from 'express';
import { userRouter } from './user';
import { authRouter } from './auth';

export const mainRouter = express.Router();

mainRouter.use('/user' , userRouter);
mainRouter.use('/auth' , authRouter);

mainRouter.get('/' , (req : Request , res : Response)=>{
    const body = req.body;
    res.status(200).json({
        message : "healthy server"
    });
});