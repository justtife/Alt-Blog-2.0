import Joi, { ObjectSchema } from "joi";
import BadRequestError from "../errors/bad-request";
/**
 * @openapi
 * components:
 *  schemas:
 *    CreateUserInput:
 *      type: object
 *      required:
 *        - firstname
 *        - laststname
 *        - username
 *        - email
 *        - dateOfBirth
 *        - password
 *        - repeat_password
 *      properties:
 *        firstname:
 *          type: string
 *          default: John
 *        lastname:
 *          type: string
 *          default: Doe
 *        username:
 *          type: string
 *          default: John_Doe
 *        email:
 *          type: string
 *          default: testing1234@gmail.com
 *        dateOfBirth:
 *          type: string
 *          default: 2007-06-14
 *        phone:
 *          type: string
 *          default: +2348023456789
 *        password:
 *          type: string
 *          default: password1234
 *        repeat_password:
 *          type: string
 *          default: password1234
 *    CreateUserResponse:
 *      type: object
 *      properties:
 *        name:
 *          firstname:
 *            type: string
 *          lastname:
 *            type: string
 *          username:
 *            type: string
 *        email:
 *          type: string
 *        profilePic:
 *          type: string
 *        internationalFormat:
 *          type: string
 *        countryCode:
 *          type: string
 *        _id:
 *          type: string
 *        createdAt:
 *          type: string
 *    LogUserInput:
 *      type: object
 *      required:
 *        - user
 *        - password
 *      properties:
 *        user:
 *          type: string
 *          default: testing1234@gmail.com
 *        password:
 *          type: string
 *          default: password1234
 *    LogUserResponse:
 *      type: object
 *      properties:
 *        name:
 *          firstname:
 *            type: string
 *          lastname:
 *            type: string
 *          username:
 *            type: string
 *        email:
 *          type: string
 *        profilePic:
 *          type: string
 *        internationalFormat:
 *          type: string
 *        countryCode:
 *          type: string
 *        _id:
 *          type: string
 *        createdAt:
 *          type: string
 */
