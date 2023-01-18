export type Movie = {
  id: string;
  title: string;
  releaseDate: Date;
};

export type MovieRepository = {
  findUpcomingList(date: Date): Promise<Movie[]>;
};
