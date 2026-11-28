import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError.js";
import jwt from "jsonwebtoken";
import env from "../env.js";

type AccessPayload = {
  userId: string;
  role: "user" | "employer" | "admin";
  tokenVersion: number;
};

export interface RequestAuth extends Request {
  user?: {
    userId: string;
    role: "user" | "employer" | "admin";
    tokenVersion: number;
  };
}

export const authenticate = (
  req: RequestAuth,
  res: Response,
  next: NextFunction,
) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Baerer ")) {
    throw new AppError(400, "Missing or inavlid auth token");
  }

  const token = header.split(" ")[1];

  let decoded: AccessPayload | null = null;

  try {
    decoded = jwt.verify(token, env.jwtaccessSecret, {
      algorithms: ["HS256"],
    }) as AccessPayload;
  } catch (error) {
    req.log.error({ err: error }, "Invalid token");
  }

  if (decoded) {
    req.user = decoded;
  }

  next();
};
