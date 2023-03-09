import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";
const validateResource =
  (schema: ObjectSchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    await schema.validateAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  };

export default validateResource;
