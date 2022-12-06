import { Request, RequestHandler } from "express";
import { createProjectUsecase } from "../usecase/project";
import { decoratedProjectName, Project } from "../domain/project";

const projectForRender = (project: Project) => ({
  ...project,
  name: decoratedProjectName(project),
});

type ListQuery = {
  page?: string;
};

export const projectListHandler: RequestHandler = async (
  req: Request<{}, {}, {}, ListQuery>,
  res
) => {
  const { projectRepository } = req.context;
  const { query } = req;
  const page = query.page ? parseInt(query.page) : 1;
  const limit = 20;
  try {
    const projects = await projectRepository.list(
      limit,
      (page - 1) * limit || 0
    );
    const totalCount = await projectRepository.count();
    res.json({
      totalCount: totalCount,
      items: projects.map((p) => projectForRender(p)),
    });
  } catch (e) {
    res.status(500);
    res.json({ message: e.message });
  }
};

type CreateBody = {
  name?: string;
};

export const projectCreateHandler: RequestHandler = async (
  req: Request<{}, {}, CreateBody, {}>,
  res
) => {
  if (!req.body.name) {
    res.status(400);
    res.json({ message: "Name must be present." });
    return;
  }

  const { projectRepository } = req.context;
  try {
    const createdProject = await createProjectUsecase(projectRepository)({
      name: req.body.name,
    });
    res.status(201);
    res.json({ project: projectForRender(createdProject) });
  } catch (e) {
    res.status(500);
    res.json({ message: e.message });
  }
};
