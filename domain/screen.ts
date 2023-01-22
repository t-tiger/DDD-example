import { Theater } from "./theater";
import { Movie } from "./movie";

export type Screen = {
  id: number;
  name: string;
  theaterId: number;
  theater?: Theater;
  movieId: number;
  movie?: Movie;
  options: ScreenOption[]
};

export type ScreenOption = {
  id: number
  name: string
  extraPrice: number
}