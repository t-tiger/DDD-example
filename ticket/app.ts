import express from "express";
import bodyParser from "body-parser";
import { PrismaClient } from "@prisma/client";
import { movieUpcomingListHandler } from "./handler/movie";
import { movieQueryBuilder } from "./infra/movie";
import {
  screenCreateHandler,
  screenDeleteHandler,
  screenUpdateHandler,
} from "./handler/screen";
import { screenRepositoryBuilder } from "./infra/screen";
import { reservationCreateHandler } from "./handler/reservation";
import { reservationRepositoryBuilder } from "./infra/reservation";

const prisma = new PrismaClient({ log: ["query"] });

const requestContext = {
  prisma,
  movieQuery: movieQueryBuilder(prisma),
  screenRepository: screenRepositoryBuilder(prisma),
  reservationRepository: reservationRepositoryBuilder(prisma),
};

declare global {
  namespace Express {
    interface Request {
      context: typeof requestContext;
    }
  }
}
const app = express();
const port = 4000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  req.context = requestContext;
  next();
});
app.get("/theaters/:id(\\d+)/movies/upcoming", movieUpcomingListHandler);
app.post("/reservations", reservationCreateHandler);
app.post("/admin/screens", screenCreateHandler);
app.patch("/admin/screens/:id", screenUpdateHandler);
app.delete("/admin/screens/:id", screenDeleteHandler);

app.listen(port, () => {
  console.log(`Starting app on http:localhost:${port}`);
});

process.on("SIGTERM", () => process.exit());
