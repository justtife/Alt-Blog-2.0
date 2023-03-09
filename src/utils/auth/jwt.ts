import { sign } from "jsonwebtoken";
import { UserAttributes } from "../types/user.type";
import config from "../config/config";
import { Payload, AttachCookiesToResponse } from "../interfaces/jwt-interface";

class JWTService {
  /**
   *
   * @param user
   * @returns
   */
  static tokenUser(user: UserAttributes): object {
    return {
      name: user.firstName,
      userID: user.userID,
      role: user.role,
    };
  }
  /**
   *
   * @param payload
   * @returns
   */
  static createJWT(payload: Payload): string {
    const token = sign(payload.payload, <string>config.JWT_SECRET, {
      expiresIn: "1h",
    });
    return token;
  }
  /**
   *
   * @param cookieObject
   * @param userPayload
   * @returns
   */
  static attachCookiesToResponse(
    cookieObject: AttachCookiesToResponse,
    userPayload: UserAttributes
  ): string {
    let { res, refreshToken } = cookieObject;
    const user = JWTService.tokenUser(userPayload);
    const accessTokenJWT = JWTService.createJWT({ payload: { user } });
    const refreshTokenJWT = JWTService.createJWT({
      payload: { user, refreshToken },
    });
    const oneHour = 60 * 60 * 1000;
    const sixHours = 6 * 60 * 60 * 1000;

    res.cookie("accessToken", accessTokenJWT, {
      httpOnly: true,
      signed: true,
      expires: new Date(Date.now() + oneHour),
      secure: false,
    });

    res.cookie("refreshToken", refreshTokenJWT, {
      httpOnly: true,
      signed: true,
      expires: new Date(Date.now() + sixHours),
      secure: false,
    });

    return accessTokenJWT;
  }
}

export default JWTService;
