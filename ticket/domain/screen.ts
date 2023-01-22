import { Screen, ScreenOption } from "@prisma/client";

export type ScreenAggregate = Pick<Screen, "name" | "theaterId"> & {
  options: Array<Pick<ScreenOption, "name" | "extraPrice">>;
};

export type ScreenRepository = {
  create(screen: ScreenAggregate): Promise<Screen["id"]>;
  delete(id: Screen["id"]): Promise<boolean>;
};
