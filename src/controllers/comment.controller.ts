import { Request, Response } from "express";
import CustomError from "../utils/errors";
import _ from "lodash";
import { Op } from "sequelize";
import Comment from "../models/comment.model";
import Article from "../models/article.model";
import { StatusCode } from "../utils/interfaces/status-codes";
import OutputResponse from "../utils/interfaces/outputResponse";
import { checkPermission } from "../utils/middlewares/auth";
export default class BlogController {
  static async createComment(req: Request, res: Response) {
    const { content } = req.body;
    const { id: articleID } = req.params;
    const isArticle = await Article.findOne({
      where: {
        articleID,
        state: "publish",
      },
    });
    if (!isArticle) {
      throw new CustomError.NotFoundError(
        `Article with id:${req.body.article} does not exist or has not been published`
      );
    }
    //@ts-ignore
    if (isArticle.user.toString() === req.user.userID.toString()) {
      throw new CustomError.BadRequestError(
        "You cannot write a comment on your article"
      );
    }
    req.body.content = content;
    //@ts-ignore
    req.body.user = req.user!.userID;
    req.body.articleID = articleID;
    const comment = await Comment.create(req.body);
    const output: OutputResponse = {
      message: "Comment Submitted",
      status: "success",
      data: comment,
    };
    res.status(StatusCode.CREATED).json(output);
  }
  static async singleComment(req: Request, res: Response) {
    const { id: commentID } = req.params;
    // Get Comment by Id
    const comment = await Comment.findByPk(commentID);
    if (!comment) {
      throw new CustomError.NotFoundError(
        `Comment with id:${commentID} not found`
      );
    }
    const output: OutputResponse = {
      message: `Comment with id:${commentID}`,
      status: "success",
      data: comment,
    };
    res.status(StatusCode.OK).json(output);
  }
  static async oneArticleComments(req: Request, res: Response) {
    const { article: articleID } = req.query;
    //@ts-ignore
    const comments = await Comment.findAll({ where: { articleID } });
    if (!comments) {
      throw new CustomError.NotFoundError("No comment is found");
    }
    const output: OutputResponse = {
      message: `Comments of article with id:${articleID}`,
      status: "success",
      data: comments,
    };
    res.status(StatusCode.OK).json(output);
  }
}
