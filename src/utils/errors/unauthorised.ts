import CustomError from "./custom";
import { StatusCode } from "../interfaces/status-codes";
export default class UnauthorisedError extends CustomError {
  constructor(message: string, readonly statusCode: number = StatusCode.UNAUTHORIZED) {
    super(message, statusCode);
    this.message = message;
  }
}
