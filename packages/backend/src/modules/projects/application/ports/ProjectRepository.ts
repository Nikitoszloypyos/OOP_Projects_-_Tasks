import type { Project } from '../../domain/entities';

export interface ProjectRepository {
      save(project: Project): Promise<void>;
      findById(id: string): Promise<Project | null>;
      listByUserId(userId: string): Promise<Project[]>;
}
