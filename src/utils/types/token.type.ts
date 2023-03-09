import { Optional } from "sequelize";

export interface TokenAttributes {
  id: number;
  refreshToken: string;
  ip: string;
  userAgent: string;
  user: number;
}

export interface TokenCreationAttributes
  extends Optional<TokenAttributes, "id"> {}
