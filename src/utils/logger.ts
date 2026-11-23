import pino from "pino";
import env from "../env.js";
import { pinoHttp } from "pino-http";
import crypto from 'crypto'

const isDev = env.nodeEnv !== "production";

export const logger = pino({
  level: env.logLevel,
  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.cookie",
      'res.headers["set-cookie"]',
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

export const httpLoger = pinoHttp({
  logger,

  // Reuse incoming X-Request-Id header or generate a unique UUID for tracing
  genReqId: (req, res) => {
    const existingId = req.id ?? req.headers["x-request-id"];

    if (existingId) return existingId;
    const id = crypto.randomUUID();
    res.setHeader("X-Request-Id", id);
    return id;
  },

  // Dynamically set log level based on response status code
  customLogLevel: (req, res, err) => {
    if (res.statusCode >= 500 || err) return "error";
    if (res.statusCode >= 400) return "warn";
    return "info";
  },
});
