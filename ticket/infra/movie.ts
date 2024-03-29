import { PrismaClient, Movie, Theater } from "@prisma/client";

export const movieQueryBuilder = (prisma: PrismaClient) => {
  return {
    findUpcomingIds: async (
      theaterId: Theater["id"],
      limit: number
    ): Promise<Movie["id"][]> => {
      const data = await prisma.showing.findMany({
        where: {
          datetime: { gte: new Date() },
          screen: {
            theaterId,
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
