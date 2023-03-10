import { Optional } from "sequelize";

export interface CommentAttributes {
  commentID?: number;
  content: string;
  user: number;
  articleID: number;
}

export interface CommentCreationAttributes
  extends Optional<CommentAttributes, "commentID"> {}
