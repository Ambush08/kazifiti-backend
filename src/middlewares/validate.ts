import { Request, Response, NextFunction } from "express";
import { ZodType, ZodError } from "zod";



const formatErrors = (error: ZodError) => {
  const fields: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = issue.path.slice(1).join(".") || issue.path[0]?.toString() || "form";
    (fields[key] ??= []).push(issue.message);
  }
  return fields;
};


const validate = (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse({
        body: req.body,
        params: req.params,
        query: req.query
    });

    if(!result.success){
        return res.status(400).json({
            message: 'Invalid data',
            error: formatErrors(result.error)
        });
    }

    const data = result.data as { body?: unknown; params?: unknown; query?: unknown };

    if(data.body) req.body = data.body;

    res.locals.validated = data; 

    next();
}



export default validate;