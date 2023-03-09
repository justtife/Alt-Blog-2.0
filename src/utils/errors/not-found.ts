import CustomError from "./custom";
import { StatusCode } from "../interfaces/status-codes";
export default class NotFoundError extends CustomError {
  constructor(message: string, readonly statusCode: number = StatusCode.NOT_FOUND) {
    super(message, statusCode);
    this.message = message;
  }
}
