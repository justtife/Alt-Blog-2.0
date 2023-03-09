import { Router } from "express";
const articleRouter = Router();
//Authentication Middleware
import { Auth, checkRole } from "../utils/middlewares/auth";
//Import blog controller
import BlogController from "../controllers/article.controller";
import upload from "../utils/utility/multer";
import validateResource from "../utils/middlewares/validate-resource";
import ArticleSchema from "../utils/schema/article.schema";
//Create Article Route
articleRouter.route("/create").post(
  //@ts-ignore
  [
    Auth,
    validateResource(ArticleSchema.createArticle()),
    upload.single("coverImage"),
  ],
  BlogController.createArticle
);
//User created Articles Route
articleRouter
  .route("/my-articles")
  .get(
    Auth,
    validateResource(ArticleSchema.getUserArticle()),
    BlogController.myArticles
  );
//All published articles Route
articleRouter.route("/all").get(BlogController.allArticles);
articleRouter
  .route("/:id")
  //Single Article Route
  .get(
    validateResource(ArticleSchema.getSingleArticle()),
    BlogController.readSingleArticle
  )
  //Publish Article
  .patch(
    Auth,
    validateResource(ArticleSchema.getSingleArticle()),
    BlogController.updateArticle
  )
  //Delete Article
  .delete(
    Auth,
    validateResource(ArticleSchema.getSingleArticle()),
    BlogController.deleteArticle
  );
//Edit Article
articleRouter
  .route("/:id/edit")
  .patch(
    Auth,
    validateResource(ArticleSchema.editArticle()),
    BlogController.editArticle
  );
articleRouter
  .route("/:id/lock")
  .patch(
    [
      Auth,
      validateResource(ArticleSchema.lockArticle()),
      checkRole("admin", "owner"),
      ArticleSchema.lockArticle,
    ],
    BlogController.lockArticle
  );
export default articleRouter;
