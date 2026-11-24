import pino from "pino";
import env from "../env.js";
import { pinoHttp } from "pino-http";
import crypto from "crypto";

const isDev = env.nodeEnv !== "production";

type HttpError = Error & {
  code?: string;
  status?: number;
  statusCode?: number;
  type?: string;
  body?: unknown;
};

const safeErr = (err: unknown) => {
  if (!(err instanceof Error)) return { type: typeof err };

  const e = err as HttpError;
  const base = {
    name: e.name,
    code: e.code,
    status: e.status ?? e.statusCode,
    errType: e.type,
  };

  // body-parser errors: message and stack can echo the body, so use fixed text
  const isBodyError = "body" in e || e.type?.startsWith("entity.");
  if (isBodyError) {
    return { ...base, message: "Request body could not be parsed" };
  }

  return { ...base, message: e.message, stack: e.stack };
};

export const logger = pino({
  level: env.logLevel,
  serializers: { err: safeErr },
  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.cookie",
      'res.headers["set-cookie"]',
      "req.body.password",
      "req.body.token",
      "req.body.refreshToken",
      "err.config.headers.Authorization",
      "err.config.headers.authorization",
      "err.config.auth",
      "err.config.data",
      "err.config.params",
      "err.body",
      "err.config",
      "err.request",
      "err.response",
    ],
    censor: "[REDACTED]",
  },
  ...(isDev && {
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "SYS:standard",
        ignore: "pid,hostname",
      },
    },
  }),
});

const SAFE_ID = /^[\w-]{8,64}$/;

export const httpLogger = pinoHttp({
  logger,
  wrapSerializers: false,
  genReqId: (req, res) => {
    const header = req.headers["x-request-id"];
    const incoming = Array.isArray(header) ? header[0] : header;
    const id =
      incoming && SAFE_ID.test(incoming) ? incoming : crypto.randomUUID();
    res.setHeader("X-Request-Id", id);
    return id;
  },

  serializers: {
    err: safeErr,
    // Drop query strings from the logs
    req: (req) => ({
      id: req.id,
      method: req.method,
      path: req.url?.split("?")[0],
    }),
    res: (res) => ({ statusCode: res.statusCode }),
  },

  customLogLevel: (_req, res, err) => {
    if (res.statusCode >= 500 || err) return "error";
    if (res.statusCode >= 400) return "warn";
    return "info";
  },
});
