import { DataTypes, Model } from "sequelize";
import sequelizeConfig from "../utils/config/sequelize-config";
import bcrypt from "bcrypt";
import crypto from "crypto-js";
import CustomError from "../utils/errors";
import {
  UserAttributes,
  UserCreationAttributes,
} from "../utils/types/user.type";

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  userID!: number;
  firstName!: string;
  lastName!: string;
  userName!: string;
  email!: string;
  password!: string;
  role!: string;
  enable!: boolean;
  position!: string;
  flag!: boolean;
  image?: string;
  googleID?: string;
  nationality?: string;
  passwordResetToken?: string | null;
  passwordResetExpiry?: Date | null;
  readonly createdAt!: Date;
  readonly updatedAt!: Date;
  async isValidPassword(password: string): Promise<Error | boolean> {
    return await bcrypt.compare(password, this.password);
  }
  async sendResetPasswordMail(): Promise<string> {
    const fiveMinutes = 5 * 60 * 1000;
    //Check if a token exists and if it does not expire in less than five minutes
    if (
      this.passwordResetToken &&
      <Date>this.passwordResetExpiry > new Date(Date.now() + fiveMinutes)
    ) {
      return this.passwordResetToken;
    } else {
      const randomBytes = crypto.lib.WordArray.random(15);
      const password = crypto.enc.Base64.stringify(randomBytes);
      const resetPasswordToken = password
        .replace(/\//g, "_")
        .replace(/\+/g, "-");
      const fifteenMinutes = 15 * 60 * 1000;
      this.passwordResetToken = resetPasswordToken;
      this.passwordResetExpiry = new Date(Date.now() + fifteenMinutes);
      await this.save();
      //Send Mail
      return resetPasswordToken;
    }
  }
  async validateResetPasswordToken(
    resetToken: string,
    newPassword: string
  ): Promise<void | Error> {
    //Check if the password token is the same with the one in the user's collection detail
    if (
      this.passwordResetToken === resetToken &&
      <Date>this.passwordResetExpiry > new Date(Date.now())
    ) {
      this.password = newPassword;
      this.passwordResetToken = null;
      this.passwordResetExpiry = null;
      await this.save();
      return;
    } else {
      throw new CustomError.BadRequestError("Invalid request token");
    }
  }
}
User.init(
  {
    userID: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    userName: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(128),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("user", "admin", "owner"),
      defaultValue: "user",
    },
    enable: { type: DataTypes.BOOLEAN, defaultValue: true },
    position: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    flag: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    googleID: {
      type: DataTypes.STRING(128),
      allowNull: true,
      unique: true,
    },
    image: {
      type: DataTypes.STRING(256),
      allowNull: true,
    },
    nationality: {
      type: DataTypes.STRING(128),
      allowNull: true,
    },
    passwordResetToken: {
      type: DataTypes.STRING(256),
      allowNull: true,
    },
    passwordResetExpiry: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    hooks: {
      beforeSave: async (user) => {
        if (user.changed("password")) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
    sequelize: sequelizeConfig,
    tableName: "Users",
  }
);
User.sync();

export default User;
