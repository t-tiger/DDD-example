export type ShowingRepository = {
  exists(id: string): Promise<boolean>;
};
