import { PrismaClient, Movie, Theater } from "@prisma/client";

export const movieQueryBuilder = (prisma: PrismaClient) => {
  return {
    findUpcomingIds: async (
      theaterId: Theater["id"],
      limit: number
    ): Promise<Movie["id"][]> => {
      const data = await prisma.play.findMany({
        where: {
          datetime: { gte: new Date() },
          screen: {
            theaterId: 1,
          },
        },
        take: limit,
        orderBy: { datetime: "asc" },
        select: { movieId: true },
        distinct: ["movieId"],
      });
      return data.map((play) => play.movieId);
    },
  };
};
