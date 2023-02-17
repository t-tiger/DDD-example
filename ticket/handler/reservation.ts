import { z } from "zod";
import { RequestHandler } from "express";
import { handleError } from "./error";
import { validateReservationCreate } from "../domain/reservation";

const ReservationCreate = z.object({
  numberOfAdults: z.number(),
  numberOfChildren: z.number(),
  paymentType: z.union([z.literal("credit"), z.literal("cash")]),
  showingId: z.string(),
  seatIds: z.array(z.string()),
  priceOptions: z.array(z.object({ name: z.string(), price: z.number() })),
});

export const reservationCreateHandler: RequestHandler = async (req, res) => {
  const { prisma, reservationRepository } = req.context;
  try {
    const params = ReservationCreate.parse(req.body);
    const showing = await prisma.showing.findFirstOrThrow({
      where: { id: params.showingId },
    });
    const customerId = "1"; // Value should be obtained by authentication

    const validated = await validateReservationCreate(req.context)({
      showingId: params.showingId,
      customerId,
      numberOfAdults: params.numberOfAdults,
      numberOfChildren: params.numberOfChildren,
      payment: { type: params.paymentType },
      priceOptions: params.priceOptions,
      seats: params.seatIds.map((id) => ({ id })),
      showing: { datetime: showing.datetime },
    });
    const reservation = await reservationRepository.create(validated);

    res.status(201);
    res.json({ id: reservation.id });
  } catch (e: any) {
    handleError(e, res);
  }
};
