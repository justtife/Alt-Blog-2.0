import { Optional } from "sequelize";

export interface UserAttributes {
  userID: number;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
  role: string;
  enable: boolean;
  flag: boolean;
  position: string;
  image?: string;
  googleID?: string;
  nationality?: string;
  passwordResetToken?: string | null;
  passwordResetExpiry?: Date | null;
}

export interface UserCreationAttributes
  extends Optional<UserAttributes, "userID"> {}


