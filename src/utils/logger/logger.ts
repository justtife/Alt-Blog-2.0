import { createLogger, format, transports } from "winston";
const { combine, timestamp, label, printf, metadata, colorize } = format;
import path from "path";
import config from "../config/config";

import SlackTransport from "winston-slack-webhook-transport";
//Logger output Format for file(error messages)
const logFormat = printf(({ level, label, timestamp, ...meta }) => {
  return `[${level}] ${timestamp} ${label}: ${JSON.stringify(meta)}`;
});
//Logger output Format for console(info,warn,error messages)
const consoleFormat = printf(({ level, label, timestamp, message }) => {
  return `[${level}] ${timestamp} ${label}: ${message}`;
});
const logger = createLogger({
  transports: [
    new transports.Console({
      format: combine(
        colorize({ all: <boolean>false, level: <boolean>true }),
        consoleFormat
      ),
    }),
    //File - Log error
    // new transports.File({
    //   level: "info" as string,
    //   filename: path.join(__dirname, "logger.log") as string,
    //   format: logFormat,
    // }),
    new SlackTransport({
      webhookUrl: <string>config.SLACK_WEBHOOK_URL,
      channel: "server" as string,
      username: "F&F-Server" as string,
      level: "error" as string,
      iconEmoji: ":robot:",
      formatter: (info) => ({
        text: <string>(
          `${info.timestamp}\n*[${info.level.toUpperCase()}]:*\n>${
            info.message
          }`
        ),
        attachments: [
          {
            text: `${JSON.stringify(info.metadata)}`,
          },
        ],
      }),
    }),
  ],
  format: combine(
    label({ label: "Alt-Blog-Logger" }),
    timestamp({ format: "YY-MM-DD HH:mm:ss" }),
    metadata({ fillExcept: ["message", "level", "timestamp", "label"] }),
    logFormat
  ),
});

export default logger;
