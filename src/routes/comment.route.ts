import { Router } from "express";
const commentRoute = Router();
//Import Comment Controller
import CommentController from "../controllers/comment.controller";
import { Auth } from "../utils/middlewares/auth";
import validateResource from "../utils/middlewares/validate-resource";
import CommentSchema from "../utils/schema/comment.schema";
commentRoute
  .route("/:id")
  //Get a single comment
  .get(
    validateResource(CommentSchema.getSingleComment()),
    CommentController.singleComment
  )
  //Create Comment
  .post(
    Auth,
    validateResource(CommentSchema.createComment()),
    CommentController.createComment
  );
//Get an articles comment
commentRoute
  .route("")
  .get(
    // validateResource(CommentSchema.articleComment()),
    CommentController.oneArticleComments
  );
export default commentRoute;
