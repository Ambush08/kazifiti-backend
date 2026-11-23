import { NextFunction, Request, Response } from "express";
import { logger } from "../utils/logger.js";
import { success } from "zod";

export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  logger.error({error}, 'Unhandled error');


  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
};


