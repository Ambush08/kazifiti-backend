import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import express from 'express';
import apiRouter from './routes/index.js'
import env from './env.js';
import { Request, Response } from 'express';
import { errorHandler } from './config/errorHandler.js';
dotenv.config({
    //quiet: true
});
const app = express();

const allowedOrigins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    env.clientUrl as string
]

//Parse json
app.use(express.json())

//Parse cookie
app.use(cookieParser());


//Configure cors
app.use(cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));

//Parsing form data
app.use(express.urlencoded({ extended: true}));


//User route
app.use(apiRouter)

const port = Number(env.port);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});


//Global error handling
app.use(errorHandler)

//Not found route
app.use((req: Request, res: Response) => {
    return res.status(404).json({
        message: 'Route not found'
    })
});