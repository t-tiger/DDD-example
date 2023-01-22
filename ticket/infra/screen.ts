import { PrismaClient, Screen } from "@prisma/client";
import { ScreenAggregate, ScreenRepository } from "../domain/screen";

export const screenRepositoryBuilder = (
  prisma: PrismaClient
): ScreenRepository => {
  return {
    create: async (screen: ScreenAggregate): Promise<Screen["id"]> => {
      return prisma.$transaction(async (tx) => {
        const createdScreen = await tx.screen.create({
          data: {
            name: screen.name,
            theaterId: screen.theaterId,
          },
        });
        await tx.screenOption.createMany({
          data: screen.options.map((option) => ({
            name: option.name,
            extraPrice: option.extraPrice,
            screenId: createdScreen.id,
          })),
        });

        return createdScreen.id;
      });
    },
    delete: async (id: Screen["id"]): Promise<boolean> => {
      return prisma.$transaction(async (tx) => {
        await tx.screenOption.deleteMany({ where: { screenId: id } });
        await tx.screen.delete({ where: { id } });
        return true;
      });
    },
  };
};
