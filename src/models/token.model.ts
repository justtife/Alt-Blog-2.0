import { DataTypes, Model } from "sequelize";
import sequelizeConfig from "../utils/config/sequelize-config";
import User from "./user.model";
import {
  TokenAttributes,
  TokenCreationAttributes,
} from "../utils/types/token.type";

class Token
  extends Model<TokenAttributes, TokenCreationAttributes>
  implements TokenAttributes
{
  id!: number;
  refreshToken!: string;
  ip!: string;
  user!: number;
  userAgent!: string;
  readonly createdAt!: Date;
  readonly updatedAt!: Date;
}
Token.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    refreshToken: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ip: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: "Users",
        key: "userID",
      },
    },
    userAgent: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: sequelizeConfig,
    tableName: "tokens",
  }
);
// Token.hasOne(User)
Token.sync({ force: false });

export default Token;
