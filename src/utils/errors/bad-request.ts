import CustomError from "./custom";
import { StatusCode } from "../interfaces/status-codes";
export default class BadRequestError extends CustomError {
  constructor(
    message: string,
    readonly statusCode: number = StatusCode.BAD_REQUEST
  ) {
    super(message, statusCode);
    this.message = message;
  }
}
