import { Movie } from "./movie";
import { Screen } from "./screen";

export type Play = {
  id: number;
  movieId: number;
  movie?: Movie;
  screenId: number;
  screen?: Screen;
  datetime: Date;
};

export type PlayRepository = {
  findUpcomingListPerMovie(
    date: Date,
    movieIds: Movie["id"][],
    options: { limitPerMovie: number }
  ): Promise<Record<Movie["id"], Play[]>>;
};
