import { Router } from "express";
import userRouter from './users.routes.js';
import categoryRouter from './category.routes.js'


export const apiRouter = Router();

//User routes
apiRouter.use('/api/user/auth', userRouter);

//category routes
apiRouter.use('/api/categories', categoryRouter)


export default apiRouter;