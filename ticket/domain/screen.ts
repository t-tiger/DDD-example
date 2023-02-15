import { Screen, ScreenOption } from "@prisma/client";

export type ScreenUpdate = Pick<Screen, "id" | "screenSize" | "theaterId"> & {
  optionIds: Array<ScreenOption['id']>
};
export type ScreenCreate = Omit<ScreenUpdate, "id">;

export type ScreenRepository = {
  create(screen: ScreenCreate): Promise<Screen["id"]>;
  update(screen: ScreenUpdate): Promise<boolean>;
  delete(id: Screen["id"]): Promise<boolean>;
};
