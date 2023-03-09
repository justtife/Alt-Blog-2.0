import CustomError from "../errors";
import { Request, Response, NextFunction } from "express";
import { UserAttributes } from "../types/user.type";
//Authentication Middleware
export const Auth = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    const user: UserAttributes | any = req.user;
    if (
      user.flag === true ||
      user.enable === false
    ) {
      throw new CustomError.UnauthorisedError(
        "Unauthorized to access this route, contact admin for further enquiries"
      );
    } else {
      return next();
    }
  } else {
    throw new CustomError.UnauthorisedError("Unauthenticated");
  }
};

export const checkRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user: UserAttributes | any = req.user;
    if (!roles.includes(user.role)) {
      throw new CustomError.UnauthorisedError(
        "Unauthorized to access this route"
      );
    }
    next();
  };
};

export const checkPermission = (
  requestUser: UserAttributes,
  resourceID: number
) => {
  if (requestUser.role === "admin") return;
  if (requestUser.userID.toString() === resourceID.toString()) return;
  throw new CustomError.UnauthorisedError(
    "You are unauthorised to access this route, ensure you are logged in"
  );
};
