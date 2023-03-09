import { Request, Response } from "express";
import { saveImage, deleteImage } from "../utils/utility/cloudinary";
import Token from "../models/token.model";
import CustomError from "../utils/errors";
import UserService from "../services/user.service";
import { StatusCode } from "../utils/interfaces/status-codes";
import OutputResponse from "../utils/interfaces/outputResponse";
import MailService from "../utils/utility/mail/send-mail";
import { checkPermission } from "../utils/middlewares/auth";
import BadRequestError from "../utils/errors/bad-request";
import { UserAttributes } from "../utils/types/user.type";
import _ from "lodash";
const sendMail = new MailService();
export default class UserController {
  //Forgot Password Controller
  static async forgotPassword(req: Request, res: Response) {
    const { email } = req.body;
    const user = await UserService.getUserByEmail(email);
    if (!user) {
      throw new CustomError.NotFoundError("User does not exist");
    }
    let resendPassword = await user.sendResetPasswordMail();
    await sendMail.resetPasswordMail(
      user.email,
      user.firstName,
      resendPassword.toString()
    );
    const output: OutputResponse = {
      message: "Password reset mail has been sent",
      status: "success",
      token: resendPassword.toString(),
      email: "sent",
    };
    res.status(StatusCode.OK).json(output);
  }
  //Set new Password
  static async validatePassword(req: Request, res: Response) {
    const { email, resetToken } = req.query;
    const { password } = req.body;
    const user = await UserService.getUserByEmail(<string>email);
    if (!user) {
      throw new CustomError.NotFoundError("User does not exist");
    }
    await user.validateResetPasswordToken(<string>resetToken, password);
    await sendMail.passwordChanged(<string>email, user.firstName);
    const output: OutputResponse = {
      message: "Password has been changed successfully, proceed to login",
      status: "success",
      email: "sent",
    };
    res.status(StatusCode.OK).json(output);
  }
  //Change Password
  static async changePassword(req: Request, res: Response) {
    const { oldPassword, newPassword } = req.body;
    //@ts-ignore
    const user = await UserService.getUserByID(req.user?.userID as number);
    if (!user) {
      throw new CustomError.NotFoundError("No account with user details");
    }
    if (!user.password) {
      //Redirect user to create password link
      return res.redirect("http://localhost:4321/api/v1/forgot-password");
    }
    const isPasswordValid = await user.isValidPassword(oldPassword);
    if (!isPasswordValid) {
      throw new CustomError.UnauthorisedError(
        "Please ensure the old password is correct"
      );
    }
    user.password = newPassword;
    await user.save();
    await sendMail.passwordChanged(user.email, user.firstName);
    res.status(StatusCode.NO_CONTENT).json();
  }
  static async getAllUsers(req: Request, res: Response) {
    const users = await UserService.getAllUser();
    if (!users) {
      throw new CustomError.NotFoundError("No user was found");
    }
    const output: OutputResponse = {
      message: "All Users",
      status: "success",
      data: users,
    };
    res.status(StatusCode.OK).json(output);
  }
  static async getUserByID(req: Request, res: Response) {
    const UserID = req.params.id as unknown;
    const user = await UserService.getUserByID(UserID as number);
    if (!user) {
      throw new CustomError.NotFoundError(
        `User with id: ${req.params.id} does not exist`
      );
    }
    checkPermission(req.user as any, UserID as number);
    const output: OutputResponse = {
      message: `User ${UserID} profile`,
      status: "success",
      data: user,
    };
    res.status(StatusCode.OK).json(output);
  }
  static async updateProfile(req: Request, res: Response) {
    const { firstname, lastname, username, nationality } = req.body;
    const UserID = req.params.id as unknown;
    const user = await UserService.getUserByID(UserID as number);
    if (!user) {
      throw new CustomError.NotFoundError(
        `User account with id: ${UserID} was not found`
      );
    }
    checkPermission(req.user as any, UserID as number);
    if (req.file) {
      //Delete Previous image
      await deleteImage(<string>user.image);
      user.image = await saveImage(
        req.file.path,
        "altblog_user",
        `updated_${user.email}`
      );
    }
    user.firstName = firstname;
    user.lastName = lastname;
    user.userName = username;
    user.nationality = nationality;
    await user.save();
    res.status(StatusCode.NO_CONTENT).json();
  }
  //Delete Controller
  static async deleteAccount(req: Request, res: Response) {
    const { password } = req.body;
    const UserID = req.params.id as unknown;
    const user = await UserService.getUserByID(UserID as number);
    if (!user) {
      throw new CustomError.NotFoundError("Account does not exist");
    }
    checkPermission(req.user as any, UserID as number);
    const isPasswordValid = await user.isValidPassword(password);
    if (!isPasswordValid) {
      throw new CustomError.UnauthorisedError(
        "Unauthorized to perform operation"
      );
    }
    await deleteImage(<string>user.image);

    const token = await Token.findOne({ where: { user: user.userID } });
    await token?.destroy();
    res.cookie("accessToken", "account deleted", {
      httpOnly: true,
      expires: new Date(Date.now()),
    });
    res.cookie("refreshToken", "account deleted", {
      httpOnly: true,
      expires: new Date(Date.now()),
    });
    await user.destroy();
    await sendMail.goodBye(user.email, user.firstName);
    res.status(StatusCode.NO_CONTENT).json();
  }
  static async getSingleAdmin(req: Request, res: Response) {
    const AdminID = req.params.id as unknown;
    const admin = await UserService.getSingleAdmin(AdminID as number);
    if (!admin) {
      throw new CustomError.NotFoundError(
        `Admin with id: ${req.params.id} does not exist`
      );
    }
    const output: OutputResponse = {
      message: `Admin ${AdminID} profile`,
      status: "success",
      data: admin,
    };
    res.status(StatusCode.OK).json(output);
  }

