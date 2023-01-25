import { RequestHandler } from "express";
import { handleError } from "./error";

export const disCountListHandler: RequestHandler = async (req, res) => {
  const { prisma } = req.context;

  try {
    const discounts = await prisma.discount.findMany();
    res.json({
      discounts: discounts.map((d) => ({
        id: d.id,
        name: d.name,
        price: d.price,
      })),
    });
  } catch (e: any) {
    handleError(e, res);
  }
};
