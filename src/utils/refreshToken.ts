import jwt from "jsonwebtoken";
import env from "../env.js";

const secret = env.jwtRefreshSecret;

if(!secret){
    throw new Error('Missing jwt refresh secret in env variable')
}

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
    secret,
    {
      expiresIn: "1d", algorithm: "HS256"
    },
  );
};


export default generateRefreshToken;
