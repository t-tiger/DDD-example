import { RequestHandler } from "express";

export const movieListHandler: RequestHandler = async (req, res) => {
  const { movieRepository, playRepository } = req.context;
  try {
    const movies = await movieRepository.findUpcomingList(new Date());
    const playsPerMovie = await playRepository.findUpcomingListPerMovie(
      new Date(),
      movies.map((m) => m.id),
      { limitPerMovie: 5 }
    );
    res.json({
      movies: movies.map((m) => ({
        id: m.id,
        title: m.title,
        releaseDate: m.releaseDate,
        plays: (playsPerMovie[m.id] || []).map((p) => ({
          screenName: p.screen?.name || "",
          datetime: p.datetime,
        })),
      })),
    });
  } catch (e) {
    res.status(500);
    res.json({ message: e.message });
  }
};
