import { Request, Response, NextFunction } from "express";
import CustomError from "../errors/custom";
import { StatusCode } from "../interfaces/status-codes";
import OutputResponse from "../interfaces/outputResponse";
import logger from "../logger/logger";
const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let customError: Omit<OutputResponse, "status"> = {
    message: err.message,
    statusCode: err.statusCode,
  };
  //Different cases of errors
  switch (true) {
    //Duplicate Entry
    // case err.code === 11000 && err.name === "MongoServerError":
    //   customError.message = `Duplicate value: ${Object.values(
    //     err.keyValue
    //   )} exists, please enter another value`;
    //   customError.statusCode = StatusCode.CONFLICT;
    //   break;
    //MongoDB Validation Error
    // case err.name === "ValidationError":
    //   customError.message = `Invalid request; ${Object.values(err.errors)}`;
    //   customError.statusCode = StatusCode.BAD_REQUEST;
    //   break;
    //Error for Duplicate values of unique items
    // case err.name === "MongoError" && err.code === 11000:
    //   customError.message = `Duplicate value; The title: '${Object.values(
    //     err.keyValue
    //   )}' exists already`;
    //   customError.statusCode = StatusCode.BAD_REQUEST;
    //   break;
    //Invalid MongoDB ObjectID
    case err.name === "CastError":
      customError.message = `Invalid Mongo ObjectId`;
      customError.statusCode = StatusCode.BAD_REQUEST;
      break;
    case err.name === "TypeError":
      customError.message = "Type error";
      customError.statusCode = StatusCode.BAD_REQUEST;
      break;
    //Invalid country calling code
    // case err.name === "Error":
    //   customError.message = `${err.message}`;
    //   customError.statusCode = StatusCodes.BAD_REQUEST;
    //   break;
    //Other Errors
    default:
      customError.message =
        err.message || "An error occured, please try again later";
      customError.statusCode =
        err.statusCode || StatusCode.INTERNAL_SERVER_ERROR;
      break;
  }
  logger.error(err);
  console.log("------------------Error --------------------");
  console.log(err);
  console.log("------------------Error --------------------");
  const output: OutputResponse = {
    message: customError.message,
    status: "failed",
  };

  res.status(customError.statusCode).json(output);
};
export default errorHandler;
