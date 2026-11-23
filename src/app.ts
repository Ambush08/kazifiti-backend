import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import express from 'express';
import { clerkMiddleware } from '@clerk/express';
import userRouter from './routes/users.routes.js'
import env from './env.js';

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


//User route
app.use('/user/auth', userRouter)

const port = Number(env.port);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});