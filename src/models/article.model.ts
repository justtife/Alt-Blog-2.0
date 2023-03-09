import { DataTypes, Model } from "sequelize";
import sequelizeConfig from "../utils/config/sequelize-config";
import {
  ArticleAttributes,
  ArticleCreationAttributes,
} from "../utils/types/article.type";

class Article
  extends Model<ArticleAttributes, ArticleCreationAttributes>
  implements ArticleAttributes
{
  articleID!: number;
  title!: string;
  description!: string;
  user!: number;
  state!: "draft" | "publish";
  read_count?: number;
  reading_time?: number;
  tags?: string | string[];
  coverImage!: string;
  content!: string;
  locked?: boolean;
  readonly createdAt!: Date;
  readonly updatedAt!: Date;
}

Article.init(
  {
    articleID: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
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
    state: {
      type: DataTypes.ENUM("draft", "publish"),
      defaultValue: "draft",
    },
    read_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    reading_time: DataTypes.INTEGER,
    tags: DataTypes.TEXT,
    coverImage: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: DataTypes.TEXT,
    locked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize: sequelizeConfig,
    tableName: "articles",
  }
);

Article.sync({ force: false });

export default Article;
