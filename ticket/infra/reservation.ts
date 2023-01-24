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
      const price = calculateReservationPrice(reservation);

      return 0;
    },
  };
};
