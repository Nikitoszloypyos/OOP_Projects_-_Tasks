import type { Project } from '../../domain/entities';
import type { ProjectDTO } from '../dto';

export function projectToDto(project: Project): ProjectDTO {
      const snapshot = project.toSnapshot();

      return {
            id: snapshot.id,
            ownerId: snapshot.ownerId,
            name: snapshot.name,
            description: snapshot.description,
            isArchived: snapshot.isArchived,
            createdAt: snapshot.createdAt.toISOString(),
            updatedAt: snapshot.updatedAt.toISOString()
      };
}
