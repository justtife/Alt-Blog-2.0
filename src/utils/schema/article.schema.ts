import Joi, { ObjectSchema } from "joi";
import BadRequestError from "../errors/bad-request";
export default class ArticleSchema {
  static createArticle(): ObjectSchema {
    return Joi.object({
      body: Joi.object({
        title: Joi.string()
          .min(3)
          .max(50)
          .required()
          .trim()
          .error(
            new BadRequestError(
              "Title field must be between 3 and 50 characters"
            )
          ),
        description: Joi.string()
          .min(10)
          .max(255)
          .required()
          .trim()
          .error(
            new BadRequestError(
              "Description must be more between 10 and 255 characters in length"
            )
          ),
        content: Joi.string()
          .min(10)
          .required()
          .trim()
          .error(
            new BadRequestError(
              "Content field must be more than 10 characters in length"
            )
          ),
        tags: Joi.array().items(Joi.string()),
        state: Joi.valid("draft", "publish")
          .required()
          .error(
            new BadRequestError(
              'State field can only be "draft" or "publish" state'
            )
          ),
      }),
      query: Joi.object({}),
      params: Joi.object({}),
    });
  }
  static getSingleArticle(): ObjectSchema {
    return Joi.object({
      body: Joi.object({}),
      params: Joi.object({
        id: Joi.number()
          .required()
          .error(new BadRequestError("Article ID not found")),
      }),
      query: Joi.object({}),
    });
  }
  static queryArticle(): ObjectSchema {
    return Joi.object({
      body: Joi.object({}),
      query: Joi.object({
        search: Joi.string()
          .min(3)
          .error(new BadRequestError("Enter a valid search query")),
        read_count: Joi.valid(-1, 1).error(
          new BadRequestError(
            "Read count query can either have a value of -1 or 1"
          )
        ),
        reading_time: Joi.valid(-1, 1).error(
          new BadRequestError(
            "Reading time query can either have a value of -1 or 1"
          )
        ),
        createdAt: Joi.valid(-1, 1).error(
          new BadRequestError(
            "Created At query can either have a value of -1 or 1"
          )
        ),
      }),
      params: Joi.object({}),
    });
  }
  static editArticle(): ObjectSchema {
    return Joi.object({
      body: Joi.object({
        title: Joi.string()
          .min(3)
          .max(50)
          .required()
          .trim()
          .error(
            new BadRequestError(
              "Title field must be between 3 and 50 characters"
            )
          ),
        description: Joi.string()
          .min(10)
          .max(255)
          .required()
          .trim()
          .error(
            new BadRequestError(
              "Description must be more between 10 and 255 characters in length"
            )
          ),
        content: Joi.string()
          .min(10)
          .required()
          .trim()
          .error(
            new BadRequestError(
              "Content field must be more than 10 characters in length"
            )
          ),
        tags: Joi.array().items(Joi.string()),
      }),
      query: Joi.object({}),
      params: Joi.object({
        articleID: Joi.number()
          .min(6)
          .required()
          .error(new BadRequestError("Enter a valid article ID")),
      }),
    });
  }
  static lockArticle(): ObjectSchema {
    return Joi.object({
      body: Joi.object({
        lock: Joi.boolean()
          .required()
          .error(new BadRequestError("Lock value can only be true or false")),
      }),
      params: Joi.object({
        id: Joi.number()
          .min(6)
          .required()
          .error(new BadRequestError("Enter a valid article ID")),
      }),
      query: Joi.object({}),
    });
  }
}
