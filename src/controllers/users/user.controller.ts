import * as userServices from "../../services/user/users.services.js";
import { Request, Response } from "express";
import hashPassword from "../../utils/hashPassword.js";

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
