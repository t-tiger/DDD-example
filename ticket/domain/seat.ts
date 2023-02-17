export type SeatRepository = {
  exists(id: string): Promise<boolean>;
};
