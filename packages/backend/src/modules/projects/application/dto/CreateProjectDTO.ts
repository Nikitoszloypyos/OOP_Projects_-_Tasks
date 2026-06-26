import type { ProjectDTO } from './ProjectDTO';

export interface CreateProjectRequestDTO {
      actorId: string;
      ownerId?: string;
      name: string;
      description?: string | null;
}

export interface CreateProjectResponseDTO {
      project: ProjectDTO;
}
