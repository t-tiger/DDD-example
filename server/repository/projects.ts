import { Project } from "../domain/project";

export type ProjectRepository = {
  count(): Promise<number>;
  list(limit: number, offset: number): Promise<Project[]>;
  create(project: Omit<Project, "id" | "createdAt">): Promise<Project>;
};

// On-memory store
const onMemoryProjects = [] as Project[];

export const projectRepositoryBuilder = (): ProjectRepository => {
  return {
    count(): Promise<number> {
      return Promise.resolve(onMemoryProjects.length);
    },
    list(limit: number, offset: number): Promise<Project[]> {
      return Promise.resolve(onMemoryProjects.slice(offset, offset + limit));
    },
    create(project: Omit<Project, "id" | "createdAt">): Promise<Project> {
      const createdProject: Project = {
        ...project,
        id: new Date().getTime().toString(),
        createdAt: new Date(),
      };
      onMemoryProjects.push(createdProject);

      return Promise.resolve(createdProject);
    },
  };
};
