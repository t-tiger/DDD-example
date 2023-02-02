import { v4 } from "uuid";
import { PrismaClient, Screen } from "@prisma/client";
import {
  calculateReservationPrice,
  ReservationCreate,
  ReservationRepository,
} from "../domain/reservation";

export const reservationRepositoryBuilder = (
  prisma: PrismaClient
): ReservationRepository => {
  return {
    create: async (reservation: ReservationCreate): Promise<Screen["id"]> => {
      // NOTE: Instead of checking here, we can take Functional modeling approach in a different way
      if (
        (await prisma.reservation.count({
          where: { id: reservation.seat.id },
        })) > 0
      ) {
        throw new Error(
          "Reservation already exists on the same seat and play."
        );
      }

      return prisma.$transaction(async (tx) => {
        const createdReservation = await tx.reservation.create({
          data: {
            id: v4(),
            price: calculateReservationPrice(reservation),
            playId: reservation.play.id,
            seatId: reservation.seat.id,
            customerId: reservation.customer.id,
          },
        });
        await tx.reservationDiscount.createMany({
          data: reservation.discounts.map((d) => ({
            id: v4(),
            reservationId: createdReservation.id,
            discountId: d.id,
          })),
        });

        return createdReservation.id;
      });
    },
  };
};
