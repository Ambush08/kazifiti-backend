import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";



export const validate = (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse({
        body: req.body,
        params: req.params,
        query: req.query
    });

    if(!result.success){
        return res.status(400).json({
            message: 'Invalid data',
            error: result.error.flatten().fieldErrors
        });
    }

    const data = result.data as { body?: unknown; params?: unknown; query?: unknown };

    if(data.body) req.body = data.body;

    res.locals.validated = data; 

    next();
}