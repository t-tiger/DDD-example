import { z } from "zod";
import { RequestHandler } from "express";
import { handleError } from "./error";

const ScreenCreate = z.object({
  name: z.string().trim(),
  theaterId: z.number().int(),
  options: z.array(
    z.object({
      name: z.string().trim(),
      extraPrice: z.number(),
    })
  ),
});

export const screenCreateHandler: RequestHandler = async (req, res) => {
  const { screenRepository } = req.context;

  try {
    const body = ScreenCreate.parse(req.body);
    const createdId = await screenRepository.create(body);

    res.status(201);
    res.json({ id: createdId });
  } catch (e: any) {
    handleError(e, res)
  }
};

export const screenUpdateHandler: RequestHandler = async (req, res) => {
  const { screenRepository } = req.context;

  try {
    const body = ScreenCreate.parse(req.body);
    const id = Number(req.params.id);
    await screenRepository.update({ ...body, id });

    res.status(200);
    res.json({ success: true });
  } catch (e: any) {
    handleError(e, res)
  }
};

const ScreenDelete = z.object({
  id: z.number(),
});

export const screenDeleteHandler: RequestHandler = async (req, res) => {
  const { screenRepository } = req.context;

  try {
    const { id } = ScreenDelete.parse(req.params);
    await screenRepository.delete(id);

    res.status(200);
    res.json({ success: true });
  } catch (e: any) {
    handleError(e, res)
  }
};
