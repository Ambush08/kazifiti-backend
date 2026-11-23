import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();


const schema = z.object({
  PORT: z.coerce.number().default(4003),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  APP_URL: z.string().url(),
  CLIENT_URL: z.string().url(),
  DATABASE_URL: z.string().min(1),
  FROM: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_EMAIL_VERIFY_SECRET: z.string().min(32),
  CONSUMER_KEY: z.string().min(1),
  CONSUMER_SECRET: z.string().min(1),
  MPESA_PASSKEY: z.string().min(1),
  BUSINESS_SHORTCODE: z.string().min(1),
  RESEND_API_KEY: z.string().min(1),
  NGROK_AUTHTOKEN: z.string().optional(), // development only
  LOG_LEVEL: z.string().min(1),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables:", parsed.error.flatten().fieldErrors);
  process.exit(1);
}

const variable = parsed.data;


const env = {
    port: variable.PORT,
    appUrl: variable.APP_URL,
    databaseUrl: variable.DATABASE_URL,
    clientUrl: variable.CLIENT_URL,
    nodeEnv: variable.NODE_ENV,
    from: variable.FROM,
    jwtaccessSecret: variable.JWT_ACCESS_SECRET, 
    jwtRefreshSecret: variable.JWT_REFRESH_SECRET,
    jwtEmailVerify: variable.JWT_EMAIL_VERIFY_SECRET,
    consumerKey: variable.CONSUMER_KEY,
    consumerSecret: variable.CONSUMER_SECRET,
    mpesaPasskey: variable.MPESA_PASSKEY,
    businessShortcode: variable.BUSINESS_SHORTCODE,
    resendApi:variable.RESEND_API_KEY,
    ngrokAuthToken: variable.NGROK_AUTHTOKEN,
    logLevel: variable.LOG_LEVEL 
};



export default env;
