import { Response } from "express";

export interface AttachCookiesToResponse {
  res: Response;
  refreshToken: string;
}
export interface Payload {
  payload: object;
}
