import {Screen} from "./screen";

export type Theater = {
  id: number
  name: string;
  address: string
  screens?: Screen[]
};
