import Token from "../../models/token.model";
import { TokenAttributes } from "../types/token.type";
import JWTService from "./jwt";
import { Request, Response } from "express";
import { UserAttributes } from "../types/user.type";
import crypto from "crypto-js";
interface TokenArgs {
  req: Request;
  res: Response;
  user: UserAttributes;
}
/**
 *
 * @param tokenArg
 * @returns
 */
const token = async (tokenArg: TokenArgs) => {
  //Destructure Token Args
  let { req, res, user } = tokenArg;
  let refreshToken;
  let accessToken;
  //Check for existing token
  //Verify the user has been logged in before
  const existingToken = <TokenAttributes>(
    await Token.findOne({ where: { user: user.userID } })
  );
  if (existingToken) {
    //Attach the existing token to cookies if there is an exsting token
    refreshToken = existingToken.refreshToken;
    accessToken = JWTService.attachCookiesToResponse(
      {
        res,
        refreshToken,
      },
      user
    );
    return accessToken;
  } else {
    //Number of byte
    const numBytes: number = 32;
    //If there is no existing token, create new token collection and attach to cookies
    // number of bytes to generate
    const randomBytes = crypto.lib.WordArray.random(numBytes);
    refreshToken = randomBytes.toString(crypto.enc.Hex);
    const userAgent = req.headers["user-agent"];
    const ip = req.ip;
    const newUserToken = { refreshToken, ip, userAgent, user: user.userID };
    await Token.create(newUserToken as TokenAttributes);
    return JWTService.attachCookiesToResponse(
      {
        res,
        refreshToken,
      },
      user
    );
  }
};
export default token;
