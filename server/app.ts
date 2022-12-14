import express from "express";
import bodyParser from "body-parser";
import { ProjectRepository } from "./domain/project";
import { projectCreateHandler, projectListHandler } from "./handler/project";
import { projectRepositoryBuilder } from "./infra/project";

export type RequestContext = {
  projectRepository: ProjectRepository;
};

declare global {
  namespace Express {
    interface Request {
      context: RequestContext;
    }
  }
}
const app = express();
const port = 4000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  req.context = { projectRepository: projectRepositoryBuilder() };
  next();
});
app.get("/projects", projectListHandler);
app.post("/projects", projectCreateHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
