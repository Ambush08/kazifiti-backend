import { Request, Response } from "express";
import * as userServices from "../../services/user/users.services.js";
import * as employerServices from "../../services/company/company.services.js";
import hashPassword from "../../utils/hashPassword.js";
import { DUMMY_HASH, getAppUrl } from "../users/user.controller.js";
import { verifyEmailToken } from "../../utils/verifyEmail.js";
import sendEmail from "../../utils/sendEmail.js";
import deleteFromLocal from "../../utils/deleteFromLocal.js";
import uploadToCloudinary from "../../utils/uploadToCloudinary.js";
import cloudinary from "../../config/cloudinary.js";

type UserData = {
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  logoUrl?: string;
  publicId?: string;
};

//Register employer
export const registerEmployer = async (req: Request, res: Response) => {
  const file = req.file;

  let result:
    | {
        url: string;
        publicId: string;
      }
    | undefined;

  try {
    const { firstName, lastName, email, password, company } = req.body;

    //Check if user already exists
    const exists = await userServices.findUserByEmail(email);

    if (exists) {
      if (file) await deleteFromLocal(file?.path);

      req.log.warn(
        { reason: "account_with_email_exists" },
        "Account with email alredy exists",
      );

      return res.status(409).json({
        message: "Account with email already exists",
      });
    }

    //Password hashing
    const passwordHash = await hashPassword(password);

    //Upload to cloudinary
    result = file ? await uploadToCloudinary(file.path) : undefined;

    const userData: UserData = {
      firstName,
      lastName,
      email,
      passwordHash,
    };

    //Register recruiter in transaction
    const { user } = await employerServices.registerRecruiterService(userData, {
      ...company,
      logo: result?.url,
      publicId: result?.publicId,
    });

    //Create email verification token
    const token = verifyEmailToken(user.id);

    const verifyEmailUrl = `${getAppUrl()}/api/user/auth/verify-email?token=${token}`;

    //Send email verification link
    try {
      await sendEmail(
        user.email,
        "<strong>Verify your email</strong>",
        `
        <p>
            <a href="${verifyEmailUrl}">${verifyEmailUrl}</a>
        </p>
        `,
      );
    } catch (error) {
      req.log.error({ err: error }, "Failed to send email");
    }

    return res.status(201).json({
      message:
        "Recruiter registered successfully. Check your email to verify your account",
    });
  } catch (error: any) {
    //Delete logo from cloudinary
    if (result?.publicId) {
      await cloudinary.uploader.destroy(result.publicId);
    }

    if ((error?.code ?? error?.cause?.code) === "23505") {
      return res
        .status(409)
        .json({ message: "Account with email already exists" });
    }

    req.log.error({ err: error }, "Failed to register employer");

    return res.status(500).json({
      message: "Internal server error",
    });
  } finally {
    if (file) {
      await deleteFromLocal(file?.path);
    }
  }
};
