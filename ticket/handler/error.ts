import { ZodError } from "zod";
import { Response } from "express";

export const handleZodError = (e: ZodError, res: Response) => {
  res.status(400);
  res.json({ errors: e });
};
