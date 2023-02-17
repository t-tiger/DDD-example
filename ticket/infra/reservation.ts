import { PrismaClient, Reservation, Seat } from "@prisma/client";
import {
  calculateReservationPrice,
  ReservationCreate,
  ReservationRepository,
} from "../domain/reservation";

export const reservationRepositoryBuilder = (
  prisma: PrismaClient
): ReservationRepository => {
  return {
    async isReserved(reservation: {
      seats: Array<Pick<Seat, "id">>;
    }): Promise<boolean> {
      const seatIds = reservation.seats.map(({ id }) => id);
      const reservedCount = await prisma.reservation.count({
        where: {
          seats: { some: { id: { in: seatIds } } },
          canceled: false,
        },
      });
      return reservedCount > 0;
    },
    async create(reservation: ReservationCreate): Promise<Reservation> {
      const { payment, priceOptions } = reservation;

      return prisma.$transaction(async (tx) => {
        const createdReservation = await tx.reservation.create({
          data: {
            showingId: reservation.showingId,
            customerId: reservation.customerId,
            numberOfAdults: reservation.numberOfAdults,
            numberOfChildren: reservation.numberOfChildren,
            canceled: false,
          },
        });
        const createdPayment = await tx.payment.create({
          data: {
            type: payment.type,
            reservationId: createdReservation.id,
            price: calculateReservationPrice(reservation),
            paid: true,
          },
        });
        await tx.priceOption.createMany({
          data: priceOptions.map((priceOption) => ({
            name: priceOption.name,
            price: priceOption.price,
            paymentId: createdPayment.id,
          })),
        });

        return createdReservation;
      });
    },
  };
};
