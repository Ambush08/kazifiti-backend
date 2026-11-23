import { Router } from "express";
import userRouter from './users.routes.js'


export const apiRouter = Router();

//User routes
apiRouter.use('/api/user/auth', userRouter);

//category routes



export default apiRouter;