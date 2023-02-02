import { v4 } from "uuid";
import { Prisma, PrismaClient, Screen } from "@prisma/client";
import { ScreenCreate, ScreenRepository, ScreenUpdate } from "../domain/screen";
import TransactionClient = Prisma.TransactionClient;

export const screenRepositoryBuilder = (
  prisma: PrismaClient
): ScreenRepository => {
  const createOptions =
    (tx: TransactionClient) => (data: Pick<ScreenUpdate, "id" | "options">) => {
      return tx.screenOption.createMany({
        data: data.options.map((option) => ({
          id: v4(),
          name: option.name,
          extraPrice: option.extraPrice,
          screenId: data.id,
        })),
      });
    };

  return {
    create: async (screen: ScreenCreate): Promise<Screen["id"]> => {
      return prisma.$transaction(async (tx) => {
        const createdScreen = await tx.screen.create({
          data: {
            id: v4(),
            name: screen.name,
            theaterId: screen.theaterId,
          },
        });
        await createOptions(tx)({
          id: createdScreen.id,
          options: screen.options,
        });

        return createdScreen.id;
      });
    },
    update: async (screen: ScreenUpdate): Promise<boolean> => {
      if ((await prisma.screen.count({ where: { id: screen.id } })) === 0) {
        throw new Error(`Screen ID ${screen.id} not found`);
      }

      return prisma.$transaction(async (tx) => {
        await tx.screenOption.deleteMany({ where: { screenId: screen.id } });
        await tx.screen.update({
          data: { name: screen.name, theaterId: screen.theaterId },
          where: { id: screen.id },
        });
        await createOptions(tx)(screen);

        return true;
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
