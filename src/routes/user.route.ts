import { Request, Response, NextFunction, Router } from "express";
import CustomError from "../utils/errors/custom";
import OutputResponse from "../utils/interfaces/outputResponse";
import passport from "passport";
import _ from "lodash";
import UserController from "../controllers/user.controller";
import validateResource from "../utils/middlewares/validate-resource";
const authRouter = Router();
import upload from "../utils/utility/multer";
import UserSchema from "../utils/schema/user.schema";
import { UserAttributes } from "../utils/types/user.type";
import { StatusCode } from "../utils/interfaces/status-codes";
import token from "../utils/auth/createToken";
import { Auth, checkRole } from "../utils/middlewares/auth";
//SignIn
/**
 * @openapi
 * '/api/v1/signup':
 *  post:
 *     tags:
 *     - User
 *     summary: Register a user
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/CreateUserInput'
 *     responses:
 *      201:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CreateUserResponse'
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad request
 */
authRouter.post(
  "/signup",
  validateResource(UserSchema.createUser()),
  (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      "signup",
      function (err: CustomError, user: UserAttributes, info: any) {
        if (err) {
          return next(err); // will generate an error with status code 500
        }
        //If any Error, info about the Error is generated
        if (info) {
          let infoMessage: OutputResponse = {
            status: "failed",
            message: "Signup Failed",
            data: info.message,
          };
          return res.status(info.status).json(infoMessage);
        }
        //Log user in after signing up
        req.logIn(user, async (err) => {
          if (err) {
            return next(err);
          }
          let createToken = await token({ req, res, user });
          const output: OutputResponse = {
            status: "success",
            message: "Signup successful",
            token: createToken,
            data: _.omit(Object.values(user)[1], [
              "password",
              "role",
              "position",
              "enable",
              "flag",
              "googleID",
              "passwordResetToken",
              "passwordResetExpiry",
              "updatedAt",
              "__v",
            ]),
          };
          return res.status(StatusCode.CREATED).json(output);
        });
      }
    )(req, res, next);
  }
);
//Login Route
/**
 * @openapi
 * '/api/v1/login':
 *  post:
 *     tags:
 *     - User
 *     summary: Log a user in
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/LogUserInput'
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/LogUserResponse'
 *      400:
 *        description: Bad request
 */
authRouter.post(
  "/login",
  validateResource(UserSchema.logUserIn()),
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      "login",
      async (err: CustomError, user: UserAttributes, info: any) => {
        if (err) {
          return next(err);
        }
        if (info || !user) {
          let infoMessage: OutputResponse = {
            status: "failed",
            message: "Login Failed",
            data: info.message,
          };
          return res.status(info.status).json(infoMessage);
        }
        req.logIn(user, async (err) => {
          if (err) {
            return next(err);
          }
          let createToken = await token({ req, res, user });
          const output: OutputResponse = {
            status: "success",
            message: "Login successful",
            token: createToken,
            data: _.omit(Object.values(user)[1], [
              "password",
              "role",
              "position",
              "enable",
              "flag",
              "googleID",
              "passwordResetToken",
              "passwordResetExpiry",
              "updatedAt",
              "__v",
            ]),
          };
          return res.status(StatusCode.OK).json(output);
        });
      }
    )(req, res, next);
  }
);
// //Forgot Password
authRouter.post(
  "/forgot-password",
  validateResource(UserSchema.sendResetPasswordMail()),
  UserController.forgotPassword
);
// //Verify password token
authRouter.patch(
  "/verify-password",
  validateResource(UserSchema.verifyResetPassword()),
  UserController.validatePassword
);
authRouter.patch(
  "/change-password",
  Auth,
  validateResource(UserSchema.changePassword()),
  UserController.changePassword
);
// //Get all users
authRouter.get(
  "/profile/users",
  Auth,
  checkRole("admin", "owner"),
  UserController.getAllUsers
);
// Get User by user ID
authRouter
  .route("/user/:id")
  .get(
    validateResource(UserSchema.useUserID()),
    Auth,
    UserController.getUserByID
  )
  // Update User
  .patch(
    validateResource(UserSchema.updateUser()),
    Auth,
    upload.single("user"),
    UserController.updateProfile
  )
  //Delete Account
  .delete(
    validateResource(UserSchema.deleteAccount()),
    Auth,
    UserController.deleteAccount
  );
//Get a single admin
authRouter.get(
  "/admin/:id",
  Auth,
  validateResource(UserSchema.useUserID()),
  checkRole("owner", "admin"),
  UserController.getSingleAdmin
);
// //Make Admin
authRouter.patch(
  "/user/changeRole",
  validateResource(UserSchema.changeRole()),
  checkRole("owner"),
  UserController.changeRole
);
// //Logout Route
authRouter.get("/logout", Auth, UserController.logout);

// // Get all admins
authRouter.get(
  "/profile/admins",
  Auth,
  checkRole("owner"),
  UserController.getAllAdmin
);

// //Flag and Unflag Account
authRouter.post(
  "/flag",
  validateResource(UserSchema.flagAccount()),
  [Auth, checkRole("admin", "owner")],
  UserController.flagAccount
);

export default authRouter;
