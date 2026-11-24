import jwt from "jsonwebtoken";
import env from "../env.js";


const secret = env.jwtEmailVerify as string;

if (!secret) {
  throw new Error("Missing jwt email verify secret");
}


interface EmailVerifyPayload {
  userId: string;
  purpose: "email-verification";
}


export class InvalidToken extends Error {
  constructor(message = "Invalid token") {
    super(message);
    this.name = "InvalidToken";
  }
}

export const verifyEmailToken = (userId: string) => {
  return jwt.sign(
    {
      userId,
      purpose: "email-verification"
    },
    secret,
    { expiresIn: "15min" },
  );
};




export const verifyEmail = (token: string) => {
    const payload = jwt.verify(token, secret) as EmailVerifyPayload;

    if(payload.purpose !== 'email-verification' || typeof payload.userId !== 'string') {
      throw new InvalidToken("Invalid or expired token");
    }

    return payload;
}