import jwt from "jsonwebtoken";
import env from "../env.js";


const generateRefreshToken = (
  userId: string,
  role: "user" | "employer" | "admin",
  tokenVersion: number,
) => {
  return jwt.sign(
    {
      userId,
      role,
      tokenVersion,
    },
    env.jwtRefreshSecret,
    {
      expiresIn: "1d", algorithm: "HS256"
    },
  );
};


export default generateRefreshToken;
