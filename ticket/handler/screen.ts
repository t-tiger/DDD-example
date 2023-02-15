import { z } from "zod";
import { RequestHandler } from "express";
import { handleError } from "./error";

const ScreenCreate = z.object({
  name: z.string().trim(),
  screenSize: z.string().trim(),
  theaterId: z.string().trim(),
  optionIds: z.array(z.string()),
});

export const screenCreateHandler: RequestHandler = async (req, res) => {
  const { screenRepository } = req.context;

  try {
    const body = ScreenCreate.parse(req.body);
    const createdId = await screenRepository.create(body);

    res.status(201);
    res.json({ id: createdId });
  } catch (e: any) {
    handleError(e, res);
  }
};

export const screenUpdateHandler: RequestHandler = async (req, res) => {
  const { screenRepository } = req.context;

  try {
    const body = ScreenCreate.parse(req.body);
    const id = req.params.id;
    await screenRepository.update({ ...body, id });

    res.status(200);
    res.json({ success: true });
  } catch (e: any) {
    handleError(e, res);
  }
};

const ScreenDelete = z.object({
  id: z.string(),
});

export const screenDeleteHandler: RequestHandler = async (req, res) => {
  const { screenRepository } = req.context;

  try {
    const { id } = ScreenDelete.parse(req.params);
    await screenRepository.delete(id);

    res.status(200);
    res.json({ success: true });
  } catch (e: any) {
    handleError(e, res);
  }
};
