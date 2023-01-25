import { z, ZodError } from "zod";
import { RequestHandler } from "express";
import { handleZodError } from "./error";
import { createReservationUsecase } from "../usecase/reservation";

const ReservationCreate = z.object({
  playId: z.number(),
  seatId: z.number(),
  discountIds: z.array(z.number()),
});

export const reservationCreateHandler: RequestHandler = async (req, res) => {
  const {
    prisma,
    reservationRepository: { create },
  } = req.context;
  try {
    const params = ReservationCreate.parse(req.body);
    const customerId = 1; // Value should be obtained by authentication
    const reservationId = await createReservationUsecase({ prisma, create })({
      ...params,
      customerId,
    });

    res.status(201);
    res.json({ id: reservationId });
  } catch (e: any) {
    if (e instanceof ZodError) {
      handleZodError(e, res);
      return;
    }
    res.status(500);
    res.json({ message: e.message });
  }
};
