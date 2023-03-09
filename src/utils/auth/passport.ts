import { PassportStatic } from "passport";
import { Op } from "sequelize";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JWTStrategy } from "passport-jwt";
import User from "../../models/user.model";
import logger from "../logger/logger";
import { UserAttributes } from "../types/user.type";
import { Request } from "express";
import { StatusCode } from "../interfaces/status-codes";
import UserService from "../../services/user.service";
import { saveImage } from "../utility/cloudinary";
import generateDefaultProfilePic from "../utility/imageGenerator";
import MailService from "../utility/mail/send-mail";
import _ from "lodash";
/**
 * 
 * @param passport 
 */
export function PassportLoad(passport: PassportStatic) {
  //SIGN UP STRATEGY
  passport.use(
    "signup",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        session: true,
        passReqToCallback: true,
      },
      (req: Request, email: string, password: string, done: Function): void => {
        process.nextTick(async () => {
          User.findOne({ where: { email } })
            .then(async (user) => {
              //Check If Email exists
              if (user) {
                return done(null, false, {
                  message: `User with mail ${email} exists already`,
                  status: StatusCode.CONFLICT,
                });
              } else {
                //generateDefaultProfilePic
                let name = req.body.firstName + " " + req.body.lastName;
                let generateImage = generateDefaultProfilePic(name);
                //Save to cloudinary
                let imageDB = await saveImage(
                  generateImage,
                  "altblog_user",
                  `default_${email}`
                );
                let newUser: UserAttributes = {
                  ...req.body,
                  image: imageDB.secure_url,
                  email,
                  password,
                };
                let result = await UserService.createUser(newUser);
                const sendMail = new MailService();
                sendMail.sendWelcomeMail(email, req.body.firstName);
                done(null, result);
              }
            })
            .catch((err) => {
              logger.error(err);
              done(err, false, { message: `An error Occured; ${err}` });
            });
        });
      }
    )
  );
  //LOGIN STRATEGY
  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "user",
        passwordField: "password",
      },
      async (user: string, password: string, done: Function): Promise<void> => {
        //Find User in the database using the email or username field
        const userDetail = await User.findOne({
          where: {
            [Op.or]: [{ email: user }, { userName: user }],
          },
        });
        //If user does not exist, throw not found error
        if (!userDetail) {
          return done(null, false, {
            message: "User does not exist, please sign up",
            status: StatusCode.NOT_FOUND,
          });
        } else {
          const checkPass = await userDetail.isValidPassword(password);
          //Throw error if password is not valid
          if (!checkPass) {
            return done(null, false, {
              message:
                "Invalid Credentials, please ensure login details are correct",
              status: StatusCode.BAD_REQUEST,
            });
          }
          done(null, userDetail);
        }
      }
    )
  );

  //Cookie Extractor
  let cookieExtractor = function (req: Request): string {
    let token: any = null;
    //Check for signed cookies in response
    if (req && req.signedCookies) {
      token =
        req.signedCookies["accessToken"] || req.signedCookies["refreshToken"];
    }
    return token;
  };
  //JWT Strategy
  passport.use(
    "jwt",
    new JWTStrategy(
      {
        secretOrKey: process.env.JWT_SECRET,
        jwtFromRequest: cookieExtractor,
      },
      async function (jwt_payload: any, done: Function) {
        //Check if the user is saved in token exist in database
        const user = <UserAttributes>(
          await User.findOne({ where: { userID: jwt_payload.user.userID } })
        );
        //If the user does not exist, throw not logged in user
        if (!user) {
          done(null, false, { message: "No logged In User, please login" });
        }
        done(null, user);
      }
    )
  );
  //Serialize User
  passport.serializeUser<any, any>(
    (req: Request, user: any, done: Function): void => {
      done(null, user.userID);
    }
  );
  //Deserialize User
  passport.deserializeUser<any>((userID, done: Function): void => {
    User.findByPk(userID)
      .then((user) => {
        done(null, user);
      })
      .catch((err) => {
        logger.error(err);
        done(err);
      });
    // done(null, user);
  });
}
