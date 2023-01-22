import { z, ZodError } from "zod";
import { RequestHandler } from "express";

const CreateParams = z.object({
  name: z.string(),
  theaterId: z.number().int(),
  options: z.array(
    z.object({
      name: z.string(),
      extraPrice: z.number(),
    })
  ),
});

export const screenCreateHandler: RequestHandler = async (req, res) => {
  const { screenRepository } = req.context;

  try {
    const body = CreateParams.parse(req.body);
    const createdId = await screenRepository.create(body);

    res.status(201);
    res.json({ id: createdId });
  } catch (e: any) {
    if (e instanceof ZodError) {
      res.status(400);
      res.json({ errors: e });
      return;
    }
    res.status(500);
    res.json({ message: e.message });
  }
};

export const screenDeleteHandler: RequestHandler = async (req, res) => {
  const { screenRepository } = req.context;

  try {
    const id = Number(req.params.id)
    await screenRepository.delete(id)

    res.status(200);
    res.json({ success: true });
  } catch (e: any) {
    res.status(500);
    res.json({ message: e.message });
  }
};
