//Import dotenv and configure it
import * as dotenv from "dotenv";
dotenv.config();
//Import express async errors to handle async errors
import "express-async-errors";

import express, { Request, Response, NextFunction } from "express";
export const app = express();
import { version } from "../package.json";
import config from "./utils/config/config";

//Security Middlewares
import helmet from "helmet";
import cors from "cors";
import hpp from "hpp";
import rateLimit from "express-rate-limit";
import compression from "compression";
import { StatusCode } from "./utils/interfaces/status-codes";
import OutputResponse from "./utils/interfaces/outputResponse";
//Session and Cookie with storage
import session from "express-session";
import cookieParser from "cookie-parser";
const MySQLStore = require("express-mysql-session")(session);
import { sessionOptions } from "./utils/config/session-database-config";

//Passport Authentication
import passport from "passport";
import { PassportLoad } from "./utils/auth/passport";

//Initialize middlewares and security
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.disable("x-powered-by");
app.use(helmet());
app.use(hpp());
app.set("trust proxy", 1);
app.use(
  cors({
    origin: "*",
    credentials: true,
    exposedHeaders: ["set-cookie"],
    methods: ["GET", "PATCH", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(
  rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 50,
    handler: (req: Request, res: Response, next: NextFunction) => {
      const output: OutputResponse = {
        message: "Too Many Request, try again after ten minute",
        status: "failed",
      };
      res.status(StatusCode.TOO_MANY_REQUEST).json(output);
    },
  })
);
app.use(compression());

//Cloudinary configuration
import "./utils/config/cloudinaryConfig";

//Initialize session and cookie parser
app.use(cookieParser(config.JWT_SECRET));
let sessionStore = new MySQLStore(sessionOptions);
app.use(
  session({
    name: "blog.sid",
    secret: config.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      maxAge: 60 * 60 * 1000,
      signed: true,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    },
  })
);

//Configure and Initialize Passport
app.use(passport.initialize());
app.use(passport.session());
PassportLoad(passport);

// Logger
import * as expressWinston from "express-winston";
import logger from "./utils/logger/logger";
import log from "./utils/logger/log";
app.use(
  expressWinston.logger({
    winstonInstance: logger,
    statusLevels: true,
  })
);
//Log every requests with status and statusCode
app.use(log);

import CustomError from "./utils/errors";
//Server Test
app.get("/", (req, res) => {
  const output: OutputResponse = {
    message: "Hello World",
    status: "success",
    data: req.user,
  };
  res.status(200).json(output);
});
//Error Test
app.get("/error", (req, res) => {
  throw new CustomError.BadRequestError("This is a test error");
});

//Routes
import authRouter from "./routes/user.route";
app.use("/api/v1", authRouter);
import articleRouter from "./routes/article.route";
app.use("/api/v1/article", articleRouter);

//Swagger Documentation
import swaggerDocs from "./utils/documentation/swagger";
swaggerDocs(app, config.port);

//Import middlewares
import notFound from "./utils/middlewares/not-found";
import errorHandler from "./utils/middlewares/error-handler";
//Not Found Middleware
app.use(notFound);
//Error Handler Middleware
app.use(errorHandler);

//Import connectDB
import { connectDB } from "./utils/db/connect";
//Start Server
const start = async () => {
  if (process.env.NODE_ENV !== "test") {
    //Connect to DB
    await connectDB(<string>config.DB_HOST, <number>config.DB_PORT);
    //Start Server
    const server = app.listen(config.port, () => {
      logger.info(`Server ${version} is listening on port ${config.port}`);
    });
    //Server Error
    server.on("error", (error: Error) => {
      logger.error(`Error starting server: ${error.message}`);
      process.exit(1);
    });
  }
};
start();
