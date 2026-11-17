import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const secret = process.env.JWT_EMAIL_VERIFY_SECRET as string;

if (!secret) {
  throw new Error("Missing jwt email verify secret");
}


interface EmailVerifyPayload {
  userId: string;
  purpose: "email-verification";
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

    if(payload.purpose !== 'email-verification'){
        throw new Error('Invalid token')
    }
    return payload;
}