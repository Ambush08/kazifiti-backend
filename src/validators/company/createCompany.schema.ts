import { z } from "zod";
import { passwordSchema } from "../users/createUser.schema.js";

const createCompanySchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email()),
  firstName: z.string().trim(),
  lastName: z.string().trim(),
  password: passwordSchema,
  company: z.object({
    name: z.string().trim().min(2, 'Required'),
    location: z.string().trim(),
    industry: z.string().trim(),
    websiteUrl: z
        .string()
        .trim()
        .max(200)
        .optional()
        .transform((v) => v || undefined)
        .refine((v) => !v || /^https?:\/\/\S+$/i.test(v), "Enter a valid http(s) URL"),
    })
}).strict();


export const registerCompanySchema = z.object({
    body: createCompanySchema
});
