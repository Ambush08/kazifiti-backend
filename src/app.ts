import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import express from 'express';
import { clerkMiddleware } from '@clerk/express'

dotenv.config({
    //quiet: true
});
const app = express();

const allowedOrigins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    process.env.CLIENT_URL as string
]

//Parse json
app.use(express.json())

//Parse cookie
app.use(cookieParser());

//Configure clark middleware
app.use(clerkMiddleware())

//Configure cors
app.use(cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}))

const port = Number(process.env.PORT);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});