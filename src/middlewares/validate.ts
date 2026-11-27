import { Request, Response, NextFunction } from "express";
import { ZodType, ZodError } from "zod";

const formatErrors = (error: ZodError) => {
  const fields: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const path = issue.path[0] === "body" ? issue.path.slice(1) : issue.path;
    const key = path.join(".") || "form";
    (fields[key] ??= []).push(issue.message);
  }
  return fields;
};

const validate =
  (schema: ZodType) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await schema.safeParse({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      if (!result.success) {
        return res.status(400).json({
          message: "Invalid data",
          error: formatErrors(result.error),
        });
      }

      const data = result.data as {
        body?: unknown;
        params?: unknown;
        query?: unknown;
      };

      if (data.body) req.body = data.body;

      res.locals.validated = data;

      next();
    } catch (error) {
        next(error)
    }
  };

export default validate;
