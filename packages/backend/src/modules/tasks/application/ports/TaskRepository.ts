import type { Task } from '../../domain/entities';

export interface TaskRepository {
      save(task: Task): Promise<void>;
      findById(id: string): Promise<Task | null>;
      listByProjectId(projectId: string): Promise<Task[]>;
}
