import { DataTypes, Model } from "sequelize";
import sequelizeConfig from "../utils/config/sequelize-config";
import Article from "./article.model";
import {
  CommentAttributes,
  CommentCreationAttributes,
} from "../utils/types/comment.type";

class Comment
  extends Model<CommentAttributes, CommentCreationAttributes>
  implements CommentAttributes
{
  commentID!: number;
  content!: string;
  user!: number;
  articleID!: number;
  readonly createdAt!: Date;
  readonly updatedAt!: Date;
}
Comment.init(
  {
    commentID: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    content: {
      type: DataTypes.TEXT,
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

    articleID: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: "articles",
        key: "articleID",
      },
    },
  },
  {
    sequelize: sequelizeConfig,
    tableName: "Comments",
  }
);

Comment.sync();

export default Comment;
