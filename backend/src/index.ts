import express, {NextFunction, Request, Response} from "express";
import cors from 'cors';
import { mainRouter } from "./routes/index";

const app = express();

app.use(express.json());
app.use(cors());

app.use(`/api/v1` , mainRouter);

app.listen(3000, ()=>{
    console.log(`backend started listening on port 3000`);
})
