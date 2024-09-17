import express, {Request , Response} from 'express';
import { db } from './db';
import zod from 'zod';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const authRouter = express.Router();

// schema for login end point 
const logInSchema = zod.object({
    "username" : zod.string(),
    "password" : zod.string()
});

// schema for sign up schema
const signUpSchema = zod.object({
    "name" : zod.string(),
    "username" : zod.string(),
    "password" : zod.string()
});

// Endpoint for Logging in 
authRouter.post('/login' , async (req : Request, res : Response)=>{
    const body = req.body;
    try{    
        const parseResult = logInSchema.safeParse(body);
        if(!parseResult.success){
            res.status(411).json({
                message : "Incorrect inputs"
            });
            return;
        }
        
        const existingUser = await db.user.findFirst({
            where : {
                email : body.username,
            }
        });

        if(!existingUser){
            res.status(411).json({
                message : "incorrect email"
            });
            return;
        }
        
        const compare = await bcrypt.compare(body.password , existingUser.hashedPassword);
        if(!compare){
            res.status(411).json({
                message : "incorrect password"
            });
            return;
        }

        const JWT_SECRET = process.env.JWT_SECRET || "";
        const token = jwt.sign({ userId : existingUser.id} , JWT_SECRET);
        const user =  {
            id : existingUser.id,
            name : existingUser.name ,
            email : existingUser.email
        };

        res.status(200).json({
            user : user,
            token : token
        });

    }catch(error : any){
        console.log(`error while logging in ${error}`);
        res.status(411).json({
            message : "Invalid inputs"
        });
    }
});

// Endpoint for Signing Up
authRouter.post('/signup' , async (req : Request , res : Response)=>{
    const body = req.body;
    try{
        const schemaResult = signUpSchema.safeParse(body);
        if(!schemaResult){
            res.status(411).json({
                message : "Invalid inputs"
            });
            return;
        }

        const existingUser = await db.user.findFirst({
            where : {
                email : body.username
            }
        });

        if(existingUser != null && existingUser.id != null){
            res.status(411).json({
                message : "Email already taken or Incorrect inputs"
            });
            return;
        }
        
        const hashedPassword = await bcrypt.hash(body.password , 10);
        const user = await db.user.create({
            data: {
                email : body.username,
                name : body.name,
                hashedPassword : hashedPassword
            },
            select : {
                id : true,
                email : true,
                name : true
            }
        });

        const JWT_SECRET = process.env.JWT_SECRET || "";
        const token = jwt.sign({userId : user.id} , JWT_SECRET);

        res.status(200).json({
            message : "Account successfully created!",
            user : user,
            token : token
        });


    }catch(error : any){
        console.log(`error while signing in ${error.message}`);
        res.status(411).json({
            message : "Error while signing in"
        });
    }
})