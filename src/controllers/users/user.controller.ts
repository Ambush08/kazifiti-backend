import * as userServices from "../../services/user/users.services.js";
import { Request, Response } from "express";
import hashPassword from "../../utils/hashPassword.js";
import sendEmail from "../../utils/sendEmail.js";
import { verifyEmailToken } from "../../utils/verifyEmail.js";


const getAppUrl = () => {
  if(!process.env.APP_URI){
    throw new Error ('Missing APP URI')
  }

  return process.env.APP_URI as string;
}

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

    const newUser = await userServices.createUserQuery({
        email,
        firstName,
        lastName,
        passwordHash
    });


    const verifyEmailUrl = `${getAppUrl()}/user/auth/verify-email?token=${verifyEmailToken}`;
    //Verify email url
    await sendEmail(
      newUser.email,
      'Verify email',
      `<div>
        <p>Click the link below to verivy your email</p>
        <p>
          <a href='${verifyEmailUrl}'>${verifyEmailUrl}</a>
        </p>
      </div>`
    );

    return res.status(201).json({
      message: "User created successfully",
      user: newUser,
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

