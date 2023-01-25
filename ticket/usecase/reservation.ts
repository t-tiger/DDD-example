import {
  Customer,
  Discount,
  Play,
  PrismaClient,
  Reservation,
  Seat,
} from "@prisma/client";
import { ReservationRepository } from "../domain/reservation";

export const createReservationUsecase =
  ({
    prisma,
    create,
  }: {
    prisma: PrismaClient;
    create: ReservationRepository["create"];
  }) =>
  async (params: {
    playId: Play["id"];
    seatId: Seat["id"];
    customerId: Customer["id"];
    discountIds: Array<Discount["id"]>;
  }): Promise<Reservation["id"]> => {
    const play = await prisma.play.findFirstOrThrow({
      where: { id: params.playId },
    });
    const screenOptions = await prisma.screenOption.findMany({
      include: {
        screen: { include: { seats: { where: { id: params.seatId } } } },
      },
    });
    const customer = await prisma.customer.findFirstOrThrow({
      where: { id: params.customerId },
    });
    const discounts = await prisma.discount.findMany({
      where: { id: { in: params.discountIds } },
    });

    return await create({
      customer,
      seat: { id: params.seatId },
      discounts,
      play,
      screenOptions,
    });
  };
