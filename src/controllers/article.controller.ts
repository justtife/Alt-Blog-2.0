import { Request, Response } from "express";
import { saveImage, deleteImage } from "../utils/utility/cloudinary";
import CustomError from "../utils/errors";
import ArticleService from "../services/article.service";
import _ from "lodash";
import { Op } from "sequelize";
import Article from "../models/article.model";
import { StatusCode } from "../utils/interfaces/status-codes";
import OutputResponse from "../utils/interfaces/outputResponse";
import { checkPermission } from "../utils/middlewares/auth";
import BadRequestError from "../utils/errors/bad-request";
export default class BlogController {
  //Create Article
  static async createArticle(req: Request, res: Response) {
    const { title, description, tags, content, state } = req.body;
    const checkTitle = await ArticleService.getArticleByTitle(title);
    if (checkTitle) {
      throw new CustomError.BadRequestError(
        `Article with title ${title} exists, please change title`
      );
    }
    let coverImage;
    if (req.file) {
      coverImage = await saveImage(
        req.file.path,
        "article_coverImages",
        //@ts-ignore
        `${req.user.userID}_${title}`
      );
    }
    //Calculate Average Reading Time
    //Average Reading time is 238words per minute
    const numOfWords = content.split(" ").length;
    let wordsperminute = 238;
    let reading_time = Math.ceil(numOfWords / wordsperminute);
    //@ts-ignore
    let author = req.user?.userID;
    //Save article to database
    const articleData = {
      title,
      description,
      author,
      state,
      reading_time,
      tags,
      coverImage,
      content,
    };
    //Create Article
    const article = await ArticleService.createArticle(articleData);
    const output: OutputResponse = {
      message: "Article created successfully",
      status: "success",
      data: _.omit(Object.values(article)[1], ["updatedAt"]),
    };
    res.status(StatusCode.CREATED).json(output);
  }
  //List of Authors article
  static async myArticles(req: Request, res: Response) {
    const { id: userID } = req.body;
    const article = await ArticleService.getArticleByAuthor(userID);
    if (!article) {
      throw new CustomError.BadRequestError("No article exists");
    }
    const output: OutputResponse = {
      message: `User ${userID} Articles`,
      status: "success",
      data: article,
    };
    res.status(StatusCode.OK).json(output);
  }
  // // Single Article
  static async readSingleArticle(req: Request, res: Response) {
    const { id: bookID } = req.params;
    const article = await ArticleService.getArticleByID(bookID);
    if (!article) {
      throw new CustomError.NotFoundError(
        `Article with id: ${bookID} does not exist`
      );
    }
    const output: OutputResponse = {
      message: `Article ${bookID}`,
      status: "success",
      data: article,
    };
    res.status(StatusCode.OK).json(output);
  }
  // //Get all articles
  static async allArticles(req: Request, res: Response) {
    const articles = await ArticleService.getAllArticles();
    if (!articles) {
      throw new CustomError.NotFoundError("No article has been published");
    }
    const output: OutputResponse = {
      message: "All articles",
      status: "success",
      data: articles,
    };
    res.status(StatusCode.OK).json(output);
  }
  // //Update/Publish article
  static async updateArticle(req: Request, res: Response) {
    const ArticleID: unknown = req.params.id;
    let article = await ArticleService.getArticleByID(ArticleID as number);
    if (!article) {
      throw new CustomError.NotFoundError(
        `Article with id:${ArticleID} deos not exist`
      );
    }
    checkPermission(req.user as any, article.user);
    //   //Check if article has been published already
    if (article.state == "publish") {
      const output: OutputResponse = {
        message: "Article has been published already",
        status: "success",
      };
      return res.status(StatusCode.OK).json(output);
    }
    article.state = "publish";
    await article.save();
    res.status(StatusCode.NO_CONTENT).json();
  }
  // //Edit Article
  static async editArticle(req: Request, res: Response) {
    const { id: bookID } = req.params;
    const { title, description, tags, content } = req.body;
    //
    const checkTitle = await Article.findOne({
      where: {
        articleID: { [Op.ne]: bookID },
        title: title,
      },
    });
    //   //if a new title if passed to the body,
    //   //Check if the title exist in other articles to prevent duplicate
    if (checkTitle) {
      throw new CustomError.BadRequestError(
        "Title already exist, please use another title"
      );
    }
    let article = await ArticleService.getArticleByID(bookID);
    checkPermission(req.user as any, article.author);
    //   //Calculate new reading time
    const numOfWords = content.split(" ").length;
    var wordsperminute = 238;
    var reading_time = Math.ceil(numOfWords / wordsperminute);
    //   //Save Article
    article.title = title;
    article.description = description;
    article.tags = tags;
    article.content = content;
    article.reading_time = reading_time;
    await article.save();
    res.status(StatusCode.NO_CONTENT).json();
  }
  // //Lock Article
  static async lockArticle(req: Request, res: Response) {
    const { lock } = req.body;
    const { id: articleId } = req.params;
    const article = await Article.findOne({
      where: { state: "publish", articleID: articleId },
    });
    if (!article) {
      throw new CustomError.NotFoundError("Invalid Article");
    }
    if (lock === article.locked) {
      throw new BadRequestError(`Cannot perform operation; lock: ${lock}`);
    }
    article.locked = lock;
    await article.save();
    const output: OutputResponse = {
      message: `Article Updated; lock: ${lock}`,
      status: "success",
    };
    res.status(StatusCode.OK).json(output);
  }
  // //Delete Article
  static async deleteArticle(req: Request, res: Response) {
    const { id: bookID } = req.params;
    let article = await ArticleService.getArticleByID(bookID);
    checkPermission(req.user as any, article.user);
    await article.remove();
    //   //Send mail to user
    res.status(StatusCode.NO_CONTENT).json();
  }
}
