import env from "../env.js";


const isProd = env.nodeEnv === "production";

export const REFRESH_COOKIE = "refreshToken";

export const refreshCookieOptions = {
  httpOnly: true,
  sameSite: isProd ? ("none" as const) : ("lax" as const),
  secure: isProd,
  path: "/api/user/auth",
} as const;

export const REFRESH_MAX_AGE = 24 * 60 * 60 * 1000;