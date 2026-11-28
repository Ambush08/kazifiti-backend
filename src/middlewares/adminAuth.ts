import { Response, NextFunction } from "express";
import { RequestAuth } from "./authenticate.js";
import { AppError } from "../errors/AppError.js";
import { getUserQuery } from "../services/user/users.services.js";

export const adminAuth = async (
  req: RequestAuth,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user;

    if (!user) throw new AppError(401, "Unauthorized");

    const dbUser = await getUserQuery(user.userId);

    if (dbUser.tokenVersion !== user.tokenVersion) {
      throw new AppError(401, "Unauthorized");
    }

    if (dbUser.role !== "admin") {
      req.log.warn(
        { userId: dbUser.id, path: req.path },
        "Admin access denied",
      );
      throw new AppError(401, "Forbidden");
    }

    next();
  } catch (error) {
    if (error instanceof Error) {
      throw new AppError(404, "Not authorized");
    }
  }
};