  static async changeRole(req: Request, res: Response) {
    const { userID, role } = req.body;
    const user: any = await UserService.getUserByID(userID);
    user.accountStatus.role = role;
    await user.save();
    const output: OutputResponse = {
      message: `User is now a/an ${role}`,
      status: "success",
    };
    res.status(StatusCode.OK).json(output);
  }
  static async logout(req: Request, res: Response) {
    // Delete existing user token in database
    //@ts-ignore
    const token = await Token.findOne({ where: { user: req.user?.userID } });
    if (!token) {
      throw new CustomError.BadRequestError("User not logged in");
    }
    await token.destroy();
    //Change  Access token cookie and expire
    res.cookie("accessToken", "logout", {
      httpOnly: true,
      expires: new Date(Date.now()),
    });
    //Change refresh token cookie and expire
    res.cookie("refreshToken", "logout", {
      httpOnly: true,
      expires: new Date(Date.now()),
    });
    const output: OutputResponse = {
      message: "User Logged out",
      status: "success",
    };
    res.status(StatusCode.OK).json(output);
  }
  static async getAllAdmin(req: Request, res: Response) {
    const admin = await UserService.getAllAdmin();
    if (!admin) {
      throw new CustomError.NotFoundError("No admin exists yet");
    }
    const output: OutputResponse = {
      message: "All Admins",
      status: "success",
      data: admin,
    };
    res.status(StatusCode.OK).json(output);
  }
  // Flag Account
  static async flagAccount(req: Request, res: Response) {
    const { id, flag } = req.body;
    const user = await UserService.getUserByID(id);
    if (!user) {
      throw new CustomError.NotFoundError("User does not exist");
    }
    if (user.flag === flag) {
      throw new BadRequestError(`Acount flag status:${flag}`);
    }
    user.flag = flag;
    await user.save();
    // Flag account mail
    if (flag === true) {
      await sendMail.flagAccount(user.email, user.firstName);
    } else {
      await sendMail.unflagAccount(user.email, user.firstName);
    }
    const output: OutputResponse = {
      message: `User Account ${id} successfully updated`,
      status: "success",
    };
    res.status(StatusCode.OK).json(output);
  }
}
