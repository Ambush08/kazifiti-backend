import jwt from "jsonwebtoken";


const secret = process.env.JWT_ACCESS_SECRET;

if(!secret){
    throw new Error('Missing jwt access secret in env variable')
}

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
    secret,
    {
      expiresIn: "15m", algorithm: "HS256"
    },
  );
};


export default generateAccessToken;