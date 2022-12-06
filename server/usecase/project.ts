import { Project, ProjectRepository, validateProject } from "../domain/project";

export const createProjectUsecase =
  (repo: ProjectRepository) =>
  async (project: Omit<Project, "id" | "createdAt">): Promise<Project> => {
    const validateResult = validateProject(project);
    if (validateResult) {
      throw new Error(validateResult.join("\n"));
    }
    return repo.create(project);
  };
