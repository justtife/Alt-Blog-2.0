import Article from "../models/article.model";
import logger from "../utils/logger/logger";
import { ArticleAttributes } from "../utils/types/article.type";
import Comment from "../models/comment.model";


export default class ArticleService {
  /**
   * Create a new user
   * @param userPayload
   * @returns
   */
  static createArticle(userPayload: object | any): Promise<ArticleAttributes> {
    return new Promise((resolve, reject) => {
      console.log("Entered Here");
      const createArticle = Article.build(userPayload);
      createArticle
        .save()
        .then((article) => {
          resolve(article);
        })
        .catch((err) => {
          logger.error(err);
          reject(err);
        });
    });
  }
  static async getAllArticles(): Promise<ArticleAttributes[] | null> {
    const articles = await Article.findAll({
      where: { state: "publish" },
      order: [["createdAt", "DESC"]],
      include: {
        model: Comment,
        attributes: ["content", "user"],
      },
    });
    return articles;
  }
  static async getArticleByAuthor(
    userID: number
  ): Promise<ArticleAttributes | any> {
    const article = await Article.findAll({ where: { user: userID } });
    return article;
  }
  static async getArticleByTitle(title: string) {
    const article = await Article.findOne({ where: { title } });
    return article;
  }
  static async getArticleByID(
    articleID: number | any
  ): Promise<ArticleAttributes | any> {
    const article = await Article.findByPk(articleID);
    return article;
  }
  static async getPublishArticleByID(
    articleID: number | any
  ): Promise<ArticleAttributes | any> {
    const article = await Article.findOne({
      where: { articleID, state: "publish" },
      include: {
        model: Comment,
        attributes: ["content", "user"],
      },
    });
    return article;
  }
}