export default class UserSchema {
  static createUser(): ObjectSchema {
    return Joi.object({
      body: Joi.object({
        firstName: Joi.string()
          .min(3)
          .max(50)
          .required()
          .trim()
          .error(
            new BadRequestError(
              "First name field must be between 3 and 50 characters"
            )
          ),
        lastName: Joi.string()
          .min(3)
          .max(50)
          .required()
          .trim()
          .error(
            new BadRequestError(
              "Last name field must be between 3 and 50 characters"
            )
          ),
        userName: Joi.string()
          .min(3)
          .max(50)
          .required()
          .trim()
          .error(
            new BadRequestError(
              "User name field must be between 3 and 50 characters"
            )
          ),
        email: Joi.string()
          .email({ minDomainSegments: 2 })
          .required()
          .error(new BadRequestError("A valid email is required")),
        nationality: Joi.string()
          .min(3)
          .max(30)
          .error(
            new BadRequestError(
              "Nationality value should have a value between 3 and 30"
            )
          ),
        role: Joi.valid("admin", "user", "owner"),
        position: Joi.string(),
        password: Joi.string()
          .min(6)
          .trim()
          .pattern(new RegExp(/^[a-zA-Z0-9!@#$%&*]{3,25}$/))
          .required()
          .error(
            new BadRequestError(
              "Password is required and can only contain alphanumeric characters with [!@#$%&*]"
            )
          ),
        repeat_password: Joi.string()
          .required()
          .equal(Joi.ref("password"))
          .error(
            new BadRequestError("Passwords do not match with repeat password")
          ),
      }).with("password", "repeat_password"),
      query: Joi.object({}),
      params: Joi.object({}),
    });
  }
  static logUserIn(): ObjectSchema {
    return Joi.object({
      body: Joi.object({
        user: Joi.alternatives([
          Joi.string(),
          Joi.string().email({ minDomainSegments: 2 }),
        ])
          .required()
          .error(new BadRequestError("Enter a valid username or email")),
        password: Joi.string()
          .min(6)
          .trim()
          .pattern(new RegExp(/^[a-zA-Z0-9!@#$%&*]{3,25}$/))
          .required()
          .error(new BadRequestError("Enter a valid Password")),
      }),
      query: Joi.object({}),
      params: Joi.object({}),
    });
  }
  static sendResetPasswordMail(): ObjectSchema {
    return Joi.object({
      body: Joi.object({
        email: Joi.string()
          .email({ minDomainSegments: 2 })
          .required()
          .error(new BadRequestError("Enter a valid Email")),
      }),
      params: Joi.object({}),
      query: Joi.object({}),
    });
  }
  static verifyResetPassword(): ObjectSchema {
    return Joi.object({
      body: Joi.object({
        password: Joi.string()
          .trim()
          .min(6)
          .pattern(new RegExp(/^[a-zA-Z0-9!@#$%&*]{3,25}$/))
          .required()
          .error(
            new BadRequestError(
              "Enter your new Password, ensure it is a valid password(contain alphanumeric characters with [!@#$%&*])"
            )
          ),
      }),
      query: Joi.object({
        email: Joi.string()
          .email({ minDomainSegments: 2 })
          .required()
          .error(new BadRequestError("A valid email is required")),
        resetToken: Joi.string()
          .required()
          .error(new BadRequestError("Password Token not found")),
      }),
      params: Joi.object({}),
    });
  }
  static changePassword(): ObjectSchema {
    return Joi.object({
      body: Joi.object({
        oldPassword: Joi.string()
          .trim()
          .pattern(new RegExp(/^[a-zA-Z0-9!@#$%&*]{3,25}$/))
          .required()
          .min(6)
          .error(
            new BadRequestError(
              "Enter your old Password, ensure it is a valid password(contain alphanumeric characters with [!@#$%&*])"
            )
          ),
        newPassword: Joi.string()
          .trim()
          .pattern(new RegExp(/^[a-zA-Z0-9!@#$%&*]{3,25}$/))
          .required()
          .min(6)
          .error(
            new BadRequestError(
              "Enter a new Password, ensure it is a valid password(contain alphanumeric characters with [!@#$%&*])"
            )
          ),
        repeat_password: Joi.string()
          .required()
          .equal(Joi.ref("newPassword"))
          .error(
            new BadRequestError("Passwords do not match with the new password")
          ),
      }).with("newPassword", "repeat_password"),
      query: Joi.object({}),
      params: Joi.object({}),
    });
  }
  static updateUser(): ObjectSchema {
    return Joi.object({
      body: Joi.object({
        firstname: Joi.string()
          .min(3)
          .max(50)
          .required()
          .trim()
          .error(
            new BadRequestError(
              "First name field must be between 3 and 50 characters"
            )
          ),
        lastname: Joi.string()
          .min(3)
          .max(50)
          .required()
          .trim()
          .error(
            new BadRequestError(
              "Last name field must be between 3 and 50 characters"
            )
          ),
        username: Joi.string()
          .min(3)
          .max(50)
          .required()
          .trim()
          .error(
            new BadRequestError(
              "User name field must be between 3 and 50 characters"
            )
          ),
        nationality: Joi.string()
          .min(3)
          .max(30)
          .error(
            new BadRequestError(
              "Nationality value should have a value between 3 and 30"
            )
          ),
      }),
      params: Joi.object({ id: Joi.number().required() }),
      query: Joi.object({}),
    });
  }
  static deleteAccount(): ObjectSchema {
    return Joi.object({
      body: Joi.object({
        password: Joi.string()
          .trim()
          .pattern(new RegExp(/^[a-zA-Z0-9!@#$%&*]{3,25}$/))
          .required()
          .error(
            new BadRequestError(
              "Enter your Password, ensure it is a valid password(contain alphanumeric characters with [!@#$%&*])"
            )
          ),
      }),
      params: Joi.object({
        id: Joi.number()
          .required()
          .error(new BadRequestError("Enter a valid user id")),
      }),
      query: Joi.object({}),
    });
  }
  static changeRole(): ObjectSchema {
    return Joi.object({
      params: Joi.object({}),
      body: Joi.object({
        userID: Joi.number()
          .required()
          .error(new BadRequestError("Enter a valid user ID")),
        role: Joi.valid("admin", "owner", "user")
          .required()
          .error(new BadRequestError("Enter a valid user role")),
        position: Joi.string(),
      }),
      query: Joi.object({}),
    });
  }
  static useUserID(): ObjectSchema {
    return Joi.object({
      params: Joi.object({
        id: Joi.number()
          .required()
          .error(new BadRequestError("User ID is required")),
      }),
      body: Joi.object({}),
      query: Joi.object({}),
    });
  }
  static flagAccount(): ObjectSchema {
    return Joi.object({
      body: Joi.object({
        id: Joi.number()
          .required()
          .error(new BadRequestError("User ID is required")),
        flag: Joi.boolean().error(
          new BadRequestError("Invalid input for flag Item")
        ),
      }),
      params: Joi.object(),
      query: Joi.object({}),
    });
  }
}
