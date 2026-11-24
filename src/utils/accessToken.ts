import jwt from "jsonwebtoken";
import env from "../env.js";


const generateAccessToken = (
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
    env.jwtaccessSecret,
    {
      expiresIn: "15m", algorithm: "HS256"
    },
  );
};


export default generateAccessToken;