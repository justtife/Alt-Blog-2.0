import Joi, { ObjectSchema } from "joi";
import BadRequestError from "../errors/bad-request";
export default class CommentSchema {
  static createComment(): ObjectSchema {
    return Joi.object({
      body: Joi.object({
        content: Joi.string()
          .min(3)
          .max(50)
          .required()
          .trim()
          .error(
            new BadRequestError(
              "Title field must be between 3 and 50 characters"
            )
          ),
      }),
      query: Joi.object({}),
      params: Joi.object({
        id: Joi.number()
          .required()
          .error(new BadRequestError("Enter a valid article ID")),
      }),
    });
  }
  static getSingleComment(): ObjectSchema {
    return Joi.object({
      body: Joi.object({}),
      params: Joi.object({
        id: Joi.number()
          .required()
          .error(new BadRequestError("Enter a valid Comment ID")),
      }),
      query: Joi.object({}),
    });
  }
  static articleComment(): ObjectSchema {
    return Joi.object({
      body: Joi.object({}),
      query: Joi.object({
        article: Joi.string()
          .min(3)
          .error(new BadRequestError("Enter a valid article ID")),
      }),
      params: Joi.object({}),
    });
  }
}
