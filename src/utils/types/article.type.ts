import { Optional } from "sequelize";

export interface ArticleAttributes {
  articleID?: number;
  title: string;
  description: string;
  user: number;
  state: "draft" | "publish";
  read_count?: number;
  reading_time?: number;
  tags?: string | string[];
  coverImage: string;
  content: string;
  locked?: boolean;
}

export interface ArticleCreationAttributes
  extends Optional<ArticleAttributes, "articleID"> {}
