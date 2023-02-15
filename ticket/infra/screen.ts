import { Prisma, PrismaClient, Screen } from "@prisma/client";
import { ScreenCreate, ScreenRepository, ScreenUpdate } from "../domain/screen";
import TransactionClient = Prisma.TransactionClient;

export const screenRepositoryBuilder = (
  prisma: PrismaClient
): ScreenRepository => {
  const createOptions =
    (tx: TransactionClient) =>
    (data: Pick<ScreenUpdate, "id" | "optionIds">) => {
      return tx.screenOptionRelation.createMany({
        data: data.optionIds.map((optionId) => ({
          screenId: data.id,
          optionId,
        })),
      });
    };

  return {
    create: async (screen: ScreenCreate): Promise<Screen["id"]> => {
      return prisma.$transaction(async (tx) => {
        const createdScreen = await tx.screen.create({
          data: {
            screenSize: screen.screenSize,
            theaterId: screen.theaterId,
          },
        });
        await createOptions(tx)({
          id: createdScreen.id,
          optionIds: screen.optionIds,
        });

        return createdScreen.id;
      });
    },
    update: async (screen: ScreenUpdate): Promise<boolean> => {
      if ((await prisma.screen.count({ where: { id: screen.id } })) === 0) {
        throw new Error(`Screen ID ${screen.id} not found`);
      }

      return prisma.$transaction(async (tx) => {
        await tx.screenOptionRelation.deleteMany({
          where: { screenId: screen.id },
        });
        await tx.screen.update({
          data: { screenSize: screen.screenSize, theaterId: screen.theaterId },
          where: { id: screen.id },
        });
        await createOptions(tx)(screen);

        return true;
      });
    },
    delete: async (id: Screen["id"]): Promise<boolean> => {
      return prisma.$transaction(async (tx) => {
        await tx.screenOptionRelation.deleteMany({ where: { screenId: id } });
        await tx.screen.delete({ where: { id } });
        return true;
      });
    },
  };
};
