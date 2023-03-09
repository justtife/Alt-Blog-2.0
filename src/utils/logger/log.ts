import { Request, Response, NextFunction } from "express";
import logger from "./logger";
const log = (req: Request, res: Response, next: NextFunction) => {
  res.on("finish", () => {
    if (res.statusCode < 400) {
      logger.info(
        `${req.method} ${req.originalUrl} ${res.statusCode} ${res.statusMessage}`
      );
    } else if (res.statusCode >= 400 && res.statusCode < 500) {
      logger.warn(
        `${req.method} ${req.originalUrl} ${res.statusCode} ${res.statusMessage}`
      );
    } else {
      logger.error(
        `${req.method} ${req.originalUrl} ${res.statusCode} ${res.statusMessage}`
      );
    }
  });
  next();
};
export default log;
