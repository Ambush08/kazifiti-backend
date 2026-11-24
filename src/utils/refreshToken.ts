import jwt from "jsonwebtoken";
import env from "../env.js";


const generateRefreshToken = (
  userId: string,
  role: "user" | "employer" | "admin",
  tokenVersIon: number,
) => {
  return jwt.sign(
    {
      userId,
      role,
      tokenVersIon,
    },
    env.jwtRefreshSecret,
    {
      expiresIn: "1d", algorithm: "HS256"
    },
  );
};


export default generateRefreshToken;
