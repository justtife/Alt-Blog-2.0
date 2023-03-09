import User from "../models/user.model";
import CustomError from "../utils/errors/custom";
import logger from "../utils/logger/logger";
import { UserAttributes } from "../utils/types/user.type";

export default class UserService {
  /**
   * Create a new user
   * @param userPayload
   * @returns
   */
  static createUser(
    userPayload: UserAttributes
  ): Promise<UserAttributes | CustomError | unknown> {
    return new Promise((resolve, reject) => {
      const createUser = User.build(userPayload);
      createUser
        .save()
        .then((user) => {
          resolve(user);
        })
        .catch((err) => {
          logger.error(err);
          reject(err);
        });
    });
  }
  /**
   *
   * @returns
   */
  static async getAllUser(): Promise<UserAttributes[] | any> {
    return new Promise((resolve, reject) => {
      User.findAll({
        where: { role: "user" },
      })
        .then((users) => {
          resolve(users);
        })
        .catch((err) => reject(err));
    });
  }
  /**
   *
   * @returns
   */
  static async getAllAdmin(): Promise<UserAttributes[] | null> {
    const admins = await User.findAll({
      where: { role: "admin" },
    });
    return admins;
  }
  /**
   *
   * @param userID
   * @returns
   */
  static async getSingleAdmin(userID: number): Promise<UserAttributes | null> {
    const admin = await User.findOne({
      where: { userID, role: "admin" },
    });
    return admin;
  }
  /**
   *
   * @param userID
   * @returns
   */
  static async getUserByID(userID: number) {
    const user = await User.findByPk(userID);
    return user;
  }
  /**
   *
   * @param email
   * @returns
   */
  static async getUserByEmail(email: string) {
    const user = await User.findOne({ where: { email } });
    return user;
  }
}
