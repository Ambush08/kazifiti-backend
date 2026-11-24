import type { NextFunction, Request, Response } from "express";

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

  if (err.type?.startsWith("entity.")) {
    const status = err.status ?? err.statusCode ?? 400;

    req.log.warn(
      { errType: err.type, path: req.path },
      "Rejected request body",
    );
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
