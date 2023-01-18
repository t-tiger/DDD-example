import { Movie, MovieRepository } from "../domain/movie";
import { PrismaClient } from "@prisma/client";

export const movieRepositoryBuilder = (
  prisma: PrismaClient
): MovieRepository => {
  return {
    findUpcomingList: async (date: Date): Promise<Movie[]> => {
      return [];
    },
  };
};
