import express from "express";
import bodyParser from "body-parser";
import { movieListHandler } from "./handler/movie";
import { movieRepositoryBuilder } from "./infra/movie";
import { PrismaClient } from "@prisma/client";
import { playRepositoryBuilder } from "./infra/play";

const prisma = new PrismaClient();

const requestContext = {
  movieRepository: movieRepositoryBuilder(prisma),
  playRepository: playRepositoryBuilder(prisma),
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
app.get("/movies", movieListHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
