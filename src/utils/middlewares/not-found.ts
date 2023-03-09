import { Request, Response } from "express";
import OutputResponse from "../interfaces/outputResponse";
const notFound = (req: Request, res: Response) => {
  const output: OutputResponse = {
    status: "failed",
    message: "Route does not exist",
  };
  res.status(404).json(output);
};
export default notFound;
