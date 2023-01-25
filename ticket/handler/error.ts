import { ZodError } from "zod";
import { Response } from "express";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

export const handleError = (e: any, res: Response) => {
  if (e instanceof PrismaClientKnownRequestError) {
    if (e.code === "P2025") {
      res.status(404);
      res.json({ errors: e.message });
    }
  }
  if (e instanceof ZodError) {
    res.status(400);
    res.json({ errors: e });
    return;
  }
  res.status(500);
  res.json({ message: e.message });
};
