import { PrismaClient } from "@prisma/client";
import { Movie } from "../domain/movie";
import { Play, PlayRepository } from "../domain/play";
import { Screen } from "../domain/screen";

export const playRepositoryBuilder = (prisma: PrismaClient): PlayRepository => {
  return {
    findUpcomingListPerMovie: (
      date: Date,
      movieIds: Movie["id"][],
      options: { limitPerMovie: number }
    ): Promise<Record<Movie["id"], Play[]>> => {
      return Promise.resolve({
        1: [
          {
            id: 1,
            movieId: 2,
            screenId: 3,
            datetime: new Date(),
          },
        ],
      });
    },
  };
};
