import { email, z } from "zod";

const passwordSchema = z
  .string()
  .min(8, {
    message: "Password must be at least 8 characters long",
  })
  .regex(/[A-Z]/, {
    message: "Password must contain at least one uppercase letter",
  })
  .regex(/[a-z]/, {
    message: "Password must contain at least one lowercase letter",
  })
  .regex(/[0-9]/, {
    message: "Password must contain at least one number",
  })
  .regex(/[^A-Za-z0-9]/, {
    message: "Password must contain at least one special character",
  });

  //Register schema
const createUserSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email()),
  firstName: z.string().toLowerCase().trim(),
  lastName: z.string().toLowerCase().trim(),
  password: passwordSchema,
});

const registerSchema = z.object({
  body: createUserSchema,
});


//Login schema
const loginUserSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email()),
  password: passwordSchema,
});


export const loginSchema = z.object({
  body: loginUserSchema
});


//Forgot password schema
const forgotPassword = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email()),
});

export const forgotPasswordSchema = z.object({
  body: forgotPassword
});


//Reset password
const resetPassword = z.object({
  password: passwordSchema,
  token: z.string().regex(/^[0-9a-f]{64}$/),
});


export const resetPasswordSchema = z.object({
  body: resetPassword
});

export default registerSchema;
