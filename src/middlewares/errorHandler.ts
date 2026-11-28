import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError.js";

type HttpError = Error & {
  type?: string;
  status?: number;
  statusCode?: number;
};

export const errorHandler = (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  
  if (res.headersSent) return next(err);

  if(err instanceof AppError){
    const status =
      err.statusCode >= 400 && err.statusCode < 600 ? err.statusCode : 500;

    req.log[status >= 500 ? "error" : "warn"](
      { err, status },
      "Application error",
    );

    return res.status(status).json({
      success: false,
      message: status >= 500 ? "Internal server error" : err.message,
    });
  }

  if (err.type === "entity.parse.failed" || err.type === "entity.too.large") {
    const status = err.type === "entity.too.large" ? 413 : 400;

    req.log.warn({ errType: err.type, path: req.path }, "Rejected request body");
    return res.status(status).json({
      success: false,
      message: status === 413 ? "Payload too large" : "Invalid request body",
    });
  }

  req.log.error({ err }, "Unhandled error");

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};
