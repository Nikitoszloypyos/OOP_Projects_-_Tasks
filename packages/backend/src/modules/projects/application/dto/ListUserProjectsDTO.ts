import type { ProjectDTO } from './ProjectDTO';

export interface ListUserProjectsRequestDTO {
      userId: string;
}

export interface ListUserProjectsResponseDTO {
      projects: ProjectDTO[];
}
