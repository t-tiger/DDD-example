import { RequestHandler } from "express";

export const movieUpcomingListHandler: RequestHandler = async (req, res) => {
  const { prisma, movieQuery } = req.context;
  const theaterId = Number(req.params.id);
  try {
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
    res.status(500);
    res.json({ message: e.message });
  }
};
