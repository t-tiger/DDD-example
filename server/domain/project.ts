export type Project = {
  id: string;
  name: string;
  createdAt: Date;
};

export const decoratedProjectName = (project: Pick<Project, "name">) =>
  `✨✨${project.name}✨✨`;

export const validateProject = (
  project: Omit<Project, "id" | "createdAt">
): string[] | null => {
  const errors: string[] = [];

  if (project.name.trim().length === 0) {
    errors.push("Project name must be present.");
  }
  if (project.name.trim().length > 100) {
    errors.push("The length of project name must be less than 100.");
  }
  return errors.length >= 1 ? errors : null;
};
