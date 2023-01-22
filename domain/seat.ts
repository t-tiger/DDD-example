import { Screen } from "./screen";

export type Seat = {
  id: number;
  number: string;
  screenId: number;
  screen?: Screen;
};
