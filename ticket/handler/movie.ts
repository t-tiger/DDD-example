import { z } from "zod";
import { RequestHandler } from "express";
import { handleError } from "./error";

const MovieUpcomingList = z.object({
  theaterId: z.number(),
});

export const movieUpcomingListHandler: RequestHandler = async (req, res) => {
  const { prisma, movieQuery } = req.context;
  try {
    const { theaterId } = MovieUpcomingList.parse(req.params);
    const movieIds = await movieQuery.findUpcomingIds(theaterId, 20);
    const movies = await prisma.movie.findMany({
      where: { id: { in: movieIds } },
      include: { plays: { include: { screen: true } } },
    });

    res.json({
      movies: movies.map(({ id, title, releaseDate, plays }) => ({
        id,
        title,
        releaseDate,
        plays: plays.map(({ id, datetime, screen }) => ({
          id,
          datetime,
          screen: {
            id: screen.id,
            name: screen.name,
          },
        })),
      })),
    });
  } catch (e: any) {
    handleError(e, res);
  }
};
