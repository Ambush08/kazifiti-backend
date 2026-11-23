import * as userServices from "../../services/user/users.services.js";
import { Request, Response } from "express";
import hashPassword from "../../utils/hashPassword.js";
import sendEmail from "../../utils/sendEmail.js";
import { verifyEmail, verifyEmailToken } from "../../utils/verifyEmail.js";
import db from "../../db/index.js";
import { users } from "../../db/schema/users.schema.js";
import { eq } from "drizzle-orm";
import bcrypt from 'bcrypt'
import generateRefreshToken from "../../utils/refreshToken.js";
import generateAccessToken from "../../utils/accessToken.js";
import env from "../../env.js";



const DUMMY_HASH = bcrypt.hashSync("dummy-password", 10);

const getAppUrl = () => {
  if (!env.appUrl) {
    throw new Error("Missing APP URI");
  }

  return env.appUrl as string;
};

//Register new user
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, firstName, lastName, password } = req.body;

    //Check if user exists
    const existingUser = await userServices.findUserByEmail(email);

    if (existingUser) {
      return res.status(409).json({
        message: "Account with email already exists. Use a different email",
      });
    }

    const passwordHash = await hashPassword(password);

    const user = await db.transaction(async (tx) => {
      const [newUser] = await tx
        .insert(users)
        .values({ email, firstName, lastName, passwordHash })
        .returning({
          id: users.id,
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
          role: users.role,
          isVerified: users.emailVerified,
          createdAt: users.createdAt,
        });

      const token = verifyEmailToken(newUser.id);
      const verifyEmailUrl = `${getAppUrl()}/user/auth/verify-email?token=${token}`;

      // Send email to newly created user
      await sendEmail(
        newUser.email,
        "Verify your email",
        `<a href="${verifyEmailUrl}">${verifyEmailUrl}</a>`,
      );

      return newUser;
    });

    return res.status(201).json({
      message:
        "User created successfully. Check your email to verify your account.",
      user,
    });
  } catch (error: any) {
    const code = error?.code ?? error?.cause?.code;
    if (code === "23505") {
      return res.status(409).json({
        message: "Account with email already exists. Use a different email",
      });
    }

    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

//Verify email handler
export const verifyEmailHandler = async (req: Request, res: Response) => {
  try {
    const token = req.query.token as string;

    if (!token) {
      return res.status(400).json({
        message: "Missing email verification token",
      });
    }

    const decoded = verifyEmail(token) as { userId: string };

    const user = await userServices.getUserQuery(decoded.userId);

    if (!user) {
      return res.status(404).json({
        message: "Invalid or expired link",
      });
    }

    if (user.emailVerified) {
      return res.status(200).json({
        message: "Email already verified. Proceed to login",
      });
    }

    await db
      .update(users)
      .set({ emailVerified: true })
      .where(eq(users.id, decoded.userId));

      return res.status(200).json({
        message: 'Email verified successfully'
      });
      
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};


export const LoginUser = async (req: Request, res: Response) => {
  try {
    const { email, password} = req.body;

    const user = await userServices.findUserByEmail(email);

    if(!user){
      await bcrypt.compare(password, DUMMY_HASH);
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }


    const isMatch = await bcrypt.compare(password, user.passwordHash?? DUMMY_HASH);

    if(!isMatch){
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    if(!user.emailVerified){
      return res.status(401).json({
        message: 'Verify your email first'
      });
    }

    const refreshToken = generateRefreshToken(user.id, user.role, user.tokenVersion);

    const isProd = env.nodeEnv === 'production';

    const accessToken = generateAccessToken(user.id, user.role, user.tokenVersion);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: env.nodeEnv === "production" ? "none" : "lax",
      secure: isProd,
      path: "/api/v1/auth/refresh-token",
      maxAge: 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isEmailVerified: user.emailVerified,
        accountType: user.accountType,
        createdAt: user.createdAt
      },
      accessToken
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error"
    })
  }
}