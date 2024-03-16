/** @format */

// logger.ts
import { NextFunction, Request, Response } from "express"; // Add this line

import winston, { Logger, format } from "winston";

const { combine, timestamp, printf } = format;

const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

const logger: Logger = winston.createLogger({
  level: "info",
  format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), logFormat),
  transports: [new winston.transports.File({ filename: "logs.log" })],
});

export default logger;

export const logAPICall = (req: Request, res: Response, next: NextFunction) => {
  const { method, url, body, params, query, headers } = req;

  logger.info(
    `API Call - Method: ${method}, URL: ${url}, Body: ${JSON.stringify(
      body
    )}, Params: ${JSON.stringify(params)}, Query: ${JSON.stringify(
      query
    )}, Headers: ${JSON.stringify(headers)}`
  );

  next();
};
