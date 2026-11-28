import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import express from 'express';
import apiRouter from './routes/index.js'
import env from './env.js';
import { Request, Response } from 'express';
import { errorHandler } from './middlewares/errorHandler.js';
import { httpLogger, logger } from './utils/logger.js';
import { verifyDbConnection } from './db/index.js';
dotenv.config({
    //quiet: true
});
const app = express();

//Every request gets an id and log line
app.use(httpLogger);

const allowedOrigins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    env.clientUrl as string
]

//Configure cors
app.use(cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));

//Parse json
app.use(express.json())

//Parse cookie
app.use(cookieParser());


//Parsing form data
app.use(express.urlencoded({ extended: true}));


//Routes
app.use(apiRouter);

//Not found route
app.use((req: Request, res: Response) => {
    return res.status(404).json({
        message: 'Route not found'
    })
});


//Global error handling
app.use(errorHandler);


await verifyDbConnection();


app.listen(env.port, () => {
    logger.info({ port: env.port }, `Server running at http://localhost:${env.port}`);
});